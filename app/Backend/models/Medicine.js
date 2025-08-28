const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  dosage: String,
  time: String // Example: "09:00"
});

module.exports = mongoose.model("Medicine", MedicineSchema);
