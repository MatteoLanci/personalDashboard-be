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

//! POST new transaction for specific moneybox
transactions.post("/users/:userId/moneybox/:moneyboxId/transactions/create", async (req, res) => {
  const { userId, moneyboxId } = req.params;
  const user = await UserModel.findById(userId);
  const userMoneybox = await MoneyboxModel.findById(moneyboxId);

  const newTransaction = new TransactionsModel({
    user: user._id,
    moneybox: userMoneybox._id,
    value: req.body.value,
    description: req.body.description,
  });

  try {
    const userTransaction = await newTransaction.save();

    userMoneybox.latestTransactions.push(userTransaction);
    await userMoneybox.save();

    res.status(200).send({
      statusCode: 200,
      message: `New transaction succesfully saved for user: ${user.firstName}`,
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

//! GET all transactions for specific moneybox
transactions.get("/users/:userId/moneybox/:moneyboxId/transactions", async (req, res) => {
  const { userId, moneyboxId } = req.params;
  const user = await UserModel.findById(userId);
  const userMoneybox = await MoneyboxModel.findById(moneyboxId);
  const userTransactions = await MoneyboxModel.findById(moneyboxId).populate("latestTransactions");

  if (!userMoneybox) {
    return res.status(404).send({
      statusCode: 404,
      message: `No moneybox found for user: ${user.firstName}`,
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      message: `Here latest transactions for ${user.firstName}'s moneybox`,
      transactionsCount: userMoneybox.latestTransactions.length,
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

//! PATCH specific transaction for specific moneybox
transactions.patch(
  "/users/:userId/moneybox/:moneyboxId/transactions/:transactionId/edit",
  async (req, res) => {
    const { userId, moneyboxId, transactionId } = req.params;
    const user = await UserModel.findById(userId);
    const userMoneybox = await MoneyboxModel.findById(moneyboxId);
    const userTransaction = await TransactionsModel.findById(transactionId);

    if (!userTransaction) {
      return res.status(404).send({
        statusCode: 404,
        message: `Transaction with ID: ${transactionId} not found in ${user.firstName}'s moneybox`,
      });
    }

    try {
      const dataToUpdate = req.body;
      const options = { new: true };
      const result = await TransactionsModel.findByIdAndUpdate(
        transactionId,
        dataToUpdate,
        options
      );

      res.status(200).send({
        statusCode: 200,
        message: `Tranasction with ID: ${transactionId} succesfully edited in ${user.firstName}'s moneybox`,
        result,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error",
        error,
      });
    }
  }
);

//! DELETE specific transaction in specific user's moneybox
transactions.delete(
  "/users/:userId/moneybox/:moneyboxId/transactions/:transactionId/delete",
  async (req, res) => {
    const { userId, moneyboxId, transactionId } = req.params;
    const user = await UserModel.findById(userId);
    const userMoneybox = await MoneyboxModel.findById(moneyboxId);
    const userTransaction = await TransactionsModel.findById(transactionId);

    if (!userTransaction) {
      return res.status(404).send({
        statusCode: 404,
        message: `Transaction with ID: ${transactionId} not found in ${user.firstName}'s moneybox`,
      });
    }

    try {
      const dataToDelete = await TransactionsModel.findByIdAndDelete(transactionId);
      await MoneyboxModel.findByIdAndUpdate(moneyboxId, {
        $pull: { latestTransactions: transactionId },
      });
      await userMoneybox.save();

      res.status(200).send({
        statusCode: 200,
        message: `Transaction with ID: ${transactionId} removed from ${user.firstName}'s moneybox`,
        dataToDelete,
      });
    } catch (error) {
      res.status(500).send({
        statusCode: 500,
        message: "Internal Server Error",
        error,
      });
    }
  }
);

//! DELETE all transactions from specific user's moneybox
//TODO not working properly ---> check it
transactions.delete("/users/:userId/moneybox/:monyeboxId/transactions/clear", async (req, res) => {
  const { userId, moneyboxId } = req.params;
  const user = await UserModel.findById(userId);
  const userMoneybox = await MoneyboxModel.findById(moneyboxId);
  const userTransactions = await MoneyboxModel.findById(moneyboxId).populate("latestTransactions");

  if (!userTransactions) {
    return res.status(404).send({
      statusCode: 404,
      message: `No transactions found in ${user.firstName}'s moneybox`,
    });
  }

  try {
    const dataToDelete = await TransactionsModel.deleteMany({ moneybox: moneyboxId });

    userMoneybox.userTransactions.latestTransactions = [];
    await userMoneybox.save();

    res.status(200).send({
      statusCode: 200,
      message: `All transactions successfully removed from ${user.firstName}'s moneybox`,
      dataToDelete,
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
