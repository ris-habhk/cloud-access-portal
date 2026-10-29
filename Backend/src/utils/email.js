const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: Number(process.env.SMTP_PORT || 587) === 465,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

async function sendOTPEmail(email, otp, purpose) {
  if (
    !process.env.SMTP_HOST ||
    !process.env.SMTP_USER ||
    !process.env.SMTP_PASS ||
    !process.env.EMAIL_FROM
  ) {
    throw new Error("Email SMTP configuration is incomplete.");
  }

  const isRegistration = purpose === "registration";

  const subject = isRegistration
    ? "Verify your Cloud Access Portal email"
    : "Your Cloud Access Portal login code";

  const heading = isRegistration
    ? "Verify your email address"
    : "Complete your login";

  const message = isRegistration
    ? "Enter this code to verify your email address and activate your account."
    : "Enter this code to complete your login.";

  await transporter.sendMail({
    from: process.env.EMAIL_FROM,
    to: email,
    subject,
    text: `${heading}\n\n${message}\n\nYour verification code is: ${otp}\n\nThis code expires in ${process.env.OTP_EXPIRES_MINUTES || 5} minutes. If you did not request this code, you can ignore this email.`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:520px;margin:auto;padding:24px">
        <h2>${heading}</h2>
        <p>${message}</p>
        <div style="font-size:30px;font-weight:bold;letter-spacing:8px;padding:16px 0">
          ${otp}
        </div>
        <p>This code expires in ${process.env.OTP_EXPIRES_MINUTES || 5} minutes.</p>
        <p>If you did not request this code, you can ignore this email.</p>
      </div>
    `
  });
}

module.exports = { sendOTPEmail };