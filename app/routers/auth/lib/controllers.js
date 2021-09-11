const { User } = require('../../../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const saltRounds = 10;
const controllers = {};

let signJWT = function (user) {
    return jwt.sign({
        id: user._id,
        sUsername: user.sUsername,
        sEmail: user.sEmail,
        sRole: user.sRole,
    }, process.env.JWT_SECRET);
}

// Register User
controllers.register = (req, res) => {
    try {
        bcrypt.hash(req.body.sPassword, saltRounds, (err, hash) => {
            if (err) return res.reply(messages.error())
            if (!req.body.sEmail) return res.reply(messages.required_field('Email'));
            if (_.isEmail(req.body.sEmail)) return res.reply(messages.invalid('Email ID'));

            const user = new User({
                sEmail: req.body.sEmail,
                sUsername: req.body.sUsername,
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
        if (_.isEmail(req.body.sEmail)) return res.reply(messages.invalid('Email ID'));
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

module.exports = controllers;
