import Joi from "joi";
import { adminModel } from "../models/admin.model.js";
import { roleModel } from "../models/role.model.js";
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

        const existedAdmin = await adminModel.findOne({ adminName });
        if (existedAdmin) {
            throw (
                {
                    message: "AdminName already exists",
                    statusCode: 403
                }
            )
        }

        // Find role by name
        const roleDocs = await roleModel.find({ name: { $in: roles } });
        if (roleDocs.length !== roles.length) {
            throw {
                message: "Some roles do not exist",
                statusCode: 400
            };
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
    })

    try {
        await loginSchema.validateAsync({
            email,
            password,
        }, {
            abortEarly: false
        })

        const existedAdmin = await adminModel.findOne({ email });
        req.body.admin = existedAdmin;
        const decryptedPassword = encodeService.decrypt(password, existedAdmin.salt);
        if (!existedAdmin || decryptedPassword != existedAdmin.password) {
            throw (
                {
                    message: "Email or password is invalid",
                    statusCode: 403
                }
            )
        }

        next();
    } catch (error) {
        next(error);
    }
}