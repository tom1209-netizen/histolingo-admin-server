import tokenService from "../services/token.service.js";
import Role from "../models/role.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const authentication = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    try {
        if (!req.headers.authorization) {
            return res.status(403).json({
                message: __("auth.noToken"),
                status: 403,
                error: "Unauthorized"
            });
        }

        const token = req.headers.authorization.split(' ')[1];
        tokenService.verifyToken(token);
        req.admin = await tokenService.infoToken(token);

        next();
    } catch (error) {
        return res.status(403).json({
            message: __("auth.tokenInvalid"),
            status: 403,
            error: "Unauthorized",
            details: error.message
        });
    }
};

export const authorization = (requiredPermission) => async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    try {
        if (!req.admin) {
            return res.status(403).json({
                message: __("admin.notFound"),
                status: 403,
                error: "Forbidden"
            });
        }

        const roles = await Role.find({ _id: { $in: req.admin.roles } });

        if (!roles || roles.length === 0) {
            return res.status(403).json({
                message: __("role.notFound"),
                status: 403,
                error: "Forbidden"
            });
        }

        const hasPermission = roles.some(role => role.permissions.includes(requiredPermission));
        if (!hasPermission) {
            return res.status(403).json({
                message: __("auth.permissionDenied"),
                status: 403,
                error: "Forbidden"
            });
        }

        next();
    } catch (error) {
        return res.status(403).json({
            message: __("auth.authorizationError"),
            status: 403,
            error: "Forbidden",
            details: error.message
        });
    }
};