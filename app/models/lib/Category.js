const mongoose = require("mongoose");
const slug = require("mongoose-slug-generator");

const options = {
  separator: "-",
  lang: "en",
  truncate: 120,
};

mongoose.plugin(slug, options);

// Category Schema
const CategorySchema = mongoose.Schema(
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
    aProducts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Category", CategorySchema);
