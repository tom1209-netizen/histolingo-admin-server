import Admin from "../models/admin.model.js";
import encodeService from "../utils/encode.service.js";

class AdminService {
    async createAdmin(firstName, lastName, adminName, password, roles, adminId) {
        const [hashPassword, salt] = encodeService.encrypt(password);
        const newAdmin = await Admin.create(
            { firstName,
                lastName,
                adminName,
                password: hashPassword,
                roles,
                salt,
                supervisorId: adminId
            }
        );
        return newAdmin;
    }

}

const adminService = new AdminService();

export default adminService;