import Joi from "joi";
import Admin from "../models/admin.model.js";
import Role from "../models/role.model.js";
import encodeService from "../utils/encode.utils.js";
import { adminStatus } from "../constants/admin.constant.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import adminService from "../services/admin.service.js";

export const createAdminValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { firstName, lastName, adminName, email, roles } = req.body;

        const createSchema = Joi.object({
            firstName: Joi.string()
                .max(100)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 100 }),
                    "any.required": __("validation.required", { field: __("field.name") })
                }),
            lastName: Joi.string()
                .max(100)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 100 }),
                    "any.required": __("validation.required", { field: __("field.name") })
                }),
            adminName: Joi.string()
                .min(1)
                .max(100)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.min": __("validation.min", { field: __("field.name"), min: 1 }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 100 }),
                    "any.required": __("validation.required", { field: __("field.name") })
                }),
            email: Joi.string()
                .email()
                .max(250)
                .required()
                .messages({
                    "string.email": __("validation.email", { field: __("field.name"), max: 100 }),
                    "any.required": __("validation.required", { field: __("field.name") })
                }),
            roles: Joi.array()
                .items(
                    Joi.string()
                        .hex()
                        .length(24)
                        .messages({
                            "string.base": __("validation.string", { field: __("model.role.name") }),
                            "string.hex": __("validation.hex", { field: __("model.role.name") }),
                            "string.length": __("validation.length", { field: __("model.role.name"), length: 24 }),
                            "any.required": __("validation.required", { field: __("model.role.name") })
                        })
                )
                .required()
                .messages({
                    "array.base": __("validation.array", { field: __("model.role.name") })
                }),
        });

        await createSchema.validateAsync({
            firstName,
            lastName,
            adminName,
            email,
            roles
        });

        const existedAdmin = await Admin.findOne({
            $or: [
                { adminName: req.body.adminName },
                { email: req.body.email }
            ]
        });

        if (existedAdmin) {
            return res.status(400).json({
                success: false,
                message: __("validation.unique", { field: __("model.admin.name") }),
                status: 400,
                data: null
            });
        }

        // Find role by id
        const roleDocs = await Role.find({ _id: { $in: roles } });
        if (roleDocs.length !== roles.length) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.role.name") }),
                status: 404,
                data: null
            });
        }

        // Extract role names
        const roleNames = roleDocs.map(role => role.name);

        // Add role names to the request object
        req.roleNames = roleNames;

        next();
    } catch (error) {
        next(error);
    }
};

export const loginAdminValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { email, password } = req.body;

        const loginSchema = Joi.object({
            email: Joi.string()
                .email()
                .max(250)
                .required()
                .messages({
                    "string.email": __("validation.email", { field: __("field.name"), max: 100 }),
                    "any.required": __("validation.required", { field: __("field.name") })
                }),
            password: Joi.string()
                .min(8)
                .max(250)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.password") }),
                    "string.min": __("validation.min", { field: __("field.password"), min: 8 }),
                    "string.max": __("validation.max", { field: __("field.password"), max: 250 }),
                    "any.required": __("validation.required", { field: __("field.password") })
                })
        })

        await loginSchema.validateAsync({
            email,
            password,
        }, {
            abortEarly: false
        });

        const existedAdmin = await Admin.findOne({ email });
        const passwordMatches = existedAdmin ? encodeService.decrypt(password, existedAdmin.password) : false;
        if (!existedAdmin) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.admin.name") }),
                status: 404,
                data: null
            });
        }

        if (existedAdmin.status !== adminStatus.active) {
            return res.status(403).json({
                success: false,
                message: __("validation.unauthorized"),
                status: 403,
                data: null
            });
        }

        if (!passwordMatches) {
            return res.status(401).json({
                success: false,
                message: __("validation.wrongPassword"),
                status: 401,
                data: null
            });
        }
        req.body.admin = existedAdmin;

        next();
    } catch (error) {
        next(error);
    }
};

