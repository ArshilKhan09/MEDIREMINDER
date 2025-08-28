const nodemailer = require("nodemailer");
require("dotenv").config();

console.log("USER:", process.env.EMAIL_USER);
console.log("PASS:", process.env.EMAIL_PASS);

async function testEmail() {
  try {
    let transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
  port: 465,
  secure: true, // use SSL
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
      }
    });

    let info = await transporter.sendMail({
      from: `"MediReminder" <${process.env.EMAIL_USER}>`,
      to: process.env.EMAIL_USER, // send to yourself for test
      subject: "✅ MediReminder Email Test",
      text: "Hello! This is a test email from your MediReminder app."
    });

    console.log("Message sent:", info.messageId);
  } catch (err) {
    console.error("Error sending email:", err);
  }
}

testEmail();
