import Admin from "../models/admin.model.js";
import adminService from "../services/admin.service.js";
import tokenService from "../services/token.service.js";

export const createAdminController = async (req, res, next) => {
    try {
        if (!req.headers.authorization) {
            const error = new Error("Unauthorized!");
            error.status = 403;
            error.data = null;
            throw error;
        }
        const token = req.headers.authorization.split(' ')[1];
        tokenService.verifyToken(token);
        const admin = await tokenService.infoToken(token);
        const adminId = admin._id;

        const { firstName, lastName, adminName, email, password, roles } = req.body;
        const newAdmin = await adminService.createAdmin(firstName, lastName, adminName, email, password, roles, adminId);

        return res.status(201).json({
            success: true,
            message: "Create Successfully",
            status: 201,
            data: {
                admin: {
                    firstName: newAdmin.firstName,
                    lastName: newAdmin.lastName,
                    adminName: newAdmin.adminName,
                    email: newAdmin.email,
                    roles: newAdmin.roles,
                },
                // token,
                // refreshToken,
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const loginAdminController = async (req, res, next) => {
    try {
        const { admin } = req.body;
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
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getCurrentAdminController = (req, res, next) => {
    const { admin } = req.body;
    return res.status(200).json({
        success: true,
        message: "Get admin successfully",
        status: 200,
        data: admin
    });
};

export const updateAdminController = async (req, res, next) => {
    try {
        const { admin } = req.body;
        const updateData = req.body;
        const updateAdmin = await adminService.updateAdmin(admin, updateData);

        return res.status(200).json({
            success: true,
            message: "Login Successfully",
            status: 200,
            data: {
                updateAdmin: {
                    _id: updateAdmin._id,
                    firstName: updateAdmin.firstName,
                    lastName: updateAdmin.lastName,
                    adminName: updateAdmin.adminName,
                    email: updateAdmin.email,
                    password: updateAdmin.password,
                    role: updateAdmin.roles,
                    status: updateAdmin.status,
                }
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getListAdmin = async (req, res, next) => {
    try {
        const allAdmins = await Admin.find({ status: 1 });
        if (allAdmins.length === 0) {
            return res.status(404).json({
                success: true,
                message: "No admin available",
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: "Get list admin successfully",
                status: 200,
                data: allAdmins
            });
        }
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}