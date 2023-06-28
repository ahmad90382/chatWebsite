const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authenticate");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

//access chat
router.post("/chat", protect, async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    console.log("user id param not send with request");
    return res.sendStatus(400);
  }

  let isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name email",
  });

  if (isChat.length > 0) {
    res.send(isChat[0]);
  } else {
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
  }

  try {
    const createdChat = await Chat.create(chatData);
    const FullChat = await Chat.findOne({ _id: createdChat._id }).populate(
      "users",
      "-password"
    );
    res.status(200).send(FullChat);
  } catch (error) {
    console.log(error);
  }
});

// fetch chats
router.get("/chat", protect, async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name email",
        });

        res.status(200).send(results);
      });
  } catch (error) {
    console.log(error);
  }
});

//create group
router.post("/group", protect, async (req, res) => {
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please Fill fields" });
  }
  let users = JSON.parse(req.body.users);
  if (users.length < 2) {
    return res
      .status(400)
      .send("more than 2 users are required to form a group chat");
  }

  users.push(req.user);
  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {}
});

//rename group
router.put("/rename", protect, async (req, res) => {
  const { chatId, chatName } = req.body;
  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName: chatName,
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

// add user to group
router.put("/addtogroup", protect, async (req, res) => {
  const { chatId, userId } = req.body;
  const updatedGroupchat = await Chat.findByIdAndUpdate(
    chatId,
    { $push: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedGroupchat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedGroupchat);
  }
});

//remove user from group
router.put("/removefromgroup", protect, async (req, res) => {
  const { chatId, userId } = req.body;
  const updateGroupChat = await Chat.findByIdAndUpdate(
    chatId,
    { $pull: { users: userId } },
    { new: true }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updateGroupChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updateGroupChat);
  }
});

module.exports = router;
