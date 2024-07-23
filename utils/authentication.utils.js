import tokenService from "../services/token.service.js";

export const authenticationToken = (req) => {
    try {
        if (!req.headers.authorization) {
            const error = new Error("Unauthorized!");
            error.status = 403;
            error.data = null;
            throw error;
        }

        const token = req.headers.authorization.split(' ')[1];
        tokenService.verifyToken(token);
        return token;
    } catch (e) {
        const error = new Error(e.message);
        error.status = 500;
        error.data = null;
        throw error;
    }
}