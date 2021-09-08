const mongoose = require("mongoose");

// Cart Item Schema
const CartItemSchema = mongoose.Schema({
  oProductId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Product",
  },
  nQuantity: Number,
  nPurchasePrice: {
    type: Number,
    default: 0,
  },
  nTotalPrice: {
    type: Number,
    default: 0,
  },
  nPriceWithTax: {
    type: Number,
    default: 0,
  },
  nTotalTax: {
    type: Number,
    default: 0,
  },
  eStatus: {
    type: String,
    default: "Not processed",
    enum: ["Not processed", "Processing", "Shipped", "Delivered", "Cancelled"],
  },
});

module.exports = mongoose.model("CartItem", CartItemSchema);

// Cart Schema
const CartSchema = mongoose.Schema(
  {
    aProducts: [CartItemSchema],
    oUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Cart", CartSchema);
