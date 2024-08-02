import crypto from 'crypto';
import PasswordResetToken from '../models/PasswordResetToken.model.js';
import Admin from '../models/admin.model.js';
import { config } from 'dotenv';
import { sendResetEmail } from '../utils/email.utils.js';
import { hashPassword } from "../utils/password.utils.js";
import { TOKEN_EXPIRY_TIME } from '../constants/auth.constants.js';

config();

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const admin = await Admin.findOne({ email });
        if (!admin) {
            return res.status(400).send('Admin not found');
        }

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + TOKEN_EXPIRY_TIME; 
        await PasswordResetToken.create({ userId: admin._id, token, expiry });

        const resetLink = `http://${process.env.DOMAIN}/auth/reset-password?token=${token}&id=${admin._id}`;
        sendResetEmail(email, resetLink);
        res.send('Password reset link sent to your email.');
    } catch (error) {
        res.status(500).send('An error occurred while processing your request.');
    }
};

export const resetPassword = async (req, res) => {
    const { token, userId, newPassword } = req.body;

    try {
        const resetToken = await PasswordResetToken.findOne({ userId, token });
        if (!resetToken || resetToken.expiry < Date.now()) {
            return res.status(400).send('Invalid or expired token');
        }

        const admin = await Admin.findById(userId);
        if (!admin) {
            return res.status(400).send('Admin not found');
        }

        admin.password = hashPassword(newPassword);
        await admin.save();

        await PasswordResetToken.deleteOne({ userId, token });
        res.send('Password has been reset successfully.');
    } catch (error) {
        res.status(500).send(`An error occurred while processing your request. ${error}`);
    }
};