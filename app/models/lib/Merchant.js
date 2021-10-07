const mongoose = require("mongoose");

// Merchant Schema
const MerchantSchema = mongoose.Schema(
  {
    sName: {
      type: String,
      trim: true,
    },
    sEmail: {
      type: String,
      unique: true,
    },
    sPhoneNumber: {
      type: String,
    },
    sBrand: {
      type: String,
    },
    sBusiness: {
      type: String,
      trim: true,
    },
    bIsActive: {
      type: Boolean,
      default: false,
    },
    eStatus: {
      type: String,
      default: "Waiting Approval",
      enum: ["Waiting Approval", "Rejected", "Approved"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Merchant", MerchantSchema);
