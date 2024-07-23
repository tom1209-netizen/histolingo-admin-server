import Admin from "../models/admin.model.js";
import encodeService from "../utils/encode.utils.js";

class AdminService {
    async createAdmin(firstName, lastName, adminName, email, password, roles, adminId) {
        const [hashPassword, salt] = encodeService.encrypt(password);
        const newAdmin = await Admin.create(
            {
                firstName,
                lastName,
                adminName,
                email,
                password: hashPassword,
                roles,
                salt,
                supervisorId: adminId
            }
        );
        return newAdmin;
    }

    async updateAdmin(admin, updateData) {
        try {
            const updatedAdmin = await Admin.findOneAndUpdate(admin, updateData, { new: true })
            return updatedAdmin;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

}

const adminService = new AdminService();

export default adminService;