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
    latestTransactions: {
      type: [{ type: mongoose.Schema.Types.ObjectId, ref: "Transactions" }],
      default: [],
    },
    totalAmount: {
      type: Number,
      required: false,
      default: 0,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Moneybox", MoneyboxModelSchema, "moneybox");
