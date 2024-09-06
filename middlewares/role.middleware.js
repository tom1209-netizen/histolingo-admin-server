import Joi from "joi";
import Role from "../models/role.model.js";
import { roleService } from "../services/role.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { roleStatus } from "../constants/role.constant.js";

export const createRoleValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { name, permissions } = req.body;

    const createRoleSchema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(250)
            .required()
            .messages({
                "string.base": __("validation.string", { field: __("field.name") }),
                "string.min": __("validation.min", { field: __("field.name"), min: 1 }),
                "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                "any.required": __("validation.required", { field: __("field.name") })
            }),
        permissions: Joi.array()
            .items(
                Joi
                    .number()
                    .min(1)
                    .max(34)
                    .messages({
                        "number.base": __("validation.number", { field: __("model.role.permission") }),
                        "number.min": __("validation.min", { field: __("model.role.permission"), min: 1 }),
                        "number.max": __("validation.max", { field: __("model.role.permission"), max: 26 })
                    })
            )
            .required()
            .messages({
                "array.base": __("validation.array", { field: __("model.role.permission") }),
                "any.required": __("validation.required", { field: __("model.role.permission") })
            })
    });

    try {
        await createRoleSchema.validateAsync({ name, permissions });

        const existedRole = await Role.findOne({ name });
        if (existedRole) {
            return res.status(404).json({
                success: false,
                message: __("role.roleExists", { field: __("model.role.name") }),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const updateRoleValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;
    const { name, permissions } = req.body;

    const updateRoleSchema = Joi.object({
        id: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.base": __("validation.string", { field: "id" }),
                "string.hex": __("validation.hex", { field: "id" }),
                "string.length": __("validation.length", { field: "id", length: 24 }),
                "any.required": __("validation.required", { field: "id" })
            }),
        name: Joi.string()
            .min(1)
            .max(250)
            .messages({
                "string.base": __("validation.string", { field: __("field.name") }),
                "string.min": __("validation.min", { field: __("field.name"), min: 1 }),
                "string.max": __("validation.max", { field: __("field.name"), max: 250 })
            }),
        status: Joi.number()
            .valid(roleStatus.active, roleStatus.inactive)
            .messages({
                "any.only": __("validation.invalid", { field: __("field.status") })
            }),
        permissions: Joi.array()
            .items(
                Joi.number()
                    .min(1)
                    .max(32)
                    .messages({
                        "number.base": __("validation.number", { field: __("model.role.permission") })
                    })
            )
            .messages({
                "array.base": __("validation.array", { field: __("model.role.permission") })
            })
    });

    try {
        await updateRoleSchema.validateAsync({ id, name, permissions });

        const roleExists = await roleService.getRole(id);
        if (!roleExists) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.role.name") }),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getRoleValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;

    const getRoleSchema = Joi.object({
        id: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.base": __("validation.string", { field: "id" }),
                "string.hex": __("validation.hex", { field: "id" }),
                "string.length": __("validation.length", { field: "id", length: 24 }),
                "any.required": __("validation.required", { field: "id" })
            })
    });

    try {
        await getRoleSchema.validateAsync({ id });

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getRolesValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const getRolesSchema = Joi.object({
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
            .valid(roleStatus.active, roleStatus.inactive, "")
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.status") })
            }),
    });

    try {
        const data = req.query;
        await getRolesSchema.validateAsync(data);

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}