const express = require("express");
const router = express.Router();
const Chat = require("../models/chatModel");
const Message = require("../models/messageSchema");
const User = require("../models/userModel");
const { protect } = require("../middleware/authenticate");

router.post("/sendMessage", protect, async (req, res) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.sendStatus(400);
  }

  try {
    let newMessage = new Message({
      sender: req.user._id,
      content: content,
      chat: chatId,
    });
    await newMessage.save();

    newMessage = await newMessage.populate("sender", "userName");
    newMessage = await newMessage.populate("chat");
    newMessage = await User.populate(newMessage, {
      path: "chat.users",
      select: "userName email",
    });

    await Chat.findByIdAndUpdate(req.body.chatId, {
      latestMessage: newMessage,
    });
    res.json(newMessage);
  } catch (error) {
    res.status(400).json(error);
    console.log(error);
  }
});

router.get("/messages/:chatId", protect, async (req, res) => {
  try {
    const chatId = req.params.chatId;
    const messages = await Message.find({ chat: chatId }).populate(
      "sender",
      "userName email"
    );
    res.json(messages);
    // .populate("chat");
  } catch (error) {
    res.status(400);
  }
});

module.exports = router;
