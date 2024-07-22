import {config} from "dotenv";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import Admin from "../models/admin.model.js";

config();

class TokenHandler {
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
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
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
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    };

    verifyToken(token) {
        try {
            jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            return true
        }
        catch (e) {
            const error = new Error("Invalid token");
            error.status = 403;
            error.data = null;
            throw error;
        }
    };

    async infoToken(token) {
        try {
            const decodedToken = jwt.decode(token);
            if (!decodedToken?.email) {
                const error = new Error("Invalid token");
                error.status = 403;
                error.data = null;
                throw error;
            }

            const admin = await Admin.findOne({ email: decodedToken.email });
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

    async generateRefreshToken () {
        return crypto.randomBytes(64).toString("hex");
    }
};

const tokenService = new TokenHandler();
export default tokenService;