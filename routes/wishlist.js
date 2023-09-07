const express = require("express");
const mongoose = require("mongoose");

const UserModel = require("../models/userModel");
const MoneyboxModel = require("../models/moneyboxModel");
const WishlistModel = require("../models/wishlistModel");

const wishlist = express.Router();

//! GET ALL WISHLISTS in DB
wishlist.get("/wishlists", async (req, res) => {
  try {
    const wishlists = await WishlistModel.find();

    if (!wishlists) {
      return res.status(404).send({
        statusCode: 404,
        message: `No wishlists found in DB`,
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Here all wishlists in DB",
      wishlistsCount: wishlists.length,
      wishlists,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//! GET wishlist from a specific user for its ID
wishlist.get("/users/:userId/wishlist", async (req, res) => {
  const { userId } = req.params;

  const user = await UserModel.findById(userId).populate({ path: "wishlist" });

  const wishlist = user.wishlist;

  if (!wishlist || wishlist.length === 0) {
    return res.status(404).send({
      statusCode: 404,
      message: `User with ID: ${userId} does not have any todo yet`,
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      wishlistCount: wishlist.length,
      wishlist,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//! POST new element in user's wishlist
wishlist.post("/users/:userId/wishlist/create", async (req, res) => {
  const { userId } = req.params;

  const user = await UserModel.findById(userId);
  const newWishEl = new WishlistModel({
    user: user._id,
    content: req.body.content,
    price: req.body.price,
    description: req.body.description,
    url: req.body.url,
  });

  try {
    const wishEl = await newWishEl.save();

    await UserModel.findByIdAndUpdate(userId, { $push: { wishlist: wishEl } });

    res.status(200).send({
      statusCode: 200,
      message: `New element in wishlist saved correctly`,
      payload: wishEl,
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

//! PATCH specific element in user's wishlist
wishlist.patch("/users/:userId/wishlist/:wishElId/edit", async (req, res) => {
  const { userId, wishElId } = req.params;
  const user = await UserModel.findById(userId);
  const wishEl = await WishlistModel.findById(wishElId);

  if (!wishEl) {
    return res.status(404).send({
      statusCode: 404,
      message: `Element in ${user.firstName}'s wishlist with ID: ${wishElId} not found in DB`,
    });
  }

  try {
    const dataToUpdate = req.body;
    const options = { new: true };
    const result = await WishlistModel.findByIdAndUpdate(wishElId, dataToUpdate, options);

    res.status(200).send({
      statusCode: 200,
      message: `Element in ${user.firstName}'s wishlist with ID: ${wishElId} successfully edited`,
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

//! DELETE specific element in user's wishlist
wishlist.delete("/users/:userId/wishlist/:wishElId/delete", async (req, res) => {
  const { userId, wishElId } = req.params;
  const user = await UserModel.findById(userId);
  const wishEl = await WishlistModel.findById(wishElId);

  if (!wishEl) {
    return res.status(404).send({
      statusCode: 404,
      message: `Element in ${user.firstName}'s wishlist with ID: ${wishElId} not found in DB`,
    });
  }

  try {
    user.wishlist.pull(wishElId);
    await user.save();
    const wishElToDelete = await WishlistModel.findByIdAndDelete(wishElId);

    res.status(200).send({
      statusCode: 200,
      message: `Element in ${user.firstName}'s wishlist with ID: ${wishElId} successfully removed from DB`,
      wishElToDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//! DELETE all elements from user's wishlist
wishlist.delete("/users/:userId/wishlist/clear", async (req, res) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId);
  const userWishlist = await WishlistModel.find();

  if (!userWishlist) {
    return res.status(404).send({
      statusCode: 404,
      message: `No wishlist found for user: ${user.firstName} in DB`,
    });
  }

  try {
    const wishlistToDelete = await WishlistModel.deleteMany({ user: user._id });
    user.wishlist = [];
    await user.save();

    res.status(200).send({
      statusCode: 200,
      message: `Wishlist for user: ${user.firstName} removed from DB`,
      wishlistToDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

module.exports = wishlist;
