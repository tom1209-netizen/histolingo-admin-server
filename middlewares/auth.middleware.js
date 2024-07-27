import tokenService from "../services/token.service.js";
import Role from "../models/role.model.js";

export const authentication = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            return res.status(403).json({
                message: "No token provided",
                status: 403,
                error: "Unauthorized"
            });
        }

        const token = req.headers.authorization.split(' ')[1];

        tokenService.verifyToken(token);

        next();
    } catch (error) {
        return res.status(403).json({
            message: "Invalid token",
            status: 403,
            error: "Unauthorized",
            details: error.message
        });
    }
}

export const authorization = (requiredPermission) => async (req, res, next) => {
        try {
            if (!req.admin) {
                return res.status(403).json({
                    message: "No admin data provided",
                    status: 403,
                    error: "Forbidden"
                });
            }

            const role = await Role.findById(req.admin.roleId);

            if (!role) {
                return res.status(403).json({
                    message: "Role not found",
                    status: 403,
                    error: "Forbidden"
                });
            }

            if (!role.permissions.includes(requiredPermission)) {
                return res.status(403).json({
                    message: "Permission denied",
                    status: 403,
                    error: "Forbidden"
                });
            }

            next();
        } catch (error) {
            return res.status(403).json({
                message: "An error occurred during authorization",
                status: 403,
                error: "Forbidden",
                details: error.message
            });
        }
}