import roleService from "../services/role.service.js";

export const createRoleController = async (req, res, next) => {
    try {
        const { name, permissions } = req.body;
        const newRole = await roleService.createRole(name, permissions);

        return res.status(201).json({
            success: true,
            message: "Create Successfully",
            status: 201,
            data: {
                role: {
                    id: newRole._id,
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