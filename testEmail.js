// testEmail.js

require("dotenv").config();

const sendEmail = require("./utils/sendEmail");

(async () => {
  try {
    await sendEmail({
      to: process.env.EMAIL_USER,
      subject: "TalentForge Test",
      html: "<h2>Email is working successfully 🚀</h2>",
    });

    console.log("Email Sent");
  } catch (err) {
    console.log(err);
  }
})();