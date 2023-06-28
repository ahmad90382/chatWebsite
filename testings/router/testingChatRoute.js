const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const Chat = require("../../models/chatModel");

router.get("/testingChat", async (req, res) => {
  try {
    let chat = await Chat.findById("647ade1dafc73bcf1bedbc09").populate(
      "users"
    );

    // console.log(chat.users[0].userName);

    // res.send(
    //   chat.users.map((cur) => {
    //     return cur;
    //   })
    // );

    res.send(
      (chat = await User.populate(chat, {
        path: "latestMessage.sender",
        select: "name email",
      }))
    );

    // res.send(chat);
  } catch (error) {
    console.error(error);
    res.status(500).send("An error occurred");
  }
});

module.exports = router;
