const nodemailer = require("nodemailer");

const sendReminder = async (email, medicine) => {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
  });

  await transporter.sendMail({
    from: `"Medicare Reminder" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Medicine Reminder",
    text: `Don't forget to take your medicine: ${medicine.name} at ${medicine.time}`
  });
};

module.exports = sendReminder;
