const express = require("express");
const mongoose = require("mongoose");

const bcrypt = require("bcrypt");

const UserModel = require("../models/userModel");
const TodosModel = require("../models/todosModel");
const MoneyboxModel = require("../models/moneyboxModel");
const TransactionModel = require("../models/transactionsModel");
const WishlistModel = require("../models/wishlistModel");

const user = express.Router();

//? middlewares IMPORT
const verifyToken = require("../middlewares/verifyToken");
const cloudinaryUpload = require("../middlewares/cloudUpload");

//! POST propic/img in Cloudinary
user.post("/users/cloudinaryUpload", cloudinaryUpload.single("avatar"), async (req, res) => {
  try {
    res.status(200).send({
      statusCode: 200,
      message: "Avatar successfully uploaded to Cloud",
      avatar: req.file.path,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Avatar upload error occurs, please try again",
    });
  }
});

//! GET all users
user.get("/users", verifyToken, async (req, res) => {
  try {
    const users = await UserModel.find().populate({
      path: "todos",
      select: "content",
    });

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

//! GET a specific user by its ID
user.get("/users/:userId", verifyToken, async (req, res) => {
  const { userId } = req.params;

  try {
    const userById = await UserModel.findById(userId);
    res.status(200).send({
      statusCode: 200,
      message: `here's author with id: ${userId}`,
      userById,
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

  try {
    // Trova e elimina l'utente
    const userToDelete = await UserModel.findByIdAndDelete(userId);

    if (!userToDelete) {
      return res.status(404).send({
        statusCode: 404,
        message: `User with id '${userId}' not found in DB`,
      });
    }

    // Elimina il Moneybox dell'utente
    await MoneyboxModel.findOneAndDelete({ user: userId });

    // Trova e elimina i Todos dell'utente
    await TodosModel.deleteMany({ user: userId });

    // Trova il Moneybox dell'utente e poi elimina le Transazioni collegate ad esso
    const moneybox = await MoneyboxModel.findOne({ user: userId });
    if (moneybox) {
      await TransactionsModel.deleteMany({ moneybox: moneybox._id });
    }

    // Elimina la Wishlist dell'utente
    await WishlistModel.deleteMany({ user: userId });

    res.status(200).send({
      statusCode: 200,
      message: `User with id: ${userId} and associated data successfully deleted from DB`,
      userToDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//? --------------> TODOS ROUTES RELATIVE TO SPECIFIC USER
//! GET all todos relative to a single user
user.get("/users/:userId/todos", async (req, res) => {
  const { userId } = req.params;

  const user = await UserModel.findById(userId).populate({ path: "todos" });

  const todos = user.todos;

  if (!todos) {
    return res.status(404).send({
      statusCode: 404,
      message: `User with ID: ${userId} does not have any todo yet`,
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      countTodos: todos.length,
      todos,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//! POST new todo relative to a specific user
user.post("/users/:userId/todos/create", async (req, res) => {
  const { userId } = req.params;

  const user = await UserModel.findById(userId);
  const newTodo = new TodosModel({
    user: user._id,
    content: req.body.content,
  });

  try {
    const todo = await newTodo.save();

    await UserModel.findByIdAndUpdate(userId, { $push: { todos: todo } });

    res.status(200).send({
      statusCode: 200,
      mesage: "New Todo saved successfully",
      payload: todo,
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

//! GET a specific ToDo relative to a specific user
user.get("/users/:userId/todos/:todoId", async (req, res) => {
  const { userId, todoId } = req.params;

  const user = await UserModel.findById(userId);
  const todo = await TodosModel.findById(todoId);

  if (!todo) {
    return res.status(404).send({
      statusCode: 404,
      message: `todo with ID: ${todoId} not found in DB`,
    });
  }

  try {
    res.status(200).send({
      statusCode: 200,
      message: `Here's todo with ID: ${todoId}`,
      user: user.firstName,
      todo,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//! PATCH a specific ToDo relative to a specific user
user.patch("/users/:userId/todos/:todoId/edit", async (req, res) => {
  const { userId, todoId } = req.params;
  const user = await UserModel.findById(userId);
  const todo = await TodosModel.findById(todoId);

  if (!todo) {
    return res.status(404).send({
      statusCode: 404,
      message: `Todo with ID: ${todoId} not found relative to user: ${user.firstName}`,
    });
  }

  try {
    const dataToUpdate = req.body;
    const options = { new: true };
    const result = await TodosModel.findByIdAndUpdate(todoId, dataToUpdate, options);

    res.status(200).send({
      statusCode: 200,
      message: `Todo with ID: ${todoId} successfully edited`,
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

//! DELETE a specific ToDo relative to a specific user
user.delete("/users/:userId/todos/:todoId/delete", async (req, res) => {
  const { userId, todoId } = req.params;
  const user = await UserModel.findById(userId);
  const todo = await TodosModel.findById(todoId);

  if (!todo) {
    return res.status(404).send({
      statusCode: 404,
      message: `Todo with ID: ${todoId} not found in DB in order to delete it`,
    });
  }

  try {
    const todoToDelete = await TodosModel.findByIdAndDelete(todoId);
    user.todos.pull(todoId);
    await user.save();

    res.status(200).send({
      statusCode: 200,
      message: `Todo with ID: ${todoId} relative to ${user.firstName} successfully deleted from DB`,
      todoToDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal Server Error",
      error,
    });
  }
});

//! DELETE all ToDos relative to a specific user
user.delete("/users/:userId/todos/delete-all", async (req, res) => {
  const { userId } = req.params;
  const user = await UserModel.findById(userId);
  const userTodos = await TodosModel.find();

  if (!userTodos) {
    return res.status(404).send({
      statusCode: 404,
      message: `No todos relative to ${user.firstName} found in DB`,
    });
  }

  try {
    const todosToDelete = await TodosModel.deleteMany({ user: user._id });
    user.todos = [];
    await user.save();

    res.status(200).send({
      statusCode: 200,
      message: `All todos relative to ${user.firstName} have been removed from DB`,
      todosToDelete,
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
