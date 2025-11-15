import { prisma } from '../config/prisma.js';

export async function me(req, res, next) {
  try {
    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      select: { id: true, email: true, username: true, address: true, phone: true }
    });
    return res.json(user);
  } catch (err) {
    next(err);
  }
}

export async function updateMe(req, res, next) {
  try {
    const { address, phone, username } = req.body;
    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: { address, phone, username },
      select: { id: true, email: true, username: true, address: true, phone: true }
    });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}
