const express = require("express");
const app = express();
const port = process.env.PORT || 5000;
const colors = require("colors");
const dotenv = require("dotenv");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const path = require("path");

const connectToDatabase = require("./dbConnection");

app.use(cors());
app.use(express.json());
dotenv.config({ path: "./config.env" });
app.use(cookieParser());

// Routers
const userRouter = require("./router/userRoute");
const contactRouter = require("./router/contactRoute");
const fetchDataRouter = require("./router/fetchData");
const chatRouter = require("./router/chatRoute");
const messageRouter = require("./router/messageRoute");

app.use(userRouter);
app.use(contactRouter);
app.use(fetchDataRouter);
app.use(chatRouter);
app.use(messageRouter);

// Serve static files
app.use(express.static(path.join(__dirname, "./client/build")));

// Handle all remaining routes by serving the index.html file
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./client/build/index.html"));
});

// Connect to the database and start the server
connectToDatabase()
  .then(() => {
    app.listen(port, () => {
      console.log(`Listening on port ${port}`.bgGreen);
    });
  })
  .catch((error) => {
    console.error("Failed to connect to the database:", error);
    process.exit(1);
  });
