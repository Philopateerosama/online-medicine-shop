import { prisma } from '../config/prisma.js';

export async function createOrder(req, res, next) {
  try {
    const userId = req.user.id;
    const cart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: { include: { product: true } } }
    });
    if (!cart || cart.items.length === 0) return res.status(400).json({ message: 'Cart is empty' });

    let total = 0;
    for (const item of cart.items) {
      if (item.quantity > item.product.stockQuantity) {
        return res.status(400).json({ message: `Insufficient stock for ${item.product.name}` });
      }
      const line = Number(item.product.price) * Number(item.quantity);
      total += line;
    }

    const result = await prisma.$transaction(async (tx) => {
      // Create order
      const order = await tx.order.create({
        data: {
          userId,
          totalPrice: Number(total),
          items: {
            create: cart.items.map((ci) => ({
              productId: ci.productId,
              productName: ci.product.name,
              price: ci.product.price,
              quantity: ci.quantity,
            }))
          }
        },
        include: { items: true }
      });

      // Decrement stock
      for (const ci of cart.items) {
        await tx.product.update({
          where: { id: ci.productId },
          data: { stockQuantity: { decrement: ci.quantity } }
        });
      }

      // Clear cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return order;
    });

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function listOrders(req, res, next) {
  try {
    const orders = await prisma.order.findMany({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' },
      include: { items: true }
    });
    return res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getOrder(req, res, next) {
  try {
    const id = Number(req.params.id);
    const order = await prisma.order.findFirst({
      where: { id, userId: req.user.id },
      include: { items: true }
    });
    if (!order) return res.status(404).json({ message: 'Order not found' });
    return res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function reorder(req, res, next) {
  try {
    const oldOrderId = Number(req.params.id);
    const userId = req.user.id;

    // Find the old order with its items and product details
    const oldOrder = await prisma.order.findFirst({
      where: { id: oldOrderId, userId },
      include: {
        items: {
          include: {
            product: {
              select: {
                id: true,
                name: true,
                price: true,
                stockQuantity: true
              }
            }
          }
        }
      }
    });

    if (!oldOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check stock and calculate new total
    let newTotalPrice = 0;
    const itemsToOrder = [];
    
    for (const item of oldOrder.items) {
      // Check if product still exists and has enough stock
      if (!item.product) {
        return res.status(400).json({ 
          message: `Product "${item.productName}" is no longer available` 
        });
      }
      
      if (item.quantity > item.product.stockQuantity) {
        return res.status(400).json({ 
          message: `Insufficient stock for "${item.productName}"` 
        });
      }
      
      // Use current price for the new order
      const currentPrice = Number(item.product.price);
      newTotalPrice += currentPrice * item.quantity;
      
      itemsToOrder.push({
        productId: item.productId,
        productName: item.product.name,
        price: currentPrice,
        quantity: item.quantity
      });
    }

    // Create new order in a transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create the new order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalPrice: newTotalPrice,
          status: 'PENDING',
          items: {
            create: itemsToOrder
          }
        },
        include: { items: true }
      });

      // Update stock quantities
      for (const item of itemsToOrder) {
        await tx.product.update({
          where: { id: item.productId },
          data: { 
            stockQuantity: { 
              decrement: item.quantity 
            } 
          }
        });
      }

      return newOrder;
    });

    return res.status(201).json(result);
  } catch (err) {
    next(err);
  }
}

export async function cancelOrder(req, res, next) {
  try {
    const orderId = Number(req.params.id);
    const userId = req.user.id;

    // Find the order with items and product details
    const order = await prisma.order.findFirst({
      where: { id: orderId, userId },
      include: {
        items: {
          include: {
            product: true
          }
        }
      }
    });

    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Check if order can be cancelled
    if (order.status !== 'PENDING') {
      return res.status(400).json({ 
        message: 'Only orders with PENDING status can be cancelled' 
      });
    }

    // Use transaction to ensure data consistency
    await prisma.$transaction([
      // Update order status to CANCELLED
      prisma.order.update({
        where: { id: orderId },
        data: { status: 'CANCELLED' }
      }),
      // Increment stock for each item in the order
      ...order.items.map(item => 
        prisma.product.update({
          where: { id: item.productId },
          data: { 
            stockQuantity: { 
              increment: item.quantity 
            } 
          }
        })
      )
    ]);

    return res.json({ 
      message: 'Order cancelled successfully',
      orderId,
      newStatus: 'CANCELLED'
    });
  } catch (err) {
    next(err);
  }
}
