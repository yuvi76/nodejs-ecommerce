const { Merchant, User, Brand } = require('../../../models');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const crypto = require('crypto');
const { nodemailer } = require('../../../utils');
const controllers = {};

// Seller Request
controllers.sellerRequest = (req, res) => {
    try {
        // if (!req.userId) return res.reply(messages.unauthorized());
        const merchant = new Merchant({
            sName: req.body.sName,
            sEmail: req.body.sEmail,
            sPhoneNumber: req.body.sPhoneNumber,
            sBrand: req.body.sBrand,
            sBusiness: req.body.sBusiness,
        });

        merchant.save()
            .then((result) => {
                return res.reply(messages.no_prefix(`We received your request! we will reach you on your phone number ${req.body.sPhoneNumber}!`), result);
            })
            .catch((error) => {
                console.log("error from mongo" + error);
                return res.reply(messages.server_error());
            });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};


// Get all merchants api
controllers.list = async (req, res, next) => {
    try {
        await Merchant.find({}, null, { sort: { _id: -1 } }, (err, merchants) => {
            if (err) return res.reply(messages.error())
            return res.reply(messages.successfully('Merchant List'), merchants);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Update merchant status by id
controllers.updateMerchantById = async (req, res, next) => {
    try {
        let oMerchant = {
            bIsActive: req.body.bIsActive,
            eStatus: req.body.eStatus,
        }
        await Merchant.findOneAndUpdate({ _id: req.params.id, eStatus: "Waiting Approval" }, oMerchant, { new: true }, async (err, merchant) => {
            if (err) return res.reply(messages.error());
            if (!merchant) return res.reply(messages.not_found('Merchant'));

            if (merchant.eStatus === "Approved") {
                await createMerchantUser(
                    merchant.sEmail,
                    merchant.sName,
                    req.params.id,
                    req.headers.host
                )
            }
            return res.reply(messages.updated('Merchant'), merchant);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Delete Merchant by id
controllers.deleteMerchantById = async (req, res, next) => {
    try {
        await Merchant.deleteOne({ _id: req.params.id }, (err, merchant) => {
            if (err)
                return res.reply(messages.error());
            if (!merchant)
                return res.reply(messages.not_found('Merchant'));
            return res.reply(messages.deleted('Merchant'));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

// Merchant Signup
controllers.merchantSignup = async (req, res, next) => {
    try {
        const { sEmail, sFirstname, sLastname, sPassword } = req.body;

        const aUser = await User.findOne({
            sEmail,
            sResetPasswordToken: req.params.token
        });

        const hash = await bcrypt.hash(sPassword, saltRounds);

        await User.findOneAndUpdate({ _id: aUser._id }, { sEmail, oName: { sFirstname, sLastname }, sHash: hash, sResetPasswordToken: undefined }, { new: true });

        const aMerchant = await Merchant.findOne({ sEmail });

        await createMerchantBrand(aMerchant);
        return res.reply(messages.successfully('Merchant Signup'));
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}


const createMerchantBrand = async ({ _id, sBrand, sBusiness }) => {
    const newBrand = new Brand({
        sName: sBrand,
        sDescription: sBusiness,
        oMerchantId: _id,
        bIsActive: false
    });

    return await newBrand.save();
};

const createMerchantUser = async (sEmail, sName, oMerchantId, host) => {

    const existingUser = await User.findOne({ sEmail });

    if (existingUser) {

        const aMerchant = await Merchant.findOne({
            sEmail
        });

        await createMerchantBrand(aMerchant);

        nodemailer.send('merchant_welcome.html', {
            SITE_NAME: 'E-commerce',
            USERNAME: sName,
        }, {
            from: process.env.SMTP_USERNAME,
            to: sEmail,
            subject: 'Merchant Welcome'
        })

        return await User.findOneAndUpdate({ _id: existingUser._id }, { oMerchantId, role: "merchant" }, { new: true });
    } else {
        var sResetPasswordToken = '';
        crypto.randomBytes(20, async function (err, buf) {
            sResetPasswordToken = buf.toString('hex');
            if (err) console.log("crypto error");

            const user = new User({
                sEmail,
                sUsername: sName,
                oName: { sFirstname: sName },
                sResetPasswordToken,
                oMerchantId,
                sRole: "merchant"
            });

            nodemailer.send('merchant_signup.html', {
                SITE_NAME: 'E-commerce',
                USERNAME: sName,
                ACTIVELINK: `${process.env.BASE_URL}:${process.env.PORT}/merchant-signup/${sResetPasswordToken}?email=${sEmail}`
            }, {
                from: process.env.SMTP_USERNAME,
                to: sEmail,
                subject: 'Merchant Registration'
            })

            return await user.save();
        });
    }
};
module.exports = controllers;
