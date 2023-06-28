const mongoose = require("mongoose");
const colors = require("colors");
require("dotenv").config();
const User = require("./models/userSchema");
const jwt = require("jsonwebtoken");
const { useEffect } = require("react");

const db = process.env.DATABASE;

const connectToDatabase = async () => {
  try {
    const connection = await mongoose.connect(db, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("Connected to the database!".bgGreen);

    return connection;
  } catch (error) {
    console.log("Error connecting to the database: ", error);
    throw error;
  }
};

module.exports = connectToDatabase;
