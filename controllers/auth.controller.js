import tokenService from "../services/token.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const refreshAccessTokenController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { admin } = req.body;

        // Generate new tokens
        const newAccessToken = tokenService.signAccessToken({ _id: admin._id });
        const newRefreshToken = tokenService.signRefreshToken({_id: admin._id});

        // Update refresh token in the database
        admin.refreshToken = newRefreshToken;
        await admin.save();

        return res.status(200).json({
            success: true,
            message: __("message.refreshSuccess"),
            status: 200,
            data: {
                admin: {
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email,
                    _id: admin._id
                },
                newAccessToken,
                newRefreshToken,
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}