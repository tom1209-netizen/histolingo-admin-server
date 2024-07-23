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
        console.log('Validating authorization header');
        if (!req.headers.authorization) {
            console.log('Authorization header missing');
            const error = new Error("Unauthorized");
            error.status = 403;
            error.data = null;
            throw error;
        }
        const token = req.headers.authorization.split(' ')[1];
        console.log('Token extracted:', token);

        // Mock token verification for testing
        await tokenService.verifyToken(token);
        console.log('Token verified');

        console.log('Validating request body');
        await createSchema.validateAsync({ name, permissions });
        console.log('Request body validated');

        console.log('Checking if role already exists');
        const existedRole = await Role.findOne({ name });
        if (existedRole) {
            console.log('Role already exists');
            const error = new Error("Role already exists");
            error.status = 403;
            error.data = null;
            throw error;
        }

        console.log('Validation successful, proceeding to next middleware');
        next();
    } catch (error) {
        console.error('Error in createRoleValidator:', error.message);
        next(error);
    }
}

export const updateRoleValidator = async (req, res, next) => {
    const { id } = req.params;
    const { name, permissions } = req.body;

    const updateSchema = Joi.object({
        id: Joi.string()
            .hex()
            .length(24)
            .required(),
        name: Joi.string()
            .min(1)
            .max(250),
        permissions: Joi.array()
            .items(Joi.string()),
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

        console.log('Validating request body');
        await updateSchema.validateAsync({
            id,
            name,
            permissions
        });

        console.log("Passed middleware")
        next();
    } catch (error) {
        console.error('Error in createRoleValidator:', error.message);
        next(error);
    }
}

export const getRoleValidator = async (req, res, next) => {
    const { id } = req.params;

    const getSchema = Joi.object({
        id: Joi.string()
            .hex()
            .length(24)
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

        await getSchema.validateAsync({
            id
        });

        next();
    } catch (error) {
        next(error);
    }
}