import Joi from 'joi';
import { applyRequestContentLanguage } from '../utils/localization.util.js';
import { feedbackStatus } from '../constants/feedback.constant.js';

export const getFeedbackValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;

    const getFeedbacksSchema = Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": __("validation.string", { field: "field.feedback" }),
            "string.hex": __("validation.hex", { field: "field.feedback" }),
            "string.length": __("validation.length", { field: "field.feedback", length: 24 }),
            "any.required": __("validation.required", { field: "field.feedback" })
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
                "number.base": __("validation.invalid", { field: "field.page" }),
                "number.min": __("validation.min", { field: "field.page", min: 1 })
            }),
        pageSize: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                "number.base": __("validation.invalid", { field: "field.pageSize" }),
                "number.min": __("validation.min", { field: "field.pageSize", min: 1 })
            }),
        search: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: "field.search" })
            }),
        sortOrder: Joi.number()
            .valid(1, -1)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: "field.sortOrder" })
            }),
        status: Joi.number()
            .valid(feedbackStatus.active, feedbackStatus.inactive)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: "field.status" })
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

export const replyFeedbackValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;
    const { subject, reply } = req.body;

    const replyFeedbackSchema = Joi.object({
        id: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                'string.hex': __('question.invalidId'),
                'string.length': __('question.invalidIdLength'),
                'any.required': __('question.idRequired')
            }),
        subject: Joi.string()
            .required()
            .messages({
                'string.base': __('question.invalidSubject'),
                'any.required': __('question.subjectRequired'),
            }),
        reply: Joi.string()
            .required()
            .messages({
                'string.base': __('question.invalidReply'),
                'any.required': __('question.replyRequired'),
            })
    });

    try {
        const data = { id, subject, reply };
        await replyFeedbackSchema.validateAsync(data);

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