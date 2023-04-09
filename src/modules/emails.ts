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

export async function emailConfirm(to: string, data: any) {
  const subject = `Welcome to the Workout App, ${data.firstName}!`;

  const html = `
  <h1>Welcome to the Workout App!</h1>

  <p>Congratulations on taking your first step toward better fitness!  You are on a journey, and the Workout App is here to help you along the way.</p>

  <p>Please take a moment to confirm your email: </p>
  <a href="http://localhost:5173/user/emailconfirm/?token=${data.token}">Confirm Email as ${data.email}</a>
  `;

  try {
    let info = await transporter.sendMail({ from, to, subject, html });
    const successMessage = `Message sent: ${info.messageId}`
    console.log(successMessage);
    return successMessage;
  } catch (e) {
    console.error(e);
  }
}