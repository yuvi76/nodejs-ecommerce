const { Brand } = require("../../../models");
const controllers = {};

// Add Brand
controllers.add = (req, res) => {
    try {
        if (!req.body.sName || _.isEmptyString(req.body.sName)) return res.reply(messages.required_field("Name"));
        if (!req.body.sDescription || _.isEmptyString(req.body.sDescription)) return res.reply(messages.required_field("Description"));

        const brand = new Brand({
            sName: req.body.sName,
            sDescription: req.body.sDescription,
            bIsActive: req.body.bIsActive
        });

        brand.save().then((result) => {
            return res.reply(messages.added("Brand"), result);
        }).catch((error) => {
            console.log("error from mongo" + error);
            return res.reply(messages.server_error());
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get All Brand
controllers.getBrand = async (req, res, next) => {
    try {
        await Brand.find({ bIsActive: true }).populate('oMerchantId').exec((err, Brandes) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.successfully("Brand List"), {
                count: Brandes.length,
                Brandes,
            });
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get Brands
controllers.getBrandbyMerchant = async (req, res, next) => {
    try {
        if (req.role == "merchant") {
            Brand.find({ oMerchantId: req.userId }).populate('oMerchantId', 'sUsername').exec((err, Brandes) => {
                if (err) return res.reply(messages.error());
                return res.reply(messages.successfully("Brand List"), {
                    count: Brandes.length,
                    Brandes,
                });
            });
        } else {
            Brand.find({}).populate('oMerchantId').exec((err, Brandes) => {
                if (err) return res.reply(messages.error());
                return res.reply(messages.successfully("Brand List"), {
                    count: Brandes.length,
                    Brandes,
                });
            });
        }
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get Brand By Id
controllers.getBrandById = async (req, res, next) => {
    try {
        await Brand.findById(req.params.id, (err, Brand) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.successfully("Brand Detail"), Brand);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Update Brand By Id
controllers.updateBrandById = async (req, res, next) => {
    try {
        await Brand.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, brand) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.updated("Brand Detail"), brand);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Delete Brand By Id
controllers.deleteBrandById = async (req, res, next) => {
    try {
        await Brand.deleteOne({ _id: req.params.id }, (err, brand) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.deleted("Brand"));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};
module.exports = controllers;
