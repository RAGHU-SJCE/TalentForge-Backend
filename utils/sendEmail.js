// utils/sendEmail.js

const nodemailer = require("nodemailer");
const dns = require("dns");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false, // Use false for port 587 (STARTTLS)
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Force IPv4 resolution to prevent ENETUNREACH IPv6 errors in cloud environments
    lookup: (hostname, opts, callback) => {
      return dns.lookup(hostname, { family: 4 }, callback);
    }
  });

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: options.to,
    subject: options.subject,
    html: options.html,
  });
};

module.exports = sendEmail;