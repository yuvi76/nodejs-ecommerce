const { User } = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const crypto = require('crypto');
const { nodemailer } = require('../../../utils');

const controllers = {};

let signJWT = function (user) {
    return jwt.sign({
        id: user._id,
        sUsername: user.sUsername,
        sEmail: user.sEmail,
        sRole: user.sRole,
        oMerchantId: user.oMerchantId
    }, process.env.JWT_SECRET);
}

// Register User
controllers.register = (req, res) => {
    try {
        if (!req.body.sPassword) return res.reply(messages.required_field('Password'));
        if (_.isPassword(req.body.sPassword)) return res.reply(messages.invalid("Password"));
        bcrypt.hash(req.body.sPassword, saltRounds, (err, hash) => {
            if (err) return res.reply(messages.error())
            if (!req.body.sEmail) return res.reply(messages.required_field('Email'));
            if (!req.body.sFirstname || !req.body.sLastname) return res.reply(messages.required_field('Full Name'));
            if (_.isEmail(req.body.sEmail)) return res.reply(messages.no_prefix('Please Enter Valid Email.'));
            if (_.isValidString(req.body.sFirstname) || _.isValidName(req.body.sFirstname) || _.isEmptyString(req.body.sFirstname)) return res.reply(messages.invalid("First Name"));
            if (_.isValidString(req.body.sLastname) || _.isValidName(req.body.sLastname) || _.isEmptyString(req.body.sLastname)) return res.reply(messages.invalid("Last Name"));
            if (_.isValidString(req.body.sUsername) || _.isValidName(req.body.sUsername) || _.isEmptyString(req.body.sUsername)) return res.reply(messages.invalid("Username"));
            const user = new User({
                sEmail: req.body.sEmail,
                sUsername: req.body.sUsername,
                oName: {
                    sFirstname: req.body.sFirstname,
                    sLastname: req.body.sLastname,
                },
                sHash: hash
            });

            user.save()
                .then((result) => {
                    let token = signJWT(user);
                    return res.reply(messages.successfully('User Register'), { auth: true, token });
                })
                .catch((error) => {
                    console.log("error from mongo" + error);
                    return res.reply(messages.already_exists('User'));
                });
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// User Login
controllers.login = (req, res) => {
    try {
        if (!req.body.sEmail) return res.reply(messages.required_field('Email'));
        if (!req.body.sPassword) return res.reply(messages.required_field('Password'));
        if (_.isEmail(req.body.sEmail)) return res.reply(messages.no_prefix('Please Enter Valid Email.'));
        User.findOne({ sEmail: req.body.sEmail }, (err, user) => {
            if (err) return res.reply(messages.error());
            if (!user) return res.reply(messages.not_found('User'));
            console.log(user);
            bcrypt.compare(req.body.sPassword, user.sHash, (err, result) => {
                if (err) if (err) return res.reply(messages.error());
                console.log(user._id);
                if (result) {
                    // req.session["_id"] = user._id;
                    var token = signJWT(user);
                    console.log("user login succesful");
                    return res.reply(messages.successfully('User Login'), { auth: true, token });
                } else {
                    return res.reply(messages.wrong_credentials());
                }
            });
        })
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

controllers.logout = (req, res, next) => {
    try {
        if (!req.userId) return res.reply(messages.unauthorized());
        User.findOne({
            _id: req.userId
        }, (err, user) => {
            // req.session.destroy();
            if (err) return res.reply(messages.server_error());
            if (!user) return res.reply(messages.not_found('User'));
            return res.reply(messages.successfully('Logout'), {
                auth: false,
                token: null
            });
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

controllers.passwordReset = (req, res, next) => {
    try {
        if (!req.body.sEmail) return res.reply(messages.required_field('Email ID'));
        if (_.isEmail(req.body.sEmail)) return res.reply(messages.no_prefix('Please Enter Valid Email.'));

        var randomHash = '';
        crypto.randomBytes(20, function (err, buf) {
            randomHash = buf.toString('hex');
            if (err) console.log("crypto error");
        });

        User.findOne({
            sEmail: req.body.sEmail
        }, (err, user) => {
            if (err) return res.reply(messages.error())
            if (!user) return res.reply(messages.not_found('User'));

            User.findOneAndUpdate({
                sEmail: user.sEmail
            }, {
                $set: {
                    sResetPasswordToken: randomHash,
                    sResetPasswordExpires: Date.now() + 600
                }
            }, {
                upsert: true
            })
                .then((doc) => {
                    console.log("reset token saved");
                })
                .catch((err) => {
                    console.log("error " + err);
                });
            nodemailer.send('forgot_password_mail.html', {
                SITE_NAME: 'E-commerce',
                USERNAME: user.oName.sFirstname,
                ACTIVELINK: `${process.env.BASE_URL}:${process.env.PORT}/api/v1/auth/reset/${randomHash}`
            }, {
                from: process.env.SMTP_USERNAME,
                to: user.sEmail,
                subject: 'Forgot Password'
            })
            return res.reply(messages.successfully('Email Sent'));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

controllers.passwordResetGet = (req, res, next) => {

    try {

        if (!req.params.token) return res.reply(messages.not_found("Token"));

        User.findOne({
            sResetPasswordToken: req.params.token
        }, function (err, user) {
            if (!user) {
                return res.render('error/token_expire')
            }
            return res.render('Admin/resetPassword')
        });
    } catch (error) {
        return res.reply(messages.server_error());
    }

}

controllers.passwordResetPost = (req, res, next) => {
    try {

        if (!req.params.token) return res.reply(messages.not_found("Token"));
        if (!req.body.sPassword) return res.reply(messages.not_found("Password"));
        if (!req.body.sConfirmPassword) return res.reply(messages.not_found("Confirm Password"));

        if (_.isPassword(req.body.sPassword)) return res.reply(messages.invalid("Password"));
        if (_.isPassword(req.body.sConfirmPassword)) return res.reply(messages.invalid("Confirm Password"));

        User.findOne({
            sResetPasswordToken: req.params.token
        }, function (err, user) {
            if (!user) return res.render('error/token_expire')
            if (req.body.sConfirmPassword !== req.body.sPassword)
                return res.reply(messages.bad_request('Password not matched'));

            bcrypt.hash(req.body.sConfirmPassword, saltRounds, (err, hash) => {
                if (err) return res.reply(messages.error());

                user.sHash = hash;
                user.sResetPasswordToken = undefined;
                user.sResetPasswordExpires = undefined;

                user.save((err) => {
                    if (err) return res.reply(messages.error());
                    return res.reply(messages.updated('Password'));
                })
            });
        });
    } catch (error) {
        return res.reply(messages.server_error());
    }
}

module.exports = controllers;
