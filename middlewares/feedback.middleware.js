import Joi from 'joi';
import Test from "../models/test.model.js";
import { applyRequestContentLanguage } from '../utils/localization.util.js';

export const createFeedbackValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const data = req.body;

    const createFeedbackSchema = Joi.object({
        createdBy: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                'string.base': __('validation.createdBy.string', { field: 'createdBy' }),
                'string.length': __('validation.createdBy.length', { field: 'createdBy', length: 24 }),
                'any.required': __('validation.createdBy.required', { field: 'createdBy' })
            }),
        content: Joi.string()
            .max(1000)
            .required()
            .messages({
                'string.base': __('validation.content.string', { field: 'content' }),
                'string.max': __('validation.content.max', { field: 'content', max: 1000 }),
                'any.required': __('validation.content.required', { field: 'content' })
            }),
        testId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                'string.base': __('validation.testId.string', { field: 'testId' }),
                'string.length': __('validation.testId.length', { field: 'testId', length: 24 }),
                'any.required': __('validation.testId.required', { field: 'testId' })
            }),
    });

    try {
        await createFeedbackSchema.validateAsync(data);

        const existedTest = Test.findById(data.testId);
        if (!existedTest) {
            return res.status(404).json({
                success: false,
                message: __('test.testNotFound'),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message || __('error.internalServerError'),
            status: 400,
            data: null
        });
    }
};

export const getFeedbackValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.query;

    const getFeedbacksSchema = Joi.string()
        .hex()
        .length(24)
        .required()

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
    const { filters, page, page_size, sortOrder } = req.query;

    const getFeedbacksSchema = Joi.object({
        filters: Joi.object().optional(),
        page: Joi.number().required(),
        page_size: Joi.number().required(),
        sortOrder: Joi.number().required()
    });

    try {
        await getFeedbacksSchema.validateAsync({ filters, page, page_size, sortOrder });

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