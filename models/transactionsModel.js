const mongoose = require("mongoose");

const TransactionsModelSchema = new mongoose.Schema(
  {
    value: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    moneybox: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Moneybox",
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Transactions", TransactionsModelSchema, "transactions");
