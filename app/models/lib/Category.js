const mongoose = require('mongoose');

const CategorySchema = mongoose.Schema({
    sCategoryName: {
        type: String,
        index: true
    }
},
    { timestamps: true }
);

module.exports = mongoose.model('categories', CategorySchema);
