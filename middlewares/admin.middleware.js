import Joi from "joi";
import Admin from "../models/admin.model.js";
import Role from "../models/role.model.js";
import encodeService from "../utils/encode.utils.js";
import tokenService from "../services/token.service.js";
import { authenticationToken } from "../utils/authentication.utils.js";
import { adminStatus } from "../constants/admin.constant.js";

export const createAdminValidator = async (req, res, next) => {
    try {
        const { firstName, lastName, adminName, email, password, roles } = req.body;

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
            email: Joi.string()
                .email()
                .max(250)
                .required(),
            password: Joi.string()
                .min(8)
                .max(250)
                .required(),
            roles: Joi.array()
                .items(Joi.string())
                .required(),
        });


        await createSchema.validateAsync({
            firstName,
            lastName,
            adminName,
            email,
            password,
            roles
        });

        const existedAdmin = await Admin.findOne({ adminName });
        if (existedAdmin) {
            const error = new Error("AdminName already exists");
            error.statusCode = 403;
            throw error;
        }

        // Find role by name
        const roleDocs = await Role.find({ name: { $in: roles } });
        if (roleDocs.length !== roles.length) {
            const error = new Error("Some roles do not exist");
            error.statusCode = 400;
            throw error;
        }

        // Convert to `_id`
        const roleIds = roleDocs.map(role => role._id);

        // Convert `req.body.roles` to `_id`
        req.body.roles = roleIds;

        next();
    } catch (error) {
        next(error);
    }
};

export const loginAdminValidator = async (req, res, next) => {
    try {
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
        })

        await loginSchema.validateAsync({
            email,
            password,
        }, {
            abortEarly: false
        })

        const existedAdmin = await Admin.findOne({ email });
        req.body.admin = existedAdmin;
        const decryptedPassword = encodeService.decrypt(password, existedAdmin.salt);
        if (!existedAdmin || decryptedPassword !== existedAdmin.password) {
            const error = new Error("Email or password is invalid");
            error.statusCode = 403;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const getAdminValidator = async (req, res, next) => {
    try {
        const token = authenticationToken(req);
        req.body.admin = await tokenService.infoToken(token);
        next()
    } catch (error) {
        next(error);
    }
};

export const updateAdminValidator = async (req, res, next) => {
    try {
        const updateSchema = Joi.object({
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
            email: Joi.string()
                .email()
                .max(250)
                .required(),
            password: Joi.string()
                .min(8)
                .max(250)
                .required(),
            roles: Joi.array()
                .items(Joi.string())
                .required(),
            status: Joi.number()
                .valid(adminStatus.active, adminStatus.inactive),
        });

        const { firstName, lastName, adminName, email, password, roles, status } = req.body;
        await updateSchema.validateAsync({
            firstName,
            lastName,
            adminName,
            email,
            password,
            roles,
            status
        });
        const token = authenticationToken(req);
        req.body.admin = await tokenService.infoToken(token);

        // Find role by name
        const roleDocs = await Role.find({ name: { $in: roles } });
        if (roleDocs.length !== roles.length) {
            const error = new Error("Some roles do not exist");
            error.statusCode = 400;
            throw error;
        }

        // Convert to `_id`
        const roleIds = roleDocs.map(role => role._id);

        // Convert `req.body.roles` to `_id`
        req.body.roles = roleIds;

        next();
    } catch (error) {
        next(error);
    }
}