const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const options = {
  separator: "-",
  lang: "en",
  truncate: 120,
};

mongoose.plugin(slug, options);

// Product Schema
const ProductSchema = mongoose.Schema(
  {
    oCategoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "categories",
    },
    sName: {
      type: String,
      trim: true,
    },
    slug: {
      type: String,
      slug: "name",
      unique: true,
    },
    sDescription: {
      type: String,
      trim: true,
    },
    nPrice: {
      type: Number,
      default: 1,
    },
    sImageUrl: {
      type: String,
    },
    sImageKey: {
      type: String,
    },
    nQuantity: {
      type: Number,
      default: 1,
    },
    bIsActive: {
      type: Boolean,
      default: true,
    },
    bTaxable: {
      type: Boolean,
      default: false,
    },
    oBrandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);
