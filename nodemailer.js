const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

async function mailer(Receiver, Otp) {
  let transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAILER_ID,
      pass: process.env.MAILER_PASS,
    },
  });
  let info = await transporter.sendMail({
    from: process.env.MAILER_ID,
    to: Receiver,
    subject: "Verification for Reset Password",
    text: "",
    html: `<p>Dear users! this is your OneTimePassword given below, Do not share your OTP keep maintaining for your security purpose.</p><b>${Otp}</b>`,
  });
  console.log("Message sent: %s", info.messageId);
  return;
}
module.exports = { mailer };
