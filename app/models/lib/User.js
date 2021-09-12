const mongoose = require("mongoose");

const UsersSchema = mongoose.Schema(
  {
    sEmail: {
      type: String,
      unique: true,
      required: true,
    },
    sUsername: {
      type: String,
      required: true,
    },
    oName: {
      sFirstname: String,
      sLastname: String,
    },
    sRole: {
      type: String,
      enum: ["user", "admin", "merchant"],
      default: "user",
    },
    oMerchantId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Merchant",
      default: null,
    },
    sStatus: String,
    sHash: String,
    sResetPasswordToken: String,
    sResetPasswordExpires: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UsersSchema);
