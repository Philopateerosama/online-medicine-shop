import { Router } from 'express';
import { register, login } from '../controllers/auth.controller.js';
import { requestReset, resetPassword } from '../controllers/reset.controller.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', requestReset);
router.post('/reset-password', resetPassword);

export default router;
