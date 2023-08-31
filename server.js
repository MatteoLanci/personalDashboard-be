const express = require("express");
const mongoose = require("mongoose");

const cors = require("cors");

const PORT = 5050;

require("dotenv").config();

//! Routes import
const UsersRoute = require("./routes/users");
const LoginRoute = require("./routes/login");
const TodosRoute = require("./routes/todos");
const WishlistRoute = require("./routes/wishlist");
const MoneyboxRoute = require("./routes/moneybox");

const app = express();

//! middlewares
app.use(cors());

app.use(express.json());
app.use("/", UsersRoute);
app.use("/", LoginRoute);
app.use("/", TodosRoute);
app.use("/", WishlistRoute);
app.use("/", MoneyboxRoute);

mongoose.connect(process.env.MONGO_DB_URL);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "Server connection error"));
db.once("open", () => {
  console.log("MongoDB database correctly connected");
});

app.listen(PORT, () => console.log(`Server started and listening on port: ${PORT}`));