export const getAdminsValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const schema = Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                "number.base": __("validation.invalid", { field: __("field.page") }),
                "number.min": __("validation.min", { field: __("field.page"), min: 1 })
            }),
        pageSize: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                "number.base": __("validation.invalid", { field: __("field.pageSize") }),
                "number.min": __("validation.min", { field: __("field.pageSize"), min: 1 })
            }),
        search: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: __("field.search") })
            }),
        sortOrder: Joi.number()
            .valid(1, -1)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.sortOrder") })
            }),
        status: Joi.number()
            .valid(adminStatus.active, adminStatus.inactive, "")
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.status") })
            }),
    });

    try {
        const value = await schema.validateAsync(req.query);
        req.query = value;
        next();
    } catch (error) {
        next(error);
    }
};

export const getRolesToAdminValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const schema = Joi.object({
        search: Joi.string()
            .allow("")
            .optional()
            .messages({
                "string.base": __("validation.invalid", { field: __("field.search") })
            })
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
    const __ = applyRequestContentLanguage(req);
    try {
        const updateSchema = Joi.object({
            firstName: Joi.string()
                .max(100)
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 100 }),
                }),
            lastName: Joi.string()
                .max(100)
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 100 }),
                }),
            adminName: Joi.string()
                .min(1)
                .max(100)
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.min": __("validation.min", { field: __("field.name"), min: 1 }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 100 }),
                }),
            email: Joi.string()
                .email()
                .max(250)
                .messages({
                    "string.email": __("validation.email", { field: __("field.email"), max: 100 }),
                }),
            roles: Joi.array()
                .items(
                    Joi.string()
                        .hex()
                        .length(24)
                        .messages({
                            "string.base": __("validation.string", { field: __("model.role.name") }),
                            "string.hex": __("validation.hex", { field: __("model.role.name") }),
                            "string.length": __("validation.length", { field: __("model.role.name"), length: 24 }),
                        })
                )
                .messages({
                    "array.base": __("validation.array", { field: __("model.role.name") })
                }),
            status: Joi.number()
                .valid(adminStatus.active, adminStatus.inactive)
                .messages({
                    "any.only": __("validation.invalid", { field: __("field.status") })
                }),
        });

        const { firstName, lastName, adminName, email, roles, status } = req.body;
        await updateSchema.validateAsync({
            firstName,
            lastName,
            adminName,
            email,
            roles,
            status
        });

        const existedAdmin = await Admin.findOne({
            $or: [
                { adminName: req.body.adminName },
                { email: req.body.email }
            ],
            _id: { $ne: req.params.id }
        });

        if (existedAdmin) {
            return res.status(400).json({
                success: false,
                message: __("validation.unique", { field: __("model.admin.name") }),
                status: 404,
                data: null
            });
        }

        const id = req.params.id;
        const adminUpdate = await Admin.findOne({ _id: id });
        if (!adminUpdate) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.admin.name") }),
                status: 404,
                data: null
            });
        }

        req.adminUpdate = adminUpdate;

        if (roles && roles.length > 0) {
            const roleDocs = await Role.find({ _id: { $in: roles } });
            if (roleDocs.length !== roles.length) {
                return res.status(404).json({
                    success: false,
                    message: __("validation.notFound", { field: __("model.role.name") }),
                    status: 404,
                    data: null
                });
            }

            const roleNames = roleDocs.map(role => role.name);
            req.roleNames = roleNames;
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const resetAdminPasswordValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const adminId = req.admin._id;
        const resetSchema = Joi.object({
            newPassword: Joi.string()
                .min(8)
                .max(250)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.password") }),
                    "string.min": __("validation.min", { field: __("field.password"), min: 8 }),
                    "string.max": __("validation.max", { field: __("field.password"), max: 250 }),
                    "any.required": __("validation.required", { field: __("field.password") })
                }),
        });

        const { oldPassword, newPassword } = req.body;

        // Check if password is there
        if (!oldPassword || !newPassword) {
            return res.status(400).json({
                success: false,
                message: __("validation.passwordsRequired"),
                status: 400,
                data: null,
            });
        }

        // Validate new password schema
        await resetSchema.validateAsync({ newPassword });

        // Verify old password
        const isPasswordValid = await adminService.verifyPassword(adminId, oldPassword);
        if (!isPasswordValid) {
            return res.status(401).json({
                success: false,
                message: __("error.invalidOldPassword"),
                status: 401,
                data: null,
            });
        }

        next();
    } catch (error) {
        next(error);
    }
}