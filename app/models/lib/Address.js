const mongoose = require("mongoose");

// Address Schema
const AddressSchema = mongoose.Schema(
  {
    oUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    sAddress: String,
    sCity: String,
    sState: String,
    sCountry: String,
    sZipCode: String,
    bIsDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Address", AddressSchema);
