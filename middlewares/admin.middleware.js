import Joi from "joi";
import Admin from "../models/admin.model.js";
import Role from "../models/role.model.js";
import encodeService from "../utils/encode.service.js";

export const createAdminValidator = async (req, res, next) => {
    try {
        const { firstName, lastName, adminName, password, roles } = req.body;

        const createSchema = Joi.object({
            firstName: Joi.string()
                .max(100)
                .required(),
            lastName: Joi.string()
                .max(100)
                .required(),
            adminName: Joi.string()
                .min(8)
                .max(100)
                .required(),
            password: Joi.string()
                .min(8)
                .max(100)
                .required(),
            roles: Joi.array()
                .items(Joi.string())
                .required(),
        });

        await createSchema.validateAsync({
            firstName,
            lastName,
            adminName,
            password,
            roles
        });

        const existedAdmin = await Admin.findOne({ adminName });
        if (existedAdmin) {
            const error = new Error("AdminName already exists");
            error.statusCode = 403;
            throw error;
        }

        const roleDocs = await Role.find({ name: { $in: roles } });
        if (roleDocs.length !== roles.length) {
            const error = new Error("Some roles do not exist");
            error.statusCode = 400;
            throw error;
        }

        const roleIds = roleDocs.map(role => role._id);

        req.body.roles = roleIds;

        next();
    } catch (error) {
        next(error);
    }
}

export const loginAdminValidator = async (req, res, next) => {
    const { email, password } = req.body;

    const loginSchema = Joi.object({
        email: Joi.string()
            .email()
            .max(250)
            .required(),
        password: Joi.string()
            .min(8)
            .max(100)
            .required()
    });

    try {
        await loginSchema.validateAsync({
            email,
            password,
        }, {
            abortEarly: false
        });

        const existedAdmin = await Admin.findOne({ email });
        req.body.admin = existedAdmin;
        const passwordMatches = existedAdmin ? encodeService.decrypt(password, existedAdmin.password) : false;
        if (!existedAdmin || !passwordMatches) {
            const error = new Error("Email or password is invalid");
            error.statusCode = 403;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
}