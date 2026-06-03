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
      from: "TrendZone <trendzone033@gmail.com>",
      to: email,
      subject: "Reset Your TrendZone Password",
      html: `
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>TrendZone — Reset Password</title>
</head>

<body style="margin:0; padding:0; background:#f5f5f5;">
  <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" style="background:#f5f5f5; min-width:100%;">
    <tr>
      <td align="center" style="padding:32px 16px;">

        <table role="presentation" width="600" cellspacing="0" cellpadding="0" border="0"
          style="max-width:600px; width:100%; background:#ffffff; border-radius:16px; overflow:hidden;">

          <tr>
            <td style="padding:24px 32px; background:#ffffff; border-bottom:1px solid #f0f0f0;">
              <div style="font-family:Arial,sans-serif;font-size:26px;font-weight:700;color:#000000;">
                TRENDZONE
              </div>
              <div style="font-family:Arial,sans-serif;font-size:13px;color:#666666;margin-top:4px;">
                Style • Quality • Trusted Shopping
              </div>
            </td>
          </tr>

          <tr>
            <td style="padding:32px;background:#ffffff;">

              <p style="font-family:Arial,sans-serif;font-size:16px;color:#000000;">
                Hello,
              </p>

              <p style="font-family:Arial,sans-serif;font-size:15px;color:#444444;line-height:22px;">
                We received a request to reset your <strong>TrendZone</strong> password for the account linked with
                <strong>${email}</strong>.
              </p>

              <table role="presentation" cellspacing="0" cellpadding="0" border="0" align="center" style="margin:25px 0;">
                <tr>
                  <td align="center" bgcolor="#000000" style="border-radius:10px;">
                    <a href="${resetLink}" target="_blank"
                      style="display:inline-block;padding:14px 28px;font-family:Arial,sans-serif;font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;">
                      Reset Password
                    </a>
                  </td>
                </tr>
              </table>

              <p style="font-family:Arial,sans-serif;font-size:14px;color:#777777;">
                If the button above doesn't work, copy and paste the link below into your browser:
              </p>

              <p style="font-family:Arial,sans-serif;font-size:13px;word-break:break-all;">
                <a href="${resetLink}" target="_blank" style="color:#000000;text-decoration:underline;">
                  ${resetLink}
                </a>
              </p>

              <p style="font-family:Arial,sans-serif;font-size:14px;color:#666666;">
                If you didn’t request a password reset, you can safely ignore this email.
              </p>

              <p style="font-family:Arial,sans-serif;font-size:15px;color:#000000;font-weight:600;">
                — The TrendZone Team
              </p>

            </td>
          </tr>

          <tr>
            <td style="padding:18px 32px;background:#fafafa;border-top:1px solid #e5e5e5;">
              <p style="font-family:Arial,sans-serif;font-size:12px;color:#888888;margin:0;">
                © TrendZone — All rights reserved. This is an automated message; please do not reply.
              </p>
            </td>
          </tr>

        </table>

      </td>
    </tr>
  </table>
</body>
</html>
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