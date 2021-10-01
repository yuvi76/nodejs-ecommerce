const { User } = require('../../../models');
const controllers = {};

// Get User Details
controllers.profile = (req, res) => {
    try {
        if (!req.userId) return res.reply(messages.unauthorized());
        User.findOne({
            _id: req.userId
        }, {
            oName: 1,
            sUsername: 1,
            sEmail: 1
        }, (err, user) => {
            if (err) return res.reply(messages.server_error());
            if (!user) return res.reply(messages.not_found('User'));
            return res.reply(messages.no_prefix('User Details'), user);
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
};

controllers.updateProfile = async (req, res, next) => {
    try {
        if (!req.userId) return res.reply(messages.unauthorized());

        let oProfileDetails = {};

        if (!req.body.sUsername) return res.reply(messages.not_found("Username"));
        if (!req.body.sFirstname) return res.reply(messages.not_found("First Name"));
        if (!req.body.sLastname) return res.reply(messages.not_found("Last Name"));

        if (_.isValidString(req.body.sFirstname) || _.isValidName(req.body.sFirstname)) return res.reply(messages.invalid("First Name"));
        if (_.isValidString(req.body.sLastname) || _.isValidName(req.body.sLastname)) return res.reply(messages.invalid("Last Name"));
        if (_.isValidString(req.body.sUsername) || _.isValidName(req.body.sUsername)) return res.reply(messages.invalid("Username"));


        oProfileDetails = {
            sUsername: req.body.sUsername,
            oName: {
                sFirstname: req.body.sFirstname,
                sLastname: req.body.sLastname
            },
        }

        await User.findByIdAndUpdate(req.userId, oProfileDetails,
            (err, user) => {
                if (err) return res.reply(messages.server_error());
                if (!user) return res.reply(messages.not_found('User'));
                // req.session["name"] = req.body.sFirstname;
                return res.reply(messages.updated('User Details'));
            });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

module.exports = controllers;
