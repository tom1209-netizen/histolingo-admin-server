import { config } from "dotenv";
import jwt from "jsonwebtoken";
import { adminModel } from "../models/admin.model.js";

config();

class tokenHandler {
    signToken(payload) {
        try {
            const token = jwt.sign(payload, process.env.JWT_PRIVATE_KEY, {
                expiresIn: "30m",
                algorithm: "HS256",
                header: {
                    typ: "jwt"
                }
            });
            return (token)
        }
        catch (e) {
            throw (
                {
                    message: e.message || e,
                    status: 500,
                    data: null
                }
            )
        }
    };

    verifyToken(token) {
        try {
            jwt.verify(token, process.env.JWT_PRIVATE_KEY)
            return true
        }
        catch (e) {
            throw (
                {
                    message: "Invalid token",
                    status: 403,
                    data: null
                }
            )
        }
    };

    async infoToken(token) {
        const admin = await adminModel.findOne({ adminName: jwt.decode(token).adminName })
        if (!admin) {
          throw (
            {
              message: "Admin does not exist",
              status: 404,
              data: null
            }
          )
        }
        else {
          return admin
        }
      }
};

const tokenService = new tokenHandler();
export default tokenService;