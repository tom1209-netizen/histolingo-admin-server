import roleService from "../services/role.service.js";

export const createRoleController = async (req, res) => {
    try {
        const { name, permissions } = req.body;
        const newRole = await roleService.createRole(name, permissions);

        return res.status(201).json({
            success: true,
            message: "Create role successfully",
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
    try {
        const roles = await roleService.getRoles();

        return res.status(200).json({
            success: true,
            message: "Get roles successfully",
            status: 200,
            data: {
                roles
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

export const getRoleController = async (req, res) => {
    try {
        const { id } = req.params;
        const role = await roleService.getRole(id);

        return res.status(200).json({
            success: true,
            message: "Get role successfully",
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

export const updateRolesController = async (req, res) => {
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