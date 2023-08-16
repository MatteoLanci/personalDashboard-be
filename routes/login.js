const express = require("express");
const login = express.Router();

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");

const UserModel = require("../models/userModel");

login.post("/login", async (req, res) => {
  const user = await UserModel.findOne({ email: req.body.email });
  if (!user) {
    return res.status(404).send({
      statusCode: 404,
      message: "Email or Password not valid",
    });
  }

  const validPassword = await bcrypt.compare(req.body.password, user.password);
  if (!validPassword) {
    return res.status(400).send({
      statusCode: 400,
      message: "Email or Password not valid",
    });
  }

  const token = jwt.sign(
    {
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      dob: user.dob,
      avatar: user.avatar,
      location: user.location,
      id: user._id,
      todos: user.todos,
      profileCover: user.profileCover,
    },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  res.header("Authorization", token).status(200).send({
    statusCode: 200,
    message: "Login successfully!",
    token,
  });
});

module.exports = login;
