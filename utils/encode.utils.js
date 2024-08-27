import bcrypt from "bcrypt";

class Encode {
    encrypt(password) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            return hashPassword;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    decrypt(password, hashPassword) {
        try {
            return bcrypt.compareSync(password, hashPassword);
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }
}

const encodeService = new Encode();
export default encodeService;