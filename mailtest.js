require('dotenv').config();
console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "LOADED " : "MISSING ");const nodemailer = require("nodemailer");

async function sendTestMail() {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER, 
        pass: process.env.EMAIL_PASS, 
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER, 
      subject: "Test Email from Node.js",
      text: "Hello! Yeh ek test email hai jo Node.js se bheja gaya hai ",
    };

    let info = await transporter.sendMail(mailOptions);
    console.log(" Email sent successfully!");
    console.log("Message ID:", info.messageId);
  } catch (err) {
    console.error("Mail error:", err);
  }
}

sendTestMail();
