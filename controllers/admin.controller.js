import { adminStatus } from "../constants/admin.constant.js";
import Admin from "../models/admin.model.js";
import Role from "../models/role.model.js";
import adminService from "../services/admin.service.js";
import tokenService from "../services/token.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const createAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const admin = req.admin;
        const adminId = admin._id;
        const roleNames = req.roleNames;

        const { firstName, lastName, adminName, email, password, roles } = req.body;
        const newAdmin = await adminService.createAdmin(firstName, lastName, adminName, email, password, roles, adminId);

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
            message: error.message || "Internal Server Error",
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
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getCurrentAdminController = (req, res) => {
    const __ = applyRequestContentLanguage(req);
    const { admin } = req.admin;
    return res.status(200).json({
        success: true,
        message: __("message.getSuccess", { field: __("model.admin.name") }),
        status: 200,
        data: admin
    });
};

export const updateAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const admin = req.adminUpdate;
        const updateData = req.body;
        const updateAdmin = await adminService.updateAdmin(admin, updateData);
        const roleNames = req.roleNames;

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
                    password: updateAdmin.password,
                    role: roleNames,
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

export const getListAdmin = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { page = 1, pageSize = 10, search = '', status, sortOrder = -1 } = req.query;

        // Tạo điều kiện tìm kiếm
        const searchCondition = search
            ? {
                $or: [
                    { firstName: { $regex: search, $options: 'i' } },
                    { lastName: { $regex: search, $options: 'i' } },
                    { adminName: { $regex: search, $options: 'i' } },
                    { email: { $regex: search, $options: 'i' } },
                ]
            }
            : {};
        if (status !== null && status !== undefined && status !== "") {
            searchCondition.status = status;
        }

        // Lấy danh sách Admin theo điều kiện tìm kiếm và phân trang
        const admins = await Admin.find(searchCondition)
            .skip((page - 1) * pageSize)
            .limit(Number(pageSize))
            .sort(sortOrder === -1 ? { createdAt: -1 } : { createdAt: 1 })
            .populate('roles', 'name');

        // Lấy tổng số lượng Admin để tính toán phân trang
        const totalAdmins = await Admin.countDocuments(searchCondition);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.admin.name") }),
            data: {
                admins,
                totalPages: Math.ceil(totalAdmins / pageSize),
                totalCount: totalAdmins,
                currentPage: Number(page)
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

export const getRolesToAdminController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { search = '' } = req.query;

        const searchCondition = search
            ? {
                name: { $regex: search, $options: 'i' },
                status: adminStatus.active
            }
            : { status: adminStatus.active };

        const roles = await Role.find(searchCondition, "_id name");

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
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getByIdController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const id = req.params.id;
        const admin = await Admin.findOne({ _id: id }, { password: 0, salt: 0 })
                    .populate('roles', 'name');

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
            message: error.message || "Internal Server Error",
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
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};