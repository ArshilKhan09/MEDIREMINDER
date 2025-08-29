const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  user: {   // ✅ renamed from userId → user
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  name: { type: String, required: true },
  time: { type: String, required: true }, // store HH:MM format
  dosage: { type: String }
});

module.exports = mongoose.model("Medicine", MedicineSchema);
