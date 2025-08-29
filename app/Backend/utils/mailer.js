const nodemailer = require("nodemailer");
require("dotenv").config();

// ✅ Create transporter
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// ✅ Generic send function
async function sendMail(to, subject, text, html) {
  const mailOptions = {
    from: `"MediReminder" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
    html, // ✅ must be passed explicitly
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`📧 Mail sent to ${to}: ${subject}`);
  } catch (err) {
    console.error("❌ Mail send failed:", err.message);
    throw err;
  }
}

// ======================= Reminder Email =======================
async function sendReminder(email, med) {
  const subject = `Don't forget to take your medicine: ${med.name} at ${med.time}`;
  const text = `Hi,\n\nIt's time to take your medicine:\n\nName: ${med.name}\nTime: ${med.time}\nDosage: ${med.dosage || "N/A"}\n\nStay healthy!\n\n- MediReminder Team`;

  const html = `
    <h2>⏰ Medicine Reminder</h2>
    <p>It's time to take your medicine:</p>
    <ul>
      <li><b>Name:</b> ${med.name}</li>
      <li><b>Time:</b> ${med.time}</li>
      <li><b>Dosage:</b> ${med.dosage || "N/A"}</li>
    </ul>
    <p>Stay healthy!<br>- MediReminder Team</p>
  `;

  return sendMail(email, subject, text, html);
}

// ======================= Password Reset Email =======================
async function sendPasswordReset(email, resetLink) {
  const subject = "MediReminder - Password Reset Request";
  const text = `Hi,\n\nYou requested to reset your MediReminder password.\nClick the link below (valid for 15 minutes):\n\n${resetLink}\n\nIf you did not request this, ignore this email.\n\n- MediReminder Team`;

  // ✅ Always define html before sending
  const html = `
    <h2>🔑 Password Reset Request</h2>
    <p>You requested to reset your MediReminder password.</p>
    <p>
      Click the button below (valid for 15 minutes):
    </p>
    <p>
      <a href="${resetLink}" target="_blank" 
         style="background:#42a5f5; color:#fff; padding:10px 20px; text-decoration:none; border-radius:6px;">
         Reset Password
      </a>
    </p>
    <p>If you did not request this, you can safely ignore this email.</p>
    <br>
    <p>- MediReminder Team</p>
  `;

  return sendMail(email, subject, text, html);
}

// ======================= Login Alert Email =======================
async function sendLoginAlert(email) {
  const subject = "MediReminder - New Login Alert";
  const text = `Hi,\n\nYou just logged into MediReminder.\nIf this wasn’t you, please reset your password immediately.\n\n- MediReminder Team`;

  const html = `
    <h2>🔔 New Login Alert</h2>
    <p>You just logged into <b>MediReminder</b>.</p>
    <p>If this wasn’t you, please reset your password immediately.</p>
    <br>
    <p>- MediReminder Team</p>
  `;

  return sendMail(email, subject, text, html);
}

module.exports = { sendReminder, sendPasswordReset, sendLoginAlert };
