const cron = require("node-cron");
const User = require("./models/User");
const Medicine = require("./models/Medicine");
const sendReminder = require("./utils/mailer");

// Run every minute (for demo). Change to "0 * * * *" for hourly or "0 9 * * *" for daily at 9 AM
cron.schedule("* * * * *", async () => {
  console.log("⏰ Checking medicines for reminders...");
  const now = new Date();
  const currentTime = now.toTimeString().slice(0,5); // HH:MM

  try {
    const medicines = await Medicine.find({ time: currentTime }).populate("userId");
    for (let med of medicines) {
      if (med.userId && med.userId.email) {
        await sendReminder(med.userId.email, med);
        console.log(`📧 Reminder sent to ${med.userId.email} for ${med.name}`);
      }
    }
  } catch (err) {
    console.error("Error sending reminders:", err);
  }
});
