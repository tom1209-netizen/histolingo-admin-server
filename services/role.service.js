import Role from "../models/role.model.js";

class RoleService {
    async createRole(name, permissions) {
        const newRole = await Role.create({ name, permissions });
        return newRole;
    }

    async getRoles (filters, page, pageSize, sortOrder)  {
        const skip = (page - 1) * pageSize;

        const results = await Role.aggregate([
            { $match: filters },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize },
                    ]
                }
            }
        ]);

        const totalRolesCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const roles = results[0].documents;

        return { roles, totalRolesCount };
    }

    async getRole(id) {
        const role = await Role.findById(id);
        return role;
    }

    async updateRole(id, updateData) {
        const updatedRole = await Role.findByIdAndUpdate(id, updateData, { new: true });
        return updatedRole;
    }
}

export const roleService = new RoleService();