const { EMAIL, EMAIL_PASSWORD } = require("@/config/env.config");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: EMAIL,
    pass: EMAIL_PASSWORD, 
  },
});

module.exports = transporter;
