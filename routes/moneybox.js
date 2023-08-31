const express = require("express");
const mongoose = require("mongoose");

const UserModel = require("../models/userModel");
const WishlistModel = require("../models/wishlistModel");
const MoneyboxModel = require("../models/moneyboxModel");

const moneybox = express.Router();

//!GET all moneyboxes in DB
moneybox.get("/moneyboxes", async (req, res) => {
  try {
    const moneyboxes = await MoneyboxModel.find();

    if (!moneyboxes) {
      return res.status(404).send({
        statusCode: 404,
        message: `No Moneyboxes found in DB`,
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: `Here all moneyboxes found in DB`,
      moneyBoxesCount: moneyboxes.length,
      moneyboxes,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//!GET specific moneybox for a specific user from its ID
moneybox.get("/users/:userId/moneybox", async (req, res) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId).populate({ path: "moneybox" });

  const moneybox = user.moneybox;

  if (!moneybox) {
    return res.status(404).send({
      statusCode: 404,
      message: `No moneybox found for user: ${user.firstName}`,
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      message: `Here's moneybox for user: ${user.firstName}`,
      moneybox,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//!POST new moneybox for specific user

//!PATCH specific moneybox for specific user

//!DELETE moneybox for specific user

module.exports = moneybox;
