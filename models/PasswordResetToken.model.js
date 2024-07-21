import mongoose from 'mongoose';

const PasswordResetTokenSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    token: { type: String, required: true },
    expiry: { type: Date, required: true }
});

const PasswordResetToken = mongoose.model('PasswordResetToken', PasswordResetTokenSchema);
export default PasswordResetToken;