const mongoose = require("mongoose");

// Wishlist Schema
const WishlistSchema = mongoose.Schema(
  {
    oProductId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      default: null,
    },
    oUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    bIsLiked: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
