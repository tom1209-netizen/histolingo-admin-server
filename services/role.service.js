import Role from "../models/role.model.js";

class RoleService {
    async createRole(name, permissions) {
        const newRole = await Role.create({ name, permissions });
        return newRole;
    }

    async getRoles (filters, page, page_size)  {
        const skip = (page - 1) * page_size;

        const roles = await Role.find(filters)
                                                                            .skip(skip)
                                                                            .limit(page_size);

        return roles;
    }

    async getRole(id) {
        const role = await Role.findById(id);
        return role;
    }

    async updateRole(id, name, permissions) {
        const updatedRole = await Role.findByIdAndUpdate(id, { name, permissions }, { new: true });
        return updatedRole;
    }
}

const roleService = new RoleService();
export default roleService;