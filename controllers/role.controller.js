import { roleService } from "../services/role.service.js";
import { isValidStatus } from "../utils/validation.utils.js";
import { rolePrivileges } from "../constants/role.constant.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const createRoleController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { name, permissions } = req.body;
        const newRole = await roleService.createRole(name, permissions);

        return res.status(201).json({
            success: true,
            message: __("role.createRoleSuccess"),
            status: 201,
            data: {
                newRole
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
}

export const getRolesController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    const { page = 1, pageSize = 10, search, sortOrder = -1, status } = req.query;

    const maxPageSize = 100;
    const limitedPageSize = Math.min(pageSize, maxPageSize);

    const filters = {};

    if (search) {
        filters.name = { $regex: new RegExp(search, 'i') };
    }

    if (isValidStatus(status)) {
        filters.status = Number(status);
    }

    try {
        const { roles, totalRolesCount } = await roleService.getRoles(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("role.getRolesSuccess"),
            status: 200,
            data: {
                roles,
                totalRoles: totalRolesCount,
                totalPage: Math.ceil(totalRolesCount / limitedPageSize),
                currentPage: Number(page)
            }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getRoleController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { id } = req.params;

        const role = await roleService.getRole(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: __("role.notFound"),
                status: 404,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: __("role.getRoleSuccess"),
            status: 200,
            data: {
                role
            }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getAllPermissionController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        return res.status(200).json({
            success: true,
            message: __("role.getAllPermissionSuccess"),
            status: 200,
            data: {
                rolePrivileges
            }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const updateRoleController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { id } = req.params;
        const { name, permissions } = req.body;

        const updatedData = {};
        if (name) updatedData.name = name;
        if (permissions) updatedData.permissions = permissions;

        const updatedRole = await roleService.updateRole(id, updatedData);

        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: __("role.notFound"),
                status: 404,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: __("role.updateRoleSuccess"),
            status: 200,
            data: {
                updatedRole
            }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}