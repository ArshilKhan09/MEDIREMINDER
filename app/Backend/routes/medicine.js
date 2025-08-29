const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");  // middleware to check token
const Medicine = require("../models/Medicine");

// Add medicine
router.post("/", auth, async (req, res) => {
  try {
    console.log("👉 Incoming add medicine request");
    console.log("Request body:", req.body);
    console.log("Authenticated user:", req.user);

    const { name, time, dosage } = req.body;

    if (!name || !time) {
      return res.status(400).json({ error: "Name and time are required" });
    }

    const medicine = new Medicine({
      user: req.user.id,
      name,
      time,
      dosage
    });

    await medicine.save();
    res.json(medicine);
  } catch (err) {
    console.error("❌ Add medicine error:", err);
    res.status(500).json({ error: "Server error", details: err.message });
  }
});

// Get medicines
router.get("/", auth, async (req, res) => {
  try {
    const meds = await Medicine.find({ user: req.user.id });
    res.json(meds);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

// Delete medicine
router.delete("/:id", auth, async (req, res) => {
  try {
    await Medicine.findByIdAndDelete(req.params.id);
    res.json({ message: "Medicine deleted" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error" });
  }
});

module.exports = router;
