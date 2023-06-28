const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();
const User = require("./models/userSchema");
const jwt = require("jsonwebtoken");
const { useEffect } = require("react");

const db = process.env.DATABASE;

mongoose
  .connect(db)
  .then(async () => {
    console.log("Connected!".bgGreen);
  })
  .catch(() => console.log("Connection Error!".bgRed));
