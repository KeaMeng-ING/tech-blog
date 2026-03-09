import "dotenv/config";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.GMAIL_USER,
    pass: process.env.GMAIL_APP_PASSWORD,
  },
});

export const sendNewsletter = async (to: string, posts: any[]) => {
  const html = `
    <h2>Your Daily Tech Digest</h2>
    ${posts
      .map(
        (p) => `
      <div style="border:1px solid #eee; padding:16px; margin:12px 0">
        <h3>${p.title}</h3>
        <p>${p.shortDesc}</p>
        <small>${p.source} · ${p.category.name}</small>
      </div>
    `,
      )
      .join("")}
  `;
  await transporter.sendMail({
    from: process.env.GMAIL_USER,
    to,
    subject: "Your Daily Tech Digest",
    html,
  });
};
