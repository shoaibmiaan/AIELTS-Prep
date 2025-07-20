import type { NextApiRequest, NextApiResponse } from 'next';
import { createTransport } from 'nodemailer';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email } = req.body;

  try {
    // 1. Check if user exists in your database
    // const user = await prisma.user.findUnique({ where: { email } });
    // if (!user) return res.status(404).json({ error: 'User not found' });

    // 2. Create password reset token (store this in your database)
    const resetToken = 'generate-secure-token-here'; // Use crypto.randomBytes or uuid
    const resetLink = `${process.env.NEXTAUTH_URL}/reset-password?token=${resetToken}`;

    // 3. Send password reset email
    const transporter = createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AIELTS Prep" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Password Reset Request',
      html: `
        <p>You requested a password reset for your AIELTS Prep account.</p>
        <p>Click the link below to reset your password:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });

    res.status(200).json({ success: true });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
}