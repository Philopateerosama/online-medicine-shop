import { prisma } from '../config/prisma.js';
import bcrypt from 'bcryptjs';

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        address: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
        weight: true,
        height: true,
        allergies: true
      }
    });
    return res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const {
      username,
      address,
      phone,
      dateOfBirth,
      gender,
      bloodType,
      weight,
      height,
      allergies
    } = req.body || {};

    const data = {};
    if (username !== undefined) data.username = username;
    if (address !== undefined) data.address = address || null;
    if (phone !== undefined) data.phone = phone || null;
    if (gender !== undefined) data.gender = gender || null;
    if (bloodType !== undefined) data.bloodType = bloodType || null;
    if (allergies !== undefined) data.allergies = allergies || null;

    if (weight !== undefined) {
      const w = typeof weight === 'string' ? parseFloat(weight) : weight;
      data.weight = Number.isFinite(w) ? w : null;
    }
    if (height !== undefined) {
      const h = typeof height === 'string' ? parseFloat(height) : height;
      data.height = Number.isFinite(h) ? h : null;
    }
    if (dateOfBirth !== undefined) {
      if (!dateOfBirth) {
        data.dateOfBirth = null;
      } else {
        const d = new Date(dateOfBirth);
        data.dateOfBirth = isNaN(d.getTime()) ? null : d;
      }
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data,
      select: {
        id: true,
        email: true,
        username: true,
        address: true,
        phone: true,
        dateOfBirth: true,
        gender: true,
        bloodType: true,
        weight: true,
        height: true,
        allergies: true
      }
    });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function verifyPassword(req, res, next) {
  try {
    const { password } = req.body || {};
    if (!password) {
      return res.status(400).json({ success: false, message: 'password is required' });
    }

    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    return res.json({ success: !!ok });
  } catch (err) {
    next(err);
  }
}
