const mongoose = require("mongoose");

// Order Schema
const OrderSchema = mongoose.Schema(
  {
    oCartId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cart",
    },
    oUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    nTotal: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);
