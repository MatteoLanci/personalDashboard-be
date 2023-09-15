const express = require("express");

const UserModel = require("../models/userModel");
const MoneyboxModel = require("../models/moneyboxModel");
const WishlistModel = require("../models/wishlistModel");
const TransactionModel = require("../models/transactionsModel");

const purchase = express.Router();

purchase.post("/users/:userId/:moneyboxId/:productId/purchase", async (req, res) => {
  try {
    const { userId, productId, moneyboxId } = req.params;

    const user = await UserModel.findById(userId);

    const wishlistItem = await WishlistModel.findById(productId);
    const userMoneybox = await MoneyboxModel.findById(moneyboxId);

    if (!wishlistItem) {
      return res.status(404).json({
        statusCode: 404,
        message: "Item not found in this wishlist",
      });
    }

    if (!wishlistItem.completed) {
      wishlistItem.completed = true;
      await wishlistItem.save();
    }

    const updatedTotalAmount = userMoneybox.totalAmount - wishlistItem.price;

    userMoneybox.totalAmount = updatedTotalAmount;
    await userMoneybox.save();

    const newTransaction = new TransactionModel({
      user: user._id,
      moneybox: userMoneybox._id,
      value: wishlistItem.price,
      description: wishlistItem.content,
    });
    // await newTransaction.save();

    const userTransaction = newTransaction.save();
    userMoneybox.latestTransactions.push(userTransaction);
    await userMoneybox.save();

    res.status(200).send({
      statusCode: 200,
      message: "Wishlist element successfully completed through moneybox savings",
      NewMoneyboxTotalAmount: updatedTotalAmount,
      transaction: userTransaction,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

module.exports = purchase;
