const mongoose = require("mongoose");

const UserModelSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
    },
    lastName: {
      type: String,
      required: true,
    },
    userName: {
      type: String,
      required: false,
      default: "User",
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    dob: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: false,
      default:
        "https://s3.ap-southeast-2.amazonaws.com/cdn.greekherald.com.au/wp-content/uploads/2020/07/05194617/default-avatar.png",
    },
    profileCover: {
      type: String,
      required: false,
      default:
        "https://images.squarespace-cdn.com/content/v1/58586fa5ebbd1a60e7d76d3e/1494409187514-MSDQ228RFH6IOVK8NZMK/image-asset.jpeg",
    },
    location: {
      type: String,
      required: false,
      default: "41.9027835, 12.4963655",
    },
    todos: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Todos",
        default: [],
      },
    ],
  },
  {
    timestamps: true,
    strict: true,
  }
);

module.exports = mongoose.model("User", UserModelSchema, "users");
