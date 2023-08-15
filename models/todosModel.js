const mongoose = require("mongoose");

const TodosModelSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    content: {
      type: String,
      required: true,
    },
    priority: {
      type: Boolean,
      required: false,
      default: false,
    },
    expireDate: {
      type: Date,
      required: false,
      default: Date.now,
    },
    completed: {
      type: Boolean,
      required: false,
      default: false,
    },
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("Todos", TodosModelSchema, "todos");
