const mongoose = require("mongoose");

// Review Schema
const ReviewSchema = mongoose.Schema(
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
    sTitle: {
      type: String,
      trim: true,
    },
    nRating: {
      type: Number,
      default: 0,
    },
    sReview: {
      type: String,
      trim: true,
    },
    bIsRecommended: {
      type: Boolean,
      default: true,
    },
    eStatus: {
      type: String,
      default: "Waiting Approval",
      enum: ["Waiting Approval", "Rejected", "Approved"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Review", ReviewSchema);
