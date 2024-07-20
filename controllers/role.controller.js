import { roleModel } from "../models/role.model.js";
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
                    name: newRole.name,
                    permissions: newRole.permissions,
                }
            },
        });
    } catch (error) {
        next(error);
    }
}