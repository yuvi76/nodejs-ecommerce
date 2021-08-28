const mongoose = require('mongoose');
var mongoosePaginate = require("mongoose-paginate");

const ProductSchema = mongoose.Schema({
    sCategoryId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "category",
    },
    sName: {
        type: String,
        trim: true,
    },
    sDescription: {
        type: String,
        trim: true,
    },
    nPrice: {
        type: Number,
        default: 1,
    },
    sProductImage: {
        type: String,
    },
    nQuantity: {
        type: Number,
        default: 1,
    },
    bStatus: {
        type: Boolean,
        default: true
    }
},
    { timestamps: true }
);

ProductSchema.plugin(mongoosePaginate);
module.exports = mongoose.model('product', ProductSchema);
