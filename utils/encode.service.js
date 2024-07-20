import bcrypt from 'bcrypt'

class encode {
    encrypt(password) {
        try {
            const salt = bcrypt.genSaltSync(10);
            const hashPassword = bcrypt.hashSync(password, salt);
            return [hashPassword, salt];
        }
        catch (error) {
            throw (
                {
                    message: error.message,
                    status: 500,
                    data: null
                }
            )
        }
    }

    decrypt(password, salt) {
        try {
            return bcrypt.hashSync(password, salt)
        }
        catch (e) {
            throw (
                {
                    message: e.message,
                    status: 500,
                    data: null
                }
            )
        }
    }
};

const encodeService = new encode();
export default encodeService;