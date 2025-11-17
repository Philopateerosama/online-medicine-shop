import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { prisma } from '../config/prisma.js';

export async function requestReset(req, res, next) {
  try {
    const { email } = req.body || {};
    if (!email) return res.status(400).json({ message: 'email is required' });

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      // Do not reveal whether email exists
      return res.json({ message: 'If that email exists, a reset link has been sent.' });
    }

    const token = crypto.randomBytes(32).toString('hex');
    const expiry = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    await prisma.user.update({
      where: { id: user.id },
      data: { resetToken: token, resetTokenExpiry: expiry }
    });

    const link = `http://127.0.0.1:5500/frontend/reset-password.html?token=${token}&id=${user.id}`;
    // Simulation instead of email
    console.log(`Click this link to reset: ${link}`);

    return res.json({ message: 'If that email exists, a reset link has been sent.' });
  } catch (err) {
    next(err);
  }
}

export async function resetPassword(req, res, next) {
  try {
    const { userId, token, newPassword } = req.body || {};
    if (!userId || !token || !newPassword) {
      return res.status(400).json({ message: 'userId, token, and newPassword are required' });
    }

    const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user || !user.resetToken || !user.resetTokenExpiry) {
      return res.status(400).json({ message: 'Invalid or expired reset request' });
    }

    const now = new Date();
    if (user.resetToken !== token || user.resetTokenExpiry < now) {
      return res.status(400).json({ message: 'Invalid or expired reset request' });
    }

    const passwordHash = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: user.id },
      data: { passwordHash, resetToken: null, resetTokenExpiry: null }
    });

    return res.json({ message: 'Password has been reset successfully.' });
  } catch (err) {
    next(err);
  }
}
