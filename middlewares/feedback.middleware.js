import Joi from 'joi';
import Test from "../models/test.model.js";
import { applyRequestContentLanguage } from '../utils/localization.util.js';

export const getFeedbackValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.query;

    const getFeedbacksSchema = Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            'string.hex': __('question.invalidId'),
            'string.length': __('question.invalidIdLength'),
            'any.required': __('question.idRequired')
        });

    try {
        await getFeedbacksSchema.validateAsync(id);

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || __('error.internalServerError'),
            status: 400,
            data: null
        });
    }
}

export const getFeedbacksValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const getFeedbacksSchema = Joi.object({
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
        const data = req.query;
        await getFeedbacksSchema.validateAsync(data);

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || __('error.internalServerError'),
            status: 400,
            data: null
        });
    }
}