import crypto from "crypto";

class refreshTokenHandler {
    async generateRefreshToken () {
        const refreshToken = crypto.randomBytes(64).toString("hex");
        return refreshToken;
    }
}