import Admin from "../models/admin.model.js";
import Role from "../models/role.model.js";
import encodeService from "../utils/encode.utils.js";

class AdminService {
    async createAdmin(firstName, lastName, adminName, email, password, roles, adminId) {
        const hashPassword = encodeService.encrypt(password);
        const newAdmin = await Admin.create(
            {
                firstName,
                lastName,
                adminName,
                email,
                password: hashPassword,
                roles,
                supervisorId: adminId
            }
        );
        return newAdmin;
    }

    async updateAdmin(id, updateData) {
        try {
            // Kiểm tra nếu có trường password
            if (updateData.password) {
                const [hashPassword, salt] = encodeService.encrypt(updateData.password);
                updateData.password = hashPassword;
                updateData.salt = salt;
            }

            const updatedAdmin = await Admin.findByIdAndUpdate(id, updateData, { new: true });

            return updatedAdmin;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    async getAdmins(filters, page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;

        const results = await Admin.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: "roles", // Roles collection
                    localField: "roles", // Field trong Admin chứa ObjectId của roles
                    foreignField: "_id", // Field trong Role chứa ObjectId tương ứng
                    as: "roleDetails" // Tên của field sẽ chứa thông tin role sau khi join
                }
            },
            { $unwind: "$roleDetails" }, // Unwind roleDetails để có thể truy cập các trường trong đó
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                firstName: 1,
                                lastName: 1,
                                adminName: 1,
                                email: 1,
                                role: {
                                    _id: "$roleDetails._id",
                                    name: "$roleDetails.name"
                                },
                                status: 1,
                                supervisorId: 1,
                                createdAt: 1,
                                updatedAt: 1,
                            }
                        }
                    ]
                }
            }
        ])

        const totalAdminsCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const admins = results[0].documents;

        return { admins, totalAdminsCount };
    }

    async getAdmin(id) {
        const admin = await Admin.findOne({ _id: id }, { password: 0, salt: 0 })
            .populate('roles', 'name');
        return admin;
    }

    async getRolesToAdmin(filters) {
        const roles = await Role.find(filters, "_id name");
        return roles;
    }

}

const adminService = new AdminService();

export default adminService;