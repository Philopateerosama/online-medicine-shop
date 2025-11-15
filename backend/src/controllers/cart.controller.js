import { prisma } from '../config/prisma.js';

async function getOrCreateUserCart(userId) {
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }
  return cart;
}

export async function getCart(req, res, next) {
  try {
    const cart = await prisma.cart.findUnique({
      where: { userId: req.user.id },
      include: { items: { include: { product: true } } }
    });
    return res.json(cart || { id: null, items: [] });
  } catch (err) {
    next(err);
  }
}

export async function addToCart(req, res, next) {
  try {
    const { productId, quantity } = req.body;
    if (!productId || !quantity || quantity < 1) return res.status(400).json({ message: 'productId and positive quantity required' });

    const product = await prisma.product.findUnique({ where: { id: Number(productId) } });
    if (!product) return res.status(404).json({ message: 'Product not found' });

    const cart = await getOrCreateUserCart(req.user.id);

    const existing = await prisma.cartItem.findFirst({ where: { cartId: cart.id, productId: product.id } });
    if (existing) {
      const newQty = existing.quantity + Number(quantity);
      if (newQty > product.stockQuantity) return res.status(400).json({ message: 'Not enough stock' });
      const updated = await prisma.cartItem.update({ where: { id: existing.id }, data: { quantity: newQty } });
      return res.status(200).json(updated);
    } else {
      if (Number(quantity) > product.stockQuantity) return res.status(400).json({ message: 'Not enough stock' });
      const created = await prisma.cartItem.create({ data: { cartId: cart.id, productId: product.id, quantity: Number(quantity) } });
      return res.status(201).json(created);
    }
  } catch (err) {
    next(err);
  }
}

export async function removeCartItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true } });
    if (!item || item.cart.userId !== req.user.id) return res.status(404).json({ message: 'Item not found' });
    await prisma.cartItem.delete({ where: { id: itemId } });
    return res.status(204).send();
  } catch (err) {
    next(err);
  }
}

export async function updateCartItem(req, res, next) {
  try {
    const itemId = Number(req.params.itemId);
    const { quantity } = req.body;
    if (!quantity || quantity < 1) return res.status(400).json({ message: 'positive quantity required' });

    const item = await prisma.cartItem.findUnique({ where: { id: itemId }, include: { cart: true, product: true } });
    if (!item || item.cart.userId !== req.user.id) return res.status(404).json({ message: 'Item not found' });

    if (quantity > item.product.stockQuantity) return res.status(400).json({ message: 'Not enough stock' });

    const updated = await prisma.cartItem.update({ where: { id: itemId }, data: { quantity: Number(quantity) } });
    return res.json(updated);
  } catch (err) {
    next(err);
  }
}
