var jwt = require('jsonwebtoken');
const middleware = {};

middleware.checkUser = (req, res, next) => {
    try {
        // if (!req.session["_id"] && !req.session["admin_id"]) return res.reply(messages.unauthorized());
        var token = req.headers.authorization;
        if (!token) return res.reply(messages.unauthorized());
        token = token.replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) return res.reply(messages.unauthorized());
            if (decoded.sRole === "user") {
                req.userId = decoded.id;
                req.sUsername = decoded.sUsername;
                req.sEmail = decoded.sEmail;
                req.role = decoded.sRole;
                next();
            } else
                return res.reply(messages.unauthorized());
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

middleware.checkAuth = (req, res, next) => {
    try {
        var token = req.headers.authorization;
        if (!token) return res.reply(messages.unauthorized());
        token = token.replace('Bearer ', '');
        jwt.verify(token, process.env.JWT_SECRET, function (err, decoded) {
            if (err) return res.reply(messages.unauthorized());
            if (decoded.sRole === "user") {
                req.userId = decoded.id;
                req.role = decoded.sRole;
                next();
            } else if (decoded.sRole === "admin") {
                req.userId = decoded.id;
                req.role = decoded.sRole;
                next();
            } else
                return res.reply(messages.unauthorized());
        });
    } catch (error) {
        console.log(error);
        return res.reply(messages.server_error());
    }
}

module.exports = middleware;
