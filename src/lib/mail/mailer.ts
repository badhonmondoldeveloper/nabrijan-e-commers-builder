import nodemailer from 'nodemailer';

const SMTP_HOST = process.env.SMTP_HOST;
const SMTP_PORT = Number(process.env.SMTP_PORT || 587);
const SMTP_USER = process.env.SMTP_USER;
const SMTP_PASS = process.env.SMTP_PASS;
const SMTP_FROM = process.env.SMTP_FROM || 'Nabrijan Security <no-reply@nabrijan.site>';
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || 'https://nabrijan.site';

let transporter: nodemailer.Transporter | null = null;

if (SMTP_HOST && SMTP_USER && SMTP_PASS) {
  transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: SMTP_PORT,
    secure: SMTP_PORT === 465,
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASS,
    },
  });
}

export async function sendVerificationEmail(email: string, rawToken: string, name: string) {
  const verifyUrl = `${APP_URL}/verify-email?token=${rawToken}&email=${encodeURIComponent(email)}`;

  const subject = 'Verify your Nabrijan Account';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #4f46e5;">Welcome to Nabrijan, ${name}!</h2>
      <p style="color: #374151; font-size: 16px;">
        Thank you for registering on Nabrijan SaaS. Please verify your email address to complete your account setup and access merchant features.
      </p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${verifyUrl}" style="background-color: #4f46e5; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Verify Email Address
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        Or copy and paste this link into your browser: <br/>
        <a href="${verifyUrl}" style="color: #4f46e5;">${verifyUrl}</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
        If you did not create an account on Nabrijan, please ignore this email. Link expires in 24 hours.
      </p>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: email,
      subject,
      html,
    });
  } else {
    console.log(`[MAIL FALLBACK - SMTP NOT CONFIGURED] Send verification email to ${email}: ${verifyUrl}`);
  }
}

export async function sendPasswordResetEmail(email: string, rawToken: string, name: string) {
  const resetUrl = `${APP_URL}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`;

  const subject = 'Password Reset Request — Nabrijan Security';
  const html = `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
      <h2 style="color: #dc2626;">Password Reset Request</h2>
      <p style="color: #374151; font-size: 16px;">
        Hello ${name}, we received a request to reset your Nabrijan account password.
      </p>
      <div style="margin: 30px 0; text-align: center;">
        <a href="${resetUrl}" style="background-color: #dc2626; color: #ffffff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; display: inline-block;">
          Reset Password
        </a>
      </div>
      <p style="color: #6b7280; font-size: 14px;">
        Or copy and paste this link into your browser: <br/>
        <a href="${resetUrl}" style="color: #dc2626;">${resetUrl}</a>
      </p>
      <p style="color: #9ca3af; font-size: 12px; margin-top: 30px;">
        If you did not request a password reset, please ignore this email or contact support if you suspect unauthorized access. Link expires in 1 hour.
      </p>
    </div>
  `;

  if (transporter) {
    await transporter.sendMail({
      from: SMTP_FROM,
      to: email,
      subject,
      html,
    });
  } else {
    console.log(`[MAIL FALLBACK - SMTP NOT CONFIGURED] Send password reset email to ${email}: ${resetUrl}`);
  }
}
