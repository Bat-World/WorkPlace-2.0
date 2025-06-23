import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export async function sendInviteEmail(to: string, token: string) {
  const inviteUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/accept-invite?token=${token}`;
  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to,
    subject: 'You are invited to join an organization',
    text: `You have been invited! Accept here: ${inviteUrl}`,
    html: `<p>You have been invited! <a href="${inviteUrl}">Accept Invitation</a></p>`
  });
} 