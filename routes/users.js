const express = require("express");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel");

const user = express.Router();

//! GET all users
user.get("/users", async (req, res) => {
  try {
    const users = await UserModel.find();

    if (!users) {
      return res.status(404).send({
        statusCode: 404,
        message: "Seems like there are no users in DB yet",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Here all users in DB",
      usersCount: users.length,
      users,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//! POST new user to DB
user.post("/users/create", async (req, res) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(req.body.password, salt);

  const newUser = new UserModel({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: hashedPassword,
    dob: req.body.dob,
  });

  try {
    const user = await newUser.save();

    res.status(200).send({
      statusCode: 200,
      message: "New user has been created and added to DB",
      payload: user,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//! PATCH an existing user by its ID
user.patch("/users/:userId", async (req, res) => {
  const { userId } = req.params;

  const userExists = await UserModel.findById(userId);
  if (!userExists) {
    return res.status(404).send({
      statusCode: 404,
      message: `user with id '${userId}' not found in DB`,
    });
  }

  try {
    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await UserModel.findByIdAndUpdate(userId, dataToUpdate, options);

    res.status(200).send({
      statusCode: 200,
      message: `User with id '${userId}' modified correctly`,
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

//! DELETE a specific user from DB by its Id
user.delete("/users/:userId/delete", async (req, res) => {
  const { userId } = req.params;

  const userExists = await UserModel.findByIdAndDelete(userId);
  if (!userExists) {
    return res.status(404).send({
      statusCode: 404,
      message: `user with id '${userId}' not found in DB`,
    });
  }

  try {
    const userToDelete = await UserModel.findByIdAndDelete(userId);

    res.status(200).send({
      statusCode: 200,
      message: `user with id: ${userId} successfully deleted from DB`,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

module.exports = user;
