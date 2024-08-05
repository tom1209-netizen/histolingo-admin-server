import Joi from "joi";
import Role from "../models/role.model.js";
import { roleService } from "../services/role.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const createRoleValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { name, permissions } = req.body;

    const createSchema = Joi.object({
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
        await createSchema.validateAsync({ name, permissions });

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

    const updateSchema = Joi.object({
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
        await updateSchema.validateAsync({ id, name, permissions });

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

    const getSchema = Joi.object({
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
        await getSchema.validateAsync({ id });

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