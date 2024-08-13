import Joi from "joi";
import Role from "../models/role.model.js";
import { roleService } from "../services/role.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const createRoleValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { name, permissions } = req.body;

    const createRoleSchema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(250)
            .required()
            .messages({
                'string.base': __('validation.name.string', { field: 'name' }),
                'string.min': __('validation.name.min', { field: 'name', min: 1 }),
                'string.max': __('validation.name.max', { field: 'name', max: 250 }),
                'any.required': __('validation.name.required', { field: 'name' })
            }),
        permissions: Joi.array()
            .items(
                Joi
                    .number()
                    .min(1)
                    .max(26)
                    .messages({
                        'number.base': __('validation.permissions.number'),
                        'number.min': __('validation.permissions.min', { min: 1 }),
                        'number.max': __('validation.permissions.max', { max: 26 })
                    })
            )
            .required()
            .messages({
                'array.base': __('validation.permissions.array'),
                'any.required': __('validation.permissions.required')
            })
    });

    try {
        await createRoleSchema.validateAsync({ name, permissions });

        const existedRole = await Role.findOne({ name });
        if (existedRole) {
            return res.status(404).json({
                success: false,
                message: __('role.roleExists'),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
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
                'string.base': __('validation.id.string', { field: 'id' }),
                'string.hex': __('validation.id.hex', { field: 'id' }),
                'string.length': __('validation.id.length', { field: 'id', length: 24 }),
                'any.required': __('validation.id.required', { field: 'id' })
            }),
        name: Joi.string()
            .min(1)
            .max(250)
            .messages({
                'string.base': __('validation.name.string', { field: 'name' }),
                'string.min': __('validation.name.min', { field: 'name', min: 1 }),
                'string.max': __('validation.name.max', { field: 'name', max: 250 })
            }),
        permissions: Joi.array()
            .items(
                Joi.number()
                .messages({
                    'number.base': __('validation.permissions.number')
                })
            )
            .messages({
                'array.base': __('validation.permissions.array')
            })
    });

    try {
        await updateRoleSchema.validateAsync({ id, name, permissions });

        const roleExists = await roleService.getRole(id);
        if (!roleExists) {
            return res.status(404).json({
                success: false,
                message: __('role.roleNotFound'),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
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
                'string.base': __('validation.id.string', { field: 'id' }),
                'string.hex': __('validation.id.hex', { field: 'id' }),
                'string.length': __('validation.id.length', { field: 'id', length: 24 }),
                'any.required': __('validation.id.required', { field: 'id' })
            })
    });

    try {
        await getRoleSchema.validateAsync({ id });

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
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
                'number.base': __('question.invalidPage'),
                'number.min': __('question.pageMin')
            }),
        page_size: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                'number.base': __('question.invalidPageSize'),
                'number.min': __('question.pageSizeMin')
            }),
        search: Joi.string()
            .optional()
            .allow('')
            .messages({
                'string.base': __('question.invalidSearch')
            }),
        sortOrder: Joi.number()
            .valid(1, -1)
            .optional()
            .messages({
                'any.only': __('question.invalidSortOrder')
            }),
        status: Joi.number()
            .valid(0, 1)
            .optional()
            .messages({
                'any.only': __('question.invalidStatus')
            }),
    });

    try {
        const data = req.query;
        await getRolesSchema.validateAsync(data);

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
            status: error.status || 500,
            data: error.data || null
        });
    }
}