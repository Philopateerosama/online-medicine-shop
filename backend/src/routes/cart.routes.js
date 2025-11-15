import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { addToCart, getCart, removeCartItem, updateCartItem } from '../controllers/cart.controller.js';

const router = Router();

router.get('/', authRequired, getCart);
router.post('/', authRequired, addToCart);
router.delete('/:itemId', authRequired, removeCartItem);
router.put('/:itemId', authRequired, updateCartItem);

export default router;
