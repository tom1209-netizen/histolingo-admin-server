import { Router } from 'express';
import { forgotPassword, resetPassword } from '../controllers/auth.controller.js';
import { validateEmail } from "../middlewares/validateEmail.middleware.js";

const router = Router();

router.post('/forgot-password', validateEmail, forgotPassword);
router.post('/reset-password', resetPassword);

export default router;