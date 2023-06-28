const express = require("express");
const router = express.Router();
const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const cookieParser = require("cookie-parser");
const generateToken = require("../generateToken");
const { protect } = require("../middleware/authenticate");

router.use(cookieParser());

router.post("/signup", async (req, res) => {
  try {
    const { userName, email, phone, password, confirmPassword } = req.body;

    if (!userName || !email || !phone || !password || !confirmPassword) {
      return res.status(422).json({ error: "Enter All Info" });
    }

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      return res.status(422).json({ error: "Email Already Exists" });
    }

    if (password !== confirmPassword) {
      return res.status(422).json({ error: "Enter Same Password" });
    }

    const newUser = new User({
      userName,
      email,
      phone,
      password,
      confirmPassword,
      // token: generateToken(newUser._id),
    });
    await newUser.save();

    newUser.token = generateToken(newUser._id);
    await newUser.save();

    res.status(201).json({ message: "User registered successfully" });
    // localStorage.setItem('userInfo', JSON.stringify(data))
  } catch (error) {
    console.log("->>" + error);
    res.status(500).json({ message: "Error -> " + error });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Enter All Info" });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    if (!matchPassword) {
      return res.status(422).json({ error: "Invalid Credentials" });
    }

    res.json({
      _id: user._id,
      userName: user.userName,
      email: user.email,
      phone: user.phone,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

router.get("/users", protect, async (req, res) => {
  const keyword = req.query.search
    ? {
        $or: [{ phone: { $regex: `^${req.query.search}`, $options: "i" } }],
      }
    : {};

  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = router;
