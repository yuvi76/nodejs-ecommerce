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
            sUserName: 1,
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


module.exports = controllers;
