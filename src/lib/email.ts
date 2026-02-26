import nodemailer from "nodemailer";

const from = process.env.EMAIL_FROM || "no-reply@example.com";

export async function sendEmail(opts: {
  to: string;
  subject: string;
  html?: string;
  text?: string;
}) {
  const host = process.env.EMAIL_SERVER_HOST;
  const port = process.env.EMAIL_SERVER_PORT
    ? Number(process.env.EMAIL_SERVER_PORT)
    : undefined;
  const user = process.env.EMAIL_SERVER_USER;
  const pass = process.env.EMAIL_SERVER_PASSWORD;

  if (!host || !port || !user || !pass) {
    // Build-safe: don’t crash build if env vars aren’t set yet
    console.warn("Email env vars not set; skipping sendEmail()");
    return;
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  await transporter.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
}
