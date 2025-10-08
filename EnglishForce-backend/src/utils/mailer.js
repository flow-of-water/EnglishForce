// utils/mailer.js
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST, // host: SMTP server (e.g. smtp.gmail.com, email-smtp.<region>.amazonaws.com).
  port: Number(process.env.SMTP_PORT || 587),  
  secure: String(process.env.SMTP_SECURE || 'false') === 'true',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

export async function sendMail({ to, subject, html }) {
  const from = process.env.APP_FROM_EMAIL || process.env.SMTP_USER;
  return transporter.sendMail({ from, to, subject, html });
}


export function otpEmailTemplate({ appName, OTPcode, ttlMinutes }) {
  return `
  <div style="font-family: Arial, sans-serif; line-height:1.6">
    <h2>${appName} - One-Time Password (OTP)</h2>
    <p>Your verification code is:</p>
    <div style="font-size:28px; font-weight:700; letter-spacing:4px">${OTPcode}</div>
    <p>This code will expire in <b>${ttlMinutes} minutes</b>. Do not share it with anyone.</p>
    <p>If you did not request this, please ignore this email.</p>
  </div>`;
}
