const User = require("../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Register new user
const registerUser = async function (req, res) {
  console.log("hit");
  try {
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    const user = await User.create({
      name,
      email,
      password: await bcrypt.hash(password, await bcrypt.genSalt(12)),
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN || "1d",
    });

    res
      .status(201)
      .json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Login user
const loginUser = async function (req, res) {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const isCorrect = await bcrypt.compare(password, user.password);
    if (!isCorrect)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.EXPIRES_IN || "1d",
    });

    res
      .status(200)
      .json({ _id: user._id, name: user.name, email: user.email, token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get profile of logged-in user
const getUserProfile = async function (req, res) {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { registerUser, loginUser, getUserProfile };
