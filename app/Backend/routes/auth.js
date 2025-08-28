const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();

// Signup
router.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    user = new User({ username, email, password: hashed });
    await user.save();

    res.json({ msg: "User registered successfully" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Login
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

module.exports = router;

// Get user profile
router.get("/me", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ msg: "No token" });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Update user email or password
router.put("/update", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { email, password } = req.body;
    let updateData = {};
    if (email) updateData.email = email;
    if (password) {
      const hashed = await bcrypt.hash(password, 10);
      updateData.password = hashed;
    }

    const user = await User.findByIdAndUpdate(decoded.id, updateData, { new: true });
    res.json({ msg: "Profile updated", user });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
