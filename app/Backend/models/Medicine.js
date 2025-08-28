const mongoose = require("mongoose");

const MedicineSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  name: { type: String, required: true },
  time: { type: String, required: true },
  dosage: { type: String }
});

module.exports = mongoose.model("Medicine", MedicineSchema);
