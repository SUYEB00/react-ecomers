import admin from "firebase-admin";
import nodemailer from "nodemailer";

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(
      JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT)
    ),
  });
}

export default async function handler(req, res) {
  try {
    const { email } = req.body;

    const resetLink =
      await admin.auth().generatePasswordResetLink(email);

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: "TrendZone <support@trendzone.live>",
      to: email,
      subject: "Reset Your TrendZone Password",
      html: `
        <div style="font-family:Arial,sans-serif">
          <h2>TrendZone Password Reset</h2>
          <p>Click the button below to reset your password.</p>

          <a href="${resetLink}"
             style="
               background:#000;
               color:#fff;
               padding:12px 24px;
               text-decoration:none;
               border-radius:6px;
               display:inline-block;
             ">
             Reset Password
          </a>

          <p>If you didn't request this, ignore this email.</p>
        </div>
      `,
    });

    return res.status(200).json({
      success: true,
    });
  } catch (error) {
  console.error("RESET ERROR:", error);

  return res.status(500).json({
    success: false,
    error: error.message,
  });
}
}