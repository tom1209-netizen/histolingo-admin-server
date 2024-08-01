import roleService from "../services/role.service.js";
import { isValidStatus } from "../utils/validation.utils.js";
import { rolePrivileges } from "../constants/role.constant.js";
import { t } from "../utils/localization.util.js"

export const createRoleController = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const newRole = await roleService.createRole(name, permissions);
        console.log(req.contentLanguage)
        return res.status(201).json({
            success: true,
            message: t(req.contentLanguage, "role.createRoleSuccess"),
            status: 201,
            data: {
                role: {
                    name: newRole.name,
                    permissions: newRole.permissions,
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
}

export const getRolesController = async (req, res) => {
    const { page = 1, page_size = 10, name, status } = req.query;

    const maxPageSize = 100;
    const limitedPageSize = Math.min(page_size, maxPageSize);

    const filters = {};

    if (name) {
        filters.name = { $regex: new RegExp(name, 'i') };
    }

    if (isValidStatus(status)) {
        filters.status = status;
    }

    try {
        const roles = await roleService.getRoles(filters, page, limitedPageSize);

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "role.getRolesSuccess"),
            status: 200,
            data: {
                roles,
                totalRoles: roles.length,
                totalPage: Math.ceil(roles.length / limitedPageSize),
                currentPage: page
            }
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

export const getRoleController = async (req, res) => {
    try {
        const { id } = req.params;

        const role = await roleService.getRole(id);

        if (!role) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "role.notFound"),
                status: 404,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "role.getRoleSuccess"),
            status: 200,
            data: {
                role
            }
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getAllPermissionController = async (req, res) => {

    try {
        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "role.getAllPermissionSuccess"),
            status: 200,
            data: {
                rolePrivileges
            }
        })


    } catch(error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const updateRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, permissions } = req.body;
        const updatedRole = await roleService.updateRole(id, name, permissions);
        if (!updatedRole) {
            return res.status(404).json({
                success: false,
                message: "Role not found",
                status: 404,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: "Update roles Successfully",
            status: 200,
            data: {
                role: {
                    name: updatedRole.name,
                    permissions: updatedRole.permissions,
                }
            }
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