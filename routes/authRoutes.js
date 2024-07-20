import { Router } from 'express';
import { forgotPassword, resetPassword } from '../controllers/authController.js';

const router = Router();

router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;