import Joi from "joi";
import { roleModel } from "../models/role.model.js";
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
            throw (
                { message: 'Unauthorized!', status: 403, data: null }
            );
        }
        const token = req.headers.authorization.split(' ')[1];
        tokenService.verifyToken(token);

        await createSchema.validateAsync({
            name,
            permissions
        });
        
        const existedRole = await roleModel.findOne({ name });
        if (existedRole) {
            throw (
                {
                    message: "Role already exists",
                    statusCode: 403
                }
            )
        }

        next();
    } catch (error) {
        next(error);
    }
}