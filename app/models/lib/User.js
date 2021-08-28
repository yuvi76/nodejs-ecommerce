const mongoose = require('mongoose');

const User = mongoose.Schema(
    {}
);

module.exports = mongoose.model('users', User);
