const { Address } = require("../../../models");
const controllers = {};

// Add Address
controllers.add = (req, res) => {
    try {
        const address = new Address(Object.assign(req.body, { oUserId: req.userId }));

        address.save().then((result) => {
            return res.reply(messages.added("Address"), result);
        }).catch((error) => {
            console.log("error from mongo" + error);
            return res.reply(messages.server_error());
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get All Address
controllers.getAddress = async (req, res, next) => {
    try {
        await Address.find({ oUserId: req.userId }, (err, addresses) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.successfully("Address List"), {
                count: addresses.length,
                addresses,
            });
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Get Address By Id
controllers.getAddressById = async (req, res, next) => {
    try {
        await Address.findById(req.params.id, (err, address) => {
            if (err) return res.reply(messages.error());
            if (!address) return res.reply(messages.required_field("Address"));
            return res.reply(messages.successfully("Address Detail"), {
                address,
            });
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Update Address By Id
controllers.updateAddressById = async (req, res, next) => {
    try {
        await Address.findByIdAndUpdate(req.params.id, req.body, { new: true }, (err, address) => {
            if (err) return res.reply(messages.error());
            if (!address) return res.reply(messages.not_found("Address"));
            return res.reply(messages.updated("Address Detail"), address);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

// Delete Address By Id
controllers.deleteAddressById = async (req, res, next) => {
    try {
        await Address.deleteOne({ _id: req.params.id }, (err, address) => {
            if (err) return res.reply(messages.error());
            return res.reply(messages.deleted("Address"));
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};
module.exports = controllers;
