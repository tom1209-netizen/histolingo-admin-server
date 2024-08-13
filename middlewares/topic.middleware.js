import Joi from 'joi';
import Topic from '../models/topic.model.js';
import { applyRequestContentLanguage } from '../utils/localization.util.js';

export const createTopicValidator = async (req, res, next) => {
    const { name, description, image, countryId, localeData } = req.body;
    const __ = applyRequestContentLanguage(req);

    const createTopicSchema = Joi.object({
        name: Joi.string()
            .max(250)
            .required()
            .messages({
                'string.base': __('validation.name.string', { field: 'name' }),
                'string.max': __('validation.name.max', { field: 'name', max: 250 }),
                'any.required': __('validation.name.required', { field: 'name' })
            }),
        description: Joi.string()
            .max(1000)
            .required()
            .messages({
                'string.base': __('validation.description.string', { field: 'description' }),
                'string.max': __('validation.description.max', { field: 'description', max: 1000 }),
                'any.required': __('validation.description.required', { field: 'description' })
            }),
        image: Joi.string()
            .uri()
            .required()
            .messages({
                'string.base': __('validation.image.string', { field: 'image' }),
                'string.uri': __('validation.image.uri', { field: 'image' }),
                'any.required': __('validation.image.required', { field: 'image' })
            }),
        countryId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                'string.base': __('validation.countryId.string', { field: 'countryId' }),
                'string.hex': __('validation.countryId.hex', { field: 'countryId' }),
                'string.length': __('validation.countryId.length', { field: 'countryId', length: 24 }),
                'any.required': __('validation.countryId.required', { field: 'countryId' })
            }),
        localeData: Joi.object().pattern(
            new RegExp('^[a-z]{2}-[A-Z]{2}$'),
            Joi.object({
                name: Joi.string().max(250).required().messages({
                    'string.base': __('validation.localeData.name.string', { field: 'localeData.name' }),
                    'string.max': __('validation.localeData.name.max', { field: 'localeData.name', max: 250 }),
                    'any.required': __('validation.localeData.name.required', { field: 'localeData.name' })
                }),
                description: Joi.string().max(1000).required().messages({
                    'string.base': __('validation.localeData.description.string', { field: 'localeData.description' }),
                    'string.max': __('validation.localeData.description.max', { field: 'localeData.description', max: 1000 }),
                    'any.required': __('validation.localeData.description.required', { field: 'localeData.description' })
                })
            })
        ).default({})
        .messages({
            'object.pattern.match': __('validation.localeData.pattern', { pattern: '^[a-z]{2}-[A-Z]{2}$' })
        })
    });

    try {
        await createTopicSchema.validateAsync({ name, description, image, countryId, localeData });

        const existedTopic = await Topic.findOne({ name });
        if (existedTopic) {
            return res.status(404).json({
                success: false,
                message: __('topic.topicExists'),
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
};

export const updateTopicValidator = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, image, countryId, localeData } = req.body;
    const __ = applyRequestContentLanguage(req);

    const updateTopicSchema = Joi.object({
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
            .max(250)
            .messages({
                'string.base': __('validation.name.string', { field: 'name' }),
                'string.max': __('validation.name.max', { field: 'name', max: 250 })
            }),
        description: Joi.string()
            .max(1000)
            .messages({
                'string.base': __('validation.description.string', { field: 'description' }),
                'string.max': __('validation.description.max', { field: 'description', max: 1000 })
            }),
        image: Joi.string()
            .uri()
            .messages({
                'string.base': __('validation.image.string', { field: 'image' }),
                'string.uri': __('validation.image.uri', { field: 'image' })
            }),
        countryId: Joi.string()
            .hex()
            .length(24)
            .messages({
                'string.base': __('validation.countryId.string', { field: 'countryId' }),
                'string.hex': __('validation.countryId.hex', { field: 'countryId' }),
                'string.length': __('validation.countryId.length', { field: 'countryId', length: 24 })
            }),
        localeData: Joi.object().pattern(
            new RegExp('^[a-z]{2}-[A-Z]{2}$'),
            Joi.object({
                name: Joi.string().max(250).messages({
                    'string.base': __('validation.localeData.name.string', { field: 'localeData.name' }),
                    'string.max': __('validation.localeData.name.max', { field: 'localeData.name', max: 250 }),
                }),
                description: Joi.string().max(1000).messages({
                    'string.base': __('validation.localeData.description.string', { field: 'localeData.description' }),
                    'string.max': __('validation.localeData.description.max', { field: 'localeData.description', max: 1000 }),
                })
            })
        ).default({})
        .messages({
            'object.pattern.match': __('validation.localeData.pattern', { pattern: '^[a-z]{2}-[A-Z]{2}$' })
        })
    });

    try {
        await updateTopicSchema.validateAsync({ id, name, description, image, countryId, localeData });

        const existedTopic = await Topic.findById(id);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: __('topic.topicNotFound'),
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
};

export const getTopicValidator = async (req, res, next) => {
    const { id } = req.params;
    const __ = applyRequestContentLanguage(req);

    const getTopicSchema = Joi.object({
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
        await getTopicSchema.validateAsync({ id });

        const existedTopic = await Topic.findById(id);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: __('topic.topicNotFound'),
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
};

export const getTopicsValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const getTopicsSchema = Joi.object({
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
        await getTopicsSchema.validateAsync(data);

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