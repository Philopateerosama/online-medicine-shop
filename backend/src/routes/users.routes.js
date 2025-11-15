import { Router } from 'express';
import { me, updateMe } from '../controllers/users.controller.js';
import { authRequired } from '../middleware/auth.js';

const router = Router();

router.get('/me', authRequired, me);
router.put('/me', authRequired, updateMe);

export default router;
