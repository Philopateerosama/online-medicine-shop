import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { createOrder, listOrders, getOrder, cancelOrder, reorder } from '../controllers/orders.controller.js';

const router = Router();

router.post('/', authRequired, createOrder);
router.get('/', authRequired, listOrders);
router.get('/:id', authRequired, getOrder);
router.put('/:id/cancel', authRequired, cancelOrder);
router.post('/:id/reorder', authRequired, reorder);

export default router;
