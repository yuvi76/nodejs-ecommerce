const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const options = {
  separator: "-",
  lang: "en",
  truncate: 120,
};

mongoose.plugin(slug, options);

// Brand Schema
const BrandSchema = mongoose.Schema(
  {
    sName: {
      type: String,
      trim: true,
      unique: true,
    },
    sSlug: {
      type: String,
      slug: "sName",
      unique: true,
    },
    sImage: {
      data: Buffer,
      contentType: String,
    },
    sDescription: {
      type: String,
      trim: true,
    },
    bIsActive: {
      type: Boolean,
      default: true,
    },
    oMerchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Brand", BrandSchema);
