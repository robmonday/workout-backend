import nodemailer from "nodemailer";

let transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SERVER,
  port: Number(process.env.EMAIL_PORT), //typescript needed this
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

let from = process.env.EMAIL_FROM_ADDR;

const baseUrl = "http://localhost:5173"; // "https://robmonday-workout.vercel.app" "http://localhost:5173"

export async function emailConfirm(
  to: string,
  data: any,
  emailConfirmToken: string
) {
  const subject = `Welcome to the Workout App, ${data.firstName}!`;

  const html = `
  <h1>Welcome to the Workout App!</h1>

  <p>Congratulations on taking your first step toward better fitness!  You are on a journey, and the Workout App is here to help you along the way.</p>

  <p>Please take a moment to confirm your email: </p>
  <a href="${baseUrl}/emailconfirm/?emailConfirmToken=${
    emailConfirmToken || "NO_TOKEN"
  }">Confirm Email as ${data.email}</a>
  `;

  try {
    let info = await transporter.sendMail({ from, to, subject, html });
    const successMessage = `Message sent: ${info.messageId}`;
    console.log(successMessage);
    return successMessage;
  } catch (e) {
    console.error(e);
  }
}

export async function emailForgotPw(to: string, token: string) {
  const subject = `Workout App Password Reset`;

  const html = `
  <h1>Password Reset</h1>

  <p>We received an online request to reset your password.  If this was initiated by you, you may now complete this action.  If you did not request a password reset, you may disregard this email.</p>

  <p><a href="${baseUrl}/forgot/?newPasswordToken=${
    token || "NO_TOKEN"
  }">Update Password for ${to}</a></p>
  `;

  try {
    let info = await transporter.sendMail({ from, to, subject, html });
    const successMessage = `Message sent: ${info.messageId}`;
    console.log(successMessage);
    return successMessage;
  } catch (e) {
    console.error(e);
  }
}
