import { adminModel } from "../models/admin.model.js";
import adminService from "../services/admin.service.js";
import tokenService from "../services/token.service.js";

export const createAdminController = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            throw (
                { message: 'Unauthorized!', status: 403, data: null }
            );
        }
        const token = req.headers.authorization.split(' ')[1];
        tokenService.verifyToken(token);
        const admin = await tokenService.infoToken(token);
        const adminId = admin._id;

        const { firstName, lastName, adminName, password, roles } = req.body;
        const newAdmin = await adminService.createAdmin(firstName, lastName, adminName, password, roles, adminId);

        return res.status(201).json({
            success: true,
            message: "Create Successfully",
            status: 201,
            data: {
                admin: {
                    firstName: newAdmin.firstName,
                    lastName: newAdmin.lastName,
                    adminName: newAdmin.adminName,
                    roles: newAdmin.roles,
                },
                // token,
                // refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
};

export const loginAdminController = async (req, res, next) => {
    try {
        const { email, password, admin } = req.body;
        const accessToken = tokenService.signAccessToken({ email: admin.email, _id: admin._id });
        const refreshToken = tokenService.signRefreshToken({ _id: admin._id });

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            status: 200,
            data: {
                admin: {
                    firstName: admin.firstName,
                    lastName: admin.lastName,
                    email: admin.email,
                    _id: admin._id
                },
                accessToken,
                refreshToken,
            },
        });
    } catch (error) {
        next(error);
    }
}