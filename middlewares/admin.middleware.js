import Joi from "joi";
import Admin from "../models/admin.model.js";
import Role from "../models/role.model.js";
import encodeService from "../utils/encode.utils.js";
import tokenService from "../services/token.service.js";
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
                .items(Joi.string().hex().length(24))
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

        const existedAdmin = await Admin.findOne({
            $or: [
                { adminName: req.body.adminName },
                { email: req.body.email }
            ]
        });

        if (existedAdmin) {
            const error = new Error("AdminName or email already exists");
            error.statusCode = 403;
            throw error;
        }


        // Find role by id
        const roleDocs = await Role.find({ _id: { $in: roles } });
        if (roleDocs.length !== roles.length) {
            const error = new Error("Some roles do not exist");
            error.statusCode = 400;
            throw error;
        }

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
};

export const getListAdminValidator = async (req, res, next) => {
    const schema = Joi.object({
        search: Joi.string().allow(''),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        status: Joi.number()
            .allow(null, "")
            .valid(adminStatus.active, adminStatus.inactive),
    });

    try {
        const value = await schema.validateAsync(req.query);
        req.query = value;
        next();
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
                .items(Joi.string().hex().length(24))
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

        // Find role by id
        const roleDocs = await Role.find({ _id: { $in: roles } });
        if (roleDocs.length !== roles.length) {
            const error = new Error("Some roles do not exist");
            error.statusCode = 400;
            throw error;
        }

        next();
    } catch (error) {
        next(error);
    }
};