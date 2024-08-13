import Admin from "../models/admin.model.js";
import adminService from "../services/admin.service.js";
import tokenService from "../services/token.service.js";
import { t } from "../utils/localization.util.js";

export const createAdminController = async (req, res) => {
    try {
        const admin = req.admin;
        const adminId = admin._id;

        const { firstName, lastName, adminName, email, password, roles } = req.body;
        const newAdmin = await adminService.createAdmin(firstName, lastName, adminName, email, password, roles, adminId);

        return res.status(201).json({
            success: true,
            message: t(req.contentLanguage, "admin.createSuccess"),
            status: 201,
            data: {
                admin: {
                    id: newAdmin._id,
                    firstName: newAdmin.firstName,
                    lastName: newAdmin.lastName,
                    adminName: newAdmin.adminName,
                    email: newAdmin.email,
                    roles: newAdmin.roles,
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
    try {
        const { admin } = req.body;
        const accessToken = tokenService.signAccessToken({ email: admin.email, _id: admin._id });
        const refreshToken = tokenService.signRefreshToken({ _id: admin._id });

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "admin.loginSuccess"),
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
    const { admin } = req.admin;
    return res.status(200).json({
        success: true,
        message: t(req.contentLanguage, "admin.getCurrentSuccess"),
        status: 200,
        data: admin
    });
};

export const updateAdminController = async (req, res) => {
    try {
        const admin = req.adminUpdate;
        const updateData = req.body;
        const updateAdmin = await adminService.updateAdmin(admin, updateData);

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "admin.updateSuccess"),
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

export const getListAdmin = async (req, res) => {

    try {
        const { page = 1, page_size = 10, search = '', status, sortOrder = -1 } = req.query;

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
            .skip((page - 1) * page_size)
            .limit(Number(page_size))
            .sort(sortOrder === -1 ? { createdAt: -1 } : { createdAt: 1 });

        // Lấy tổng số lượng Admin để tính toán phân trang
        const totalAdmins = await Admin.countDocuments(searchCondition);

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "admin.getListSuccess"),
            data: {
                admins,
                totalPages: Math.ceil(totalAdmins / page_size),
                totalCount: totalAdmins,
                currentPage: Number(page)
            },
        });
    } catch (error) {
        next(error);
    }
};

export const getByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const admin = await Admin.findOne({ _id: id }, { password: 0, salt: 0 });

        if (!admin) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "admin.notFound"),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: t(req.contentLanguage, "admin.getByIdSuccess"),
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