const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // app password (NOT real password)
  },
});

exports.sendEmail = async (to, subject, text) => {
  await transporter.sendMail({
    from: `"Finance App" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    text,
  });
};