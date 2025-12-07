import { Router } from 'express';
import { authRequired } from '../middleware/auth.js';
import { isAdmin } from '../middleware/admin.js';
import { addProduct, updateProduct, deleteProduct, exportUsers } from '../controllers/admin.controller.js';

const router = Router();

// Protect all admin routes
router.use(authRequired, isAdmin);

router.post('/products', addProduct);
router.put('/products/:id', updateProduct);
router.delete('/products/:id', deleteProduct);
router.get('/users/export', exportUsers);

export default router;
