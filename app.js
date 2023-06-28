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

// static files
app.use(express.static(path.join(__dirname, "./client/build")));
app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "./super-mart/client/index.html"));
});

app.get("/", (req, res) => {
  // Handle root route if needed
});

const server = app.listen(port, () => {
  console.log(`Listening on port ${port}`.bgGreen);
});

//socket
const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("connected to socket.io");
  socket.on("setup", (userData) => {
    socket.join(userData._id);
    socket.emit("connected");
  });

  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("user joined room: " + room);
  });

  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("users not defined");
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });
});

module.exports = app; // Export the app object
