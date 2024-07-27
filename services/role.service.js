import Role from "../models/role.model.js";

class RoleService {
    async createRole(name, permissions) {
        const newRole = await Role.create({ name, permissions });
        return newRole;
    }
}

const roleService = new RoleService();
export default roleService;