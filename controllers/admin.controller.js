import { adminStatus } from "../constants/admin.constant.js";
import adminService from "../services/admin.service.js";
import tokenService from "../services/token.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { generateRandomPassword } from "../utils/password.utils.js";

export const createAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const admin = req.admin;
        const adminId = admin._id;
        const roleNames = req.roleNames;

        const { firstName, lastName, adminName, email, roles } = req.body;

        const password = generateRandomPassword();
        const subject = "Password for your Histolingo admin account";
        const content = `This is the password for your Histolingo admin account: ${password}`;

        const newAdmin = await adminService.createAdmin(firstName, lastName, adminName, email, password, roles, adminId, subject, content);

        return res.status(201).json({
            success: true,
            message: __("message.createdSuccess", { field: __("model.admin.name") }),
            status: 201,
            data: {
                admin: {
                    id: newAdmin._id,
                    firstName: newAdmin.firstName,
                    lastName: newAdmin.lastNames,
                    adminName: newAdmin.adminName,
                    email: newAdmin.email,
                    roles: roleNames,
                },
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
};

export const loginAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { admin } = req.body;
        const accessToken = tokenService.signAccessToken({ email: admin.email, _id: admin._id });
        const refreshToken = tokenService.signRefreshToken({ _id: admin._id });

        return res.status(200).json({
            success: true,
            message: __("message.loginSuccess", { field: __("model.admin.name") }),
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
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getCurrentAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const id = req.admin._id;
        const admin = await adminService.getAdmin(id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.admin.name") }),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: __("message.getSuccess", { field: __("model.admin.name") }),
                status: 200,
                data: admin
            });
        }
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const updateAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { id } = req.params;
        const updateData = req.body;
        const updateAdmin = await adminService.updateAdmin(id, updateData);
        const roleNames = req.roleNames || updateAdmin.roles;

        return res.status(200).json({
            success: true,
            message: __("message.updatedSuccess", { field: __("model.admin.name") }),
            status: 200,
            data: {
                updateAdmin: {
                    _id: updateAdmin._id,
                    firstName: updateAdmin.firstName,
                    lastName: updateAdmin.lastName,
                    adminName: updateAdmin.adminName,
                    email: updateAdmin.email,
                    role: roleNames,
                    status: updateAdmin.status,
                }
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
};

export const getAdmins = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { page = 1, pageSize = 10, search = "", status, sortOrder = -1 } = req.query;

        const maxPageSize = 100;
        const limitedPageSize = Math.min(pageSize, maxPageSize);


        const filters = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: "i" } },
                    { lastName: { $regex: search, $options: "i" } },
                    { adminName: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } },
                ]
            }
            : {};
        if (status !== null && status !== undefined && status !== "") {
            filters.status = status;
        }

        const { admins, totalAdminsCount } = await adminService.getAdmins(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.admin.name") }),
            data: {
                admins,
                totalPages: Math.ceil(totalAdminsCount / limitedPageSize),
                totalCount: totalAdminsCount,
                currentPage: Number(page)
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
};

export const getRolesToAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { search = "" } = req.query;

        const filters = search
            ? {
                name: { $regex: search, $options: "i" },
                status: adminStatus.active
            }
            : { status: adminStatus.active };

        const roles = await adminService.getRolesToAdmin(filters);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.role.name") }),
            data: {
                roles,
                totalCount: roles.length
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
};

export const getAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const id = req.params.id;
        const admin = await adminService.getAdmin(id);

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.admin.name") }),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: __("message.getSuccess", { field: __("model.admin.name") }),
                status: 200,
                data: admin
            });
        }
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const generateRefreshTokenController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const admin = req.admin;
        const accessToken = tokenService.signAccessToken({ email: admin.email, _id: admin._id });
        const refreshToken = tokenService.signRefreshToken({ _id: admin._id });

        return res.status(200).json({
            success: true,
            message: __("message.generateTokenSuccess"),
            status: 200,
            data: {
                accessToken,
                refreshToken,
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
};