const nodemailer = require("nodemailer");
require("dotenv").config();

// Create transporter with Gmail SMTP
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Send medicine reminder email
 * @param {string} email - User's email
 * @param {object} medicine - Medicine object {name, time, dosage}
 */
async function sendReminder(email, medicine) {
  try {
    await transporter.sendMail({
      from: `"MediReminder 💊" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `💊 Reminder: Take your ${medicine.name}`,
      text: `Hello! It's time to take your medicine:
- Name: ${medicine.name}
- Time: ${medicine.time}
- Dosage: ${medicine.dosage || "N/A"}

Stay healthy with MediReminder!`
    });
    console.log(`📧 Reminder sent to ${email} for ${medicine.name}`);
  } catch (err) {
    console.error("❌ Failed to send reminder:", err);
  }
}

// ========== Login Alert Email ==========
async function sendLoginAlert(email) {
  try {
    await transporter.sendMail({
      from: `"MediReminder Security" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔐 New Login Detected",
      text: `Hello! A login to your MediReminder account was just detected.
      
If this was you, no action is required.  
If this wasn’t you, please reset your password immediately.`
    });
    console.log(`📧 Login alert sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send login alert:", err);
  }
}

// ========== Password Reset ==========
async function sendPasswordReset(email, resetToken) {
  try {
    const resetLink = `http://localhost:5000/reset-password.html?token=${resetToken}`;

    await transporter.sendMail({
      from: `"MediReminder Support" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "🔑 Password Reset Request",
      text: `You requested to reset your password.

Click the link below to reset your password:
${resetLink}

If you did not request this, please ignore this email.`
    });

    console.log(`📧 Password reset email sent to ${email}`);
  } catch (err) {
    console.error("❌ Failed to send reset email:", err);
  }
}

// Export all functions
module.exports = { sendReminder, sendLoginAlert, sendPasswordReset };