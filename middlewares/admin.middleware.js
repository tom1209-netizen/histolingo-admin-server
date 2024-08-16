import Joi from "joi";
import Admin from "../models/admin.model.js";
import Role from "../models/role.model.js";
import encodeService from "../utils/encode.utils.js";
import { adminStatus } from "../constants/admin.constant.js";
import { applyRequestContentLanguage, t } from "../utils/localization.util.js";

export const createAdminValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
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
            return res.status(404).json({
                success: false,
                message: __("validation.unique", { field: __("model.admin.name") }),
                status: 404,
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
        const passwordMatches = existedAdmin ? encodeService.decrypt(password, existedAdmin.password) : false;
        if (!existedAdmin || !passwordMatches) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.admin.name") }),
                status: 404,
                data: null
            });
        }
        req.body.admin = existedAdmin;

        next();
    } catch (error) {
        next(error);
    }
};

export const getListAdminValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const schema = Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                'number.base': __('question.invalidPage'),
                'number.min': __('question.pageMin')
            }),
        pageSize: Joi.number()
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
                .max(100),
            lastName: Joi.string()
                .max(100),
            adminName: Joi.string()
                .min(8)
                .max(100),
            email: Joi.string()
                .email()
                .max(250),
            password: Joi.string()
                .min(8)
                .max(250),
            roles: Joi.array()
                .items(Joi.string().hex().length(24)),
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

        const existedAdmin = await Admin.findOne({
            $or: [
                { adminName: req.body.adminName },
                { email: req.body.email }
            ],
            _id: { $ne: req.params.id }
        });

        if (existedAdmin) {
            return res.status(404).json({
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

        next();
    } catch (error) {
        next(error);
    }
};