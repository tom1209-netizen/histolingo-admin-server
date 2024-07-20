import fetch from 'node-fetch';
import crypto from 'crypto';
import PasswordResetToken from '../models/PasswordResetToken.js';
import { config } from 'dotenv';
import { sendResetEmail } from '../utils/emailService.js';

config();

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        const userResponse = await fetch(`team-1-server/api/users?email=${email}`);
        if (!userResponse.ok) {
            return res.status(400).send('User not found');
        }
        const user = await userResponse.json();

        const token = crypto.randomBytes(32).toString('hex');
        const expiry = Date.now() + 3600000; 
        await PasswordResetToken.create({ userId: user._id, token, expiry });

        const resetLink = `http://localhost:${process.env.PORT}/auth/reset-password?token=${token}&id=${user._id}`;
        await sendResetEmail(email, resetLink);
        res.send('Password reset link sent to your email.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
};

export const resetPassword = async (req, res) => {
    const { token, userId, newPassword } = req.body;
    console.log(token, userId, newPassword);

    try {
        const resetToken = await PasswordResetToken.findOne({ userId, token });
        if (!resetToken || resetToken.expiry < Date.now()) {
            return res.status(400).send('Invalid or expired token');
        }

        const userResponse = await fetch(`team-1-server/${userId}`);
        if (!userResponse.ok) {
            return res.status(400).send('User not found');
        }
        const user = await userResponse.json();

        user.password = user.hashPassword(newPassword);
        await fetch(`team-1-server/${userId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ password: user.password }),
        });

        await PasswordResetToken.deleteOne({ userId, token });
        res.send('Password has been reset successfully.');
    } catch (error) {
        console.error(error);
        res.status(500).send('An error occurred while processing your request.');
    }
};