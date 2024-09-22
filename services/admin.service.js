import Admin from "../models/admin.model.js";
import Role from "../models/role.model.js";
import { sendEmail } from "../utils/email.utils.js";
import encodeService from "../utils/encode.utils.js";
import bcrypt from "bcrypt";

class AdminService {
    async createAdmin(firstName, lastName, adminName, email, password, roles, adminId, subject, content) {
        const hashPassword = encodeService.encrypt(password);
        await sendEmail(subject, content, email);

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
            {
                $lookup: {
                    from: "admins",
                    localField: "supervisorId",
                    foreignField: "_id",
                    as: "supervisorDetails"
                }
            },
            { $unwind: { path: "$roleDetails", preserveNullAndEmptyArrays: true } }, // Unwind roleDetails để có thể truy cập các trường trong đó
            { $unwind: { path: "$supervisorDetails", preserveNullAndEmptyArrays: true } },
            {
                $group: {
                    _id: "$_id",
                    firstName: { $first: "$firstName" },
                    lastName: { $first: "$lastName" },
                    adminName: { $first: "$adminName" },
                    email: { $first: "$email" },
                    status: { $first: "$status" },
                    createdAt: { $first: "$createdAt" },
                    updatedAt: { $first: "$updatedAt" },
                    roles: { $push: "$roleDetails" },
                    supervisorId: { $first: "$supervisorDetails" }
                }
            },
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
                                    _id: "$roles._id",
                                    name: "$roles.name"
                                },
                                status: 1,
                                supervisorId: {
                                    _id: "$supervisorId._id",
                                    adminName: "$supervisorId.adminName"
                                },
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
            .populate([
                { path: "roles", select: "name permissions" },
                { path: "supervisorId", select: "adminName" }
            ]);
        return admin;
    }

    async getRolesToAdmin(filters) {
        const roles = await Role.find(filters, "_id name");
        return roles;
    }

    async verifyPassword(adminId, oldPassword) {
        const admin = await Admin.findById(adminId);
        if (!admin) {
            throw { status: 404, message: "Admin not found" };
        }

        const isMatch = await bcrypt.compare(oldPassword, admin.password);
        return isMatch;
    }

    async updatePassword(adminId, newPassword) {
        const hashedPassword = await bcrypt.hash(newPassword, 10); // 10 salt rounds
        const updatedAdmin = await Admin.findByIdAndUpdate(
            adminId,
            { password: hashedPassword },
            { new: true }
        );
        if (!updatedAdmin) {
            throw { status: 404, message: "Admin not found" };
        }
        return updatedAdmin;
    }

}

const adminService = new AdminService();

export default adminService;