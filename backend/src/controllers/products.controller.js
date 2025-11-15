import { prisma } from '../config/prisma.js';

export async function listProducts(req, res, next) {
  try {
    const { q } = req.query;
    const where = q
      ? { OR: [{ name: { contains: q, mode: 'insensitive' } }, { description: { contains: q, mode: 'insensitive' } }] }
      : {};
    const products = await prisma.product.findMany({ where, orderBy: { id: 'desc' } });
    return res.json(products);
  } catch (err) {
    next(err);
  }
}

export async function getProduct(req, res, next) {
  try {
    const id = Number(req.params.id);
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: 'Product not found' });
    return res.json(product);
  } catch (err) {
    next(err);
  }
}
