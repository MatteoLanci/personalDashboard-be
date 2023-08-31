const mongoose = require("mongoose");

const WishlistModelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
    price: {
      type: Number,
      required: true,
    },
    url: {
      type: String,
      required: false,
      default: "",
    },
    description: {
      type: String,
      required: false,
      default: "",
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

module.exports = mongoose.model("Wishlist", WishlistModelSchema, "wishlist");
