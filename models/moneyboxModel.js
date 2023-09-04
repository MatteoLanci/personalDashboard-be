const mongoose = require("mongoose");

const MoneyboxModelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    wishlist: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wishlist",
    },
    totalAmount: {
      type: Number,
      required: false,
    },
    latestTransactions: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Transactions",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Moneybox", MoneyboxModelSchema, "moneybox");
