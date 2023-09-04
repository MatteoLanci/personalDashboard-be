const mongoose = require("mongoose");

const TransactionsModelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    moneybox: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moneybox",
    },
    value: {
      type: Number,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Transactions", TransactionsModelSchema, "transactions");
