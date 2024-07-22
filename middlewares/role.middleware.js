import Joi from "joi";
import Role from "../models/role.model.js";
import tokenService from "../services/token.service.js";

export const createRoleValidator = async (req, res, next) => {
    const { name, permissions } = req.body;

    const createSchema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(250)
            .required(),
        permissions: Joi.array()
            .items(Joi.string())
            .required(),
    });

    try {
        if (!req.headers.authorization) {
            const error = new Error("Unauthorized");
            error.status = 403;
            error.data = null;
            throw error;
        }
        const token = req.headers.authorization.split(' ')[1];
        tokenService.verifyToken(token);

        await createSchema.validateAsync({
            name,
            permissions
        });
        
        const existedRole = await Role.findOne({ name });
        if (existedRole) {
            const error = new Error("Role already exists");
            error.status = 403;
            error.data = null;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
}