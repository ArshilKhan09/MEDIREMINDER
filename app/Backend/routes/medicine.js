const express = require("express");
const Medicine = require("../models/Medicine");
const auth = require("../middleware/auth");

const router = express.Router();

// Add medicine
router.post("/", auth, async (req, res) => {
  const { name, dosage, time } = req.body;
  try {
    const med = new Medicine({ userId: req.user.id, name, dosage, time });
    await med.save();
    res.json(med);
  } catch (err) {
    res.status(500).send("Server Error");
  }
});

// Get medicines
router.get("/", auth, async (req, res) => {
  const meds = await Medicine.find({ userId: req.user.id });
  res.json(meds);
});

module.exports = router;

// Delete medicine
router.delete("/:id", auth, async (req, res) => {
  try {
    await Medicine.findOneAndDelete({ _id: req.params.id, userId: req.user.id });
    res.json({ msg: "Medicine deleted" });
  } catch (err) {
    res.status(500).send("Server Error");
  }
});
