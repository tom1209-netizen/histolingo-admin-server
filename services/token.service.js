import {config} from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/admin.model.js";

config();

class TokenHandler {
    constructor() {
        // Load and decode the Base64-encoded secret keys
        this.accessTokenSecret = Buffer.from(process.env.JWT_ACCESS_PRIVATE_KEY, 'base64');
        this.refreshTokenSecret = Buffer.from(process.env.JWT_REFRESH_PRIVATE_KEY, 'base64');
    }

    signAccessToken(payload) {
        try {
            const token = jwt.sign(
                payload,
                this.accessTokenSecret,
                {
                    expiresIn: '15m',
                    algorithm: 'HS256',
                }
            );
            return token;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    signRefreshToken(payload) {
        try {
            const token = jwt.sign(
                payload,
                this.refreshTokenSecret,
                {
                    expiresIn: '7d',
                    algorithm: 'HS256',
                }
            );
            return token;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    verifyToken(token, tokenType = 'access') {
        try {
            const secretKey = tokenType === 'refresh' ? this.refreshTokenSecret : this.accessTokenSecret;
            jwt.verify(token, secretKey);
            return true;
        } catch (e) {
            const error = new Error('Invalid token');
            error.status = 403;
            error.data = null;
            throw error;
        }
    }

    async infoToken(token) {
        try {
            const decodedToken = jwt.decode(token);
            if (!decodedToken?._id) {
                const error = new Error("Invalid token");
                error.status = 403;
                error.data = null;
                throw error;
            }

            const admin = await Admin.findById(decodedToken._id);
            if (!admin) {
                const error = new Error("Admin does not exist");
                error.status = 404;
                error.data = null;
                throw error;
            }
            return admin;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    async generateRefreshToken() {
        return crypto.randomBytes(64).toString("hex");
    }
}

const tokenService = new TokenHandler();
export default tokenService;