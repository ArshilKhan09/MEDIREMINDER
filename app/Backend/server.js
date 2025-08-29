const express = require("express");
const mongoose = require("mongoose");
const app = express();
const cron = require("node-cron");
const User = require("./models/User");
const Medicine = require("./models/Medicine");
const sendReminder = require("./utils/mailer");
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");

dotenv.config();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static frontend files
app.use(express.static(path.join(__dirname, "../Frontend")));

// Fallback: send index.html for unknown routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../Frontend/index.html"));
});

const authRoutes = require("./routes/auth");
const medicineRoutes = require("./routes/medicine");

app.use("/api/auth", authRoutes);
app.use("/api/medicine", medicineRoutes);


app.use(express.static(path.join(__dirname, "../Frontend")));

console.log("Email User:", process.env.EMAIL_USER);

// Run every minute (for demo). Change to "0 * * * *" for hourly or "0 9 * * *" for daily at 9 AM
cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking medicines for reminders...");
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5); // HH:MM

  try {
    const medicines = await Medicine.find({ time: currentTime }).populate("user");
    for (let med of medicines) {
      if (med.user && med.user.email) {
        await sendReminder(med.user.email, med);
        console.log(`📧 Reminder sent to ${med.user.email} for ${med.name}`);
      }
    }
  } catch (err) {
    console.error("Error sending reminders:", err);
  }
});

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log("✅ MongoDB Atlas Connected"))
.catch((err) => console.error("❌ Connection error:", err));

app.get("/", (req, res) => {
    res.send("MediReminder connected to MongoDB ✅");
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
