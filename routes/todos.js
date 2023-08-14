const express = require("express");

const TodosModel = require("../models/todosModel");
const UserModel = require("../models/userModel");

const todo = express.Router();

//! GET all todos in DB
todo.get("/todos", async (req, res) => {
  try {
    const todos = await TodosModel.find().populate("user");

    if (!todos || todos.length === 0) {
      return res.status(404).send({
        statusCode: 404,
        message: "No Todos found in DB",
      });
    }

    res.status(200).send({
      statusCode: 200,
      message: "Here all Todos in DB",
      todosCount: todos.length,
      todos,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//! POST new Todo for specific user
todo.post("/todos/create", async (req, res) => {
  const user = await UserModel.findOne({ _id: req.body.user });

  const newTodo = new TodosModel({
    user: user._id,
    content: req.body.content,
  });

  try {
    const todo = await newTodo.save();

    res.status(200).send({
      statusCode: 200,
      message: "New ToDo saved successfully",
      payload: todo,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//! PATCH a specific todo
todo.patch("/todos/:todoId", async (req, res) => {
  const { todoId } = req.params;
  const todoExists = await TodosModel.findById(todoId);

  if (!todoExists) {
    return res.status(404).send({
      statusCode: 404,
      message: `Todo with id: ${todoId} not found in DB`,
    });
  }

  try {
    const dataToUpdate = req.body;
    const options = { new: true };

    const result = await TodosModel.findByIdAndUpdate(todoId, dataToUpdate, options);

    res.status(200).send({
      statusCode: 200,
      message: "Todo updated successfully",
      result,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

//! DELETE a specific Todo from DB
todo.delete("/todos/:todoId/delete", async (req, res) => {
  const { todoId } = req.params;
  const todoExists = await TodosModel.findById(todoId);

  if (!todoExists) {
    return res.status(404).send({
      statusCode: 404,
      message: `Todo with ID: ${todoId} not found so can't be delete from DB`,
    });
  }

  try {
    const todoToDelete = await TodosModel.findByIdAndDelete(todoId);

    res.status(200).send({
      statusCode: 200,
      message: `Todo with ID: ${todoId} successfully deleted from DB`,
      todoToDelete,
    });
  } catch (error) {
    res.status(500).send({
      statusCode: 500,
      message: "Internal server error",
      error,
    });
  }
});

module.exports = todo;
