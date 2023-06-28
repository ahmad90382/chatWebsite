const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");

app.use(cors());
app.use(express.json());
dotenv.config({ path: "./config.env" });
require("./dbConnection");
app.use(cookieParser());

// Routers
app.use(require("./router/userRoute"));
app.use(require("./router/contactRoute"));
app.use(require("./router/fetchData"));
app.use(require("./router/chatRoute"));
app.use(require("./router/messageRoute")); // Make sure the router file is correctly required

app.get("/", (req, res) => {
  // Handle root route if needed
});

app.listen(port, () => {
  console.log(`Listening on port ${port}`.bgGreen);
});

//socket

module.exports = app; // Export the app object
