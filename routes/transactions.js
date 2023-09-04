const express = require("express");
const mongoose = require("mongoose");

const UserModel = require("../models/userModel");
const MoneyboxModel = require("../models/moneyboxModel");
const TransactionsModel = require("../models/transactionsModel");

const transactions = express.Router();

//!GET all transactions in DB
transactions.get("/transactions", async (req, res) => {
  const transactions = await TransactionsModel.find();
  try {
    if (!transactions || transactions.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No Transactions found in DB",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Here all transactions in DB",
      transactionsCount: transactions.length,
      transactions,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//!GET transactions for specific user's moneybox
transactions.get("/users/:userId/moneybox/:moneyboxId/transactions", async (req, res) => {
  const { userId, moneyboxId } = req.params;
  const user = await UserModel.findById(userId);
  const userMoneybox = await MoneyboxModel.findById(moneyboxId);
  const userTransactions = userMoneybox.latestTransactions;

  if (!userTransactions) {
    return res.status(404).send({
      statusCode: 404,
      message: `no transactions in ${user.firstName}'s moneybox`,
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      message: `Here latest transactions for ${user.firstName}'s moneybox`,
      userTransactions,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//!POST new transactions in user's moneybox
transactions.post("/users/:userId/moneybox/:moneyboxId/transactions/create", async (req, res) => {
  const { userId, moneyboxId } = req.params;
  const user = await UserModel.findById(userId);
  const userMoneybox = await MoneyboxModel.findById(moneyboxId);

  const newTransaction = new TransactionsModel({
    user: user._id,
    moneybox: userMoneybox,
    value: req.body.value,
    description: req.body.description,
  });

  try {
    const userTransaction = newTransaction.save();

    await TransactionsModel.findByIdAndUpdate(moneyboxId, { latestTransactions: userTransaction });

    res.status(200).send({
      statusCode: 200,
      message: `New transactions successfully saved for ${user.firstName}'s moneybox`,
      payload: userTransaction,
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

module.exports = transactions;
