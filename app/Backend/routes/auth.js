const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendReminder, sendPasswordReset, sendLoginAlert } = require("../utils/mailer");

const router = express.Router();

// ================= Signup =================
router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }

    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    user = new User({ username, email, password: hashedPassword });
    await user.save();

    res.json({ message: "User registered successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Login =================
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    let user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // ✅ Send login notification (safe fail)
    try {
      await sendLoginAlert(user.email);
    } catch (mailErr) {
      console.error("⚠️ Login email failed:", mailErr.message);
    }

    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Get Profile =================
router.get("/me", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Update Profile =================
router.put("/update", async (req, res) => {
  try {
    const token = req.header("x-auth-token");
    if (!token) return res.status(401).json({ error: "No token, authorization denied" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    let updateData = {};

    if (req.body.email) updateData.email = req.body.email;
    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      updateData.password = await bcrypt.hash(req.body.password, salt);
    }

    const user = await User.findByIdAndUpdate(decoded.id, updateData, { new: true }).select("-password");
    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Forgot Password =================
router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: "User not found" });

    // Generate reset token (15 mins expiry)
    const resetToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const resetLink = `${process.env.FRONTEND_URL}/reset-password.html?token=${resetToken}`;

    try {
      await sendPasswordReset(user.email, resetLink);
      res.json({ message: "Password reset link sent ✅" });
    } catch (mailErr) {
      console.error("⚠️ Reset email failed:", mailErr.message);
      res.status(500).json({ error: "Failed to send reset email" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// ================= Reset Password =================
router.post("/reset-password", async (req, res) => {
  try {
    const { token, password } = req.body;
    if (!token || !password) {
      return res.status(400).json({ error: "Token and password required" });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return res.status(400).json({ error: "Invalid or expired token" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    await User.findByIdAndUpdate(decoded.id, { password: hashedPassword });

    res.json({ message: "Password has been reset successfully ✅" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});



module.exports = router;
