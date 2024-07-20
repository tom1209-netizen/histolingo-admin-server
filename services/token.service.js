import { config } from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { adminModel } from "../models/admin.model.js";

config();

class tokenHandler {
    signAccessToken(payload) {
        try {
            const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
                expiresIn: "15m",
                algorithm: "HS256",
                header: {
                    typ: "jwt"
                }
            });
            return (token)
        }
        catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    };

    signRefreshToken(payload) {
        try {
            const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
                expiresIn: "3h",
                algorithm: "HS256",
                header: {
                    typ: "jwt"
                }
            });
            return (token)
        }
        catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    };

    verifyToken(token) {
        try {
            jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            return true
        }
        catch (e) {
            throw (
                {
                    message: "Invalid token",
                    status: 403,
                    data: null
                }
            )
        }
    };

    async infoToken(token) {
        const admin = await adminModel.findOne({ email: jwt.decode(token).email })
        if (!admin) {
            throw (
                {
                    message: "Admin does not exist",
                    status: 404,
                    data: null
                }
            )
        }
        else {
            return admin
        }
    }

    async generateRefreshToken () {
        const refreshToken = crypto.randomBytes(64).toString("hex");
        return refreshToken;
    }
};

const tokenService = new tokenHandler();
export default tokenService;