import Joi from "joi";
import Role from "../models/role.model.js";
import roleService from "../services/role.service.js";
import { t } from "../utils/localization.util.js";

export const createRoleValidator = async (req, res, next) => {
    const { name, permissions } = req.body;

    const createSchema = Joi.object({
        name: Joi.string()
            .min(1)
            .max(250)
            .required(),
        permissions: Joi.array()
            .items(
                Joi
                    .number()
                    .min(1)
                    .max(26)
            )
            .required()
    });

    try {
        await createSchema.validateAsync({ name, permissions });

        const existedRole = await Role.findOne({ name });
        if (existedRole) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "role.roleExists"),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
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
            .items(Joi.number()),
    });

    try {
        await updateSchema.validateAsync({ id, name, permissions });

        const roleExists = await roleService.getRole(id);
        if (!roleExists) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "role.roleNotFound"),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Internal Server Error',
            status: error.status || 500,
            data: error.data || null
        });
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
        await getSchema.validateAsync({ id });

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || 'Internal Server Error',
            status: error.status || 500,
            data: error.data || null
        });
    }
}