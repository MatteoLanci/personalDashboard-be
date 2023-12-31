const express = require("express");
const mongoose = require("mongoose");

const UserModel = require("../models/userModel");
const WishlistModel = require("../models/wishlistModel");
const MoneyboxModel = require("../models/moneyboxModel");
const TransactionsModel = require("../models/transactionsModel");

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
moneybox.post("/users/:userId/moneybox/create", async (req, res) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId);

  const newMoneybox = new MoneyboxModel({
    user: user._id,
    totalAmount: req.body.totalAmount,
  });

  try {
    const userMoneybox = await newMoneybox.save();

    await UserModel.findByIdAndUpdate(userId, { moneybox: userMoneybox });

    res.status(200).send({
      statusCode: 200,
      message: `New Moneybox saved successfully for user: ${user.firstName}`,
      payload: userMoneybox,
      new: true,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//!PATCH specific moneybox for specific user
moneybox.patch("/users/:userId/moneybox/:moneyboxId/edit", async (req, res) => {
  const { userId, moneyboxId } = req.params;
  const user = await UserModel.findById(userId);
  const userMoneybox = await MoneyboxModel.findById(moneyboxId);

  if (!userMoneybox) {
    return res.status(404).send({
      statusCode: 404,
      message: `No moneybox found for user: ${user.firstName} in DB`,
    });
  }

  try {
    const dataToUpdate = req.body;
    const options = { new: true };
    const result = await MoneyboxModel.findByIdAndUpdate(moneyboxId, dataToUpdate, options);

    console.log(req.body);
    res.status(200).send({
      statusCode: 200,
      message: `${user.firstName}'s moneybox successfully edited`,
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//!DELETE moneybox for specific user
moneybox.delete("/users/:userId/moneybox/:moneyboxId/delete", async (req, res) => {
  const { userId, moneyboxId } = req.params;
  const user = await UserModel.findById(userId);
  const userMoneybox = await MoneyboxModel.findById(moneyboxId);

  if (!userMoneybox) {
    return res.status(404).send({
      statusCode: 404,
      message: `No moneybox found for user with id: ${userId} in DB`,
    });
  }

  try {
    const moneyboxToDelete = await MoneyboxModel.findByIdAndDelete(moneyboxId);
    await UserModel.updateOne({ _id: userId }, { $unset: { moneybox: 1 } });
    await user.save();

    res.status(200).send({
      statusCode: 200,
      message: `${userId}'s moneybox successfully removed from DB`,
      moneyboxToDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

module.exports = moneybox;
