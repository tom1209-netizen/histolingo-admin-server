import Role from "../models/role.model.js";

class RoleService {
    async createRole(name, permissions) {
        const newRole = await Role.create({ name, permissions });
        return newRole;
    }

    async getRoles (filters, page, page_size, sortOrder)  {
        const skip = (page - 1) * page_size;

        const roles = await Role.find(filters)
            .sort({ createdAt: parseInt(sortOrder, 10) })
            .skip(skip)
            .limit(page_size);

        return roles;
    }

    async getRole(id) {
        const role = await Role.findById(id);
        return role;
    }

    async updateRole(id, updateData) {
        const updatedRole = await Role.findByIdAndUpdate(id, updateData, { new: true });
        return updatedRole;
    }

    async deleteRole(id) {
        const deletedRole = await Role.findByIdAndUpdate(id, { status: 0 });
        return deletedRole;
    }
}

export const roleService = new RoleService();