import { adminModel } from "../models/admin.model.js";
import bcrypt from "bcrypt";
import encodeService from "../utils/encode.service.js";

class AdminService {
    async createAdmin(firstName, lastName, adminName, password, roles, adminId) {
        const [hashPassword, salt] = encodeService.encrypt(password);
        const newAdmin = await adminModel.create({ firstName, lastName, adminName, password: hashPassword, roles, salt, supervisorId: adminId });
        return newAdmin;
    }

}

const adminService = new AdminService();

export default adminService;