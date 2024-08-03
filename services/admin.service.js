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

    async updateAdmin(adminId, updateData) {
        try {
            // Kiểm tra nếu có trường password
            if (updateData.password) {
                const [hashPassword, salt] = encodeService.encrypt(updateData.password);
                updateData.password = hashPassword;
                updateData.salt = salt;
            }

            const updatedAdmin = await Admin.findByIdAndUpdate(adminId, updateData, { new: true });

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