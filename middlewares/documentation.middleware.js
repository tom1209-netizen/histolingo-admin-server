import Joi from "joi";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import Documentation from "../models/documentation.model.js";
import { documentationStatus } from "../constants/documentation.constant.js";
import Topic from "../models/topic.model.js";

export const createDocumentationValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { source, name, content, topicId, countryId, localeData } = req.body;

        const createSchema = Joi.object({
            source: Joi.string()
                .max(1000)
                .required(),
            name: Joi.string()
                .max(250)
                .required(),
            content: Joi.string()
                .max(100000)
                .required(),
            topicId: Joi.string()
                .hex()
                .length(24)
                .required(),
            countryId: Joi.string()
                .hex()
                .length(24)
                .required(),
            localeData: Joi.object().pattern(/^[a-z]{2}-[A-Z]{2}$/,
                Joi.object({
                    content: Joi.string().max(250).required(),
                    name: Joi.string().max(1000).required()
                })
            ).default({}),
        });

        await createSchema.validateAsync({
            source,
            name,
            content,
            topicId,
            countryId,
            localeData
        });

        const existedTopic = await Topic.findOne({ _id: topicId });
        if (!existedTopic) {
            return res.status(400).json({
                success: false,
                message: __("validation.notFound", { field: __("model.topic.name") }),
                status: 404,
                data: null
            });
        }


        next();

    } catch (error) {
        next(error);
    }
};

export const updateDocumentationValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { source, name, content, topicId, countryId, status, localeData } = req.body;

        const createSchema = Joi.object({
            source: Joi.string()
                .max(1000),
            name: Joi.string()
                .max(250),
            content: Joi.string()
                .max(100000),
            topicId: Joi.string()
                .hex()
                .length(24),
            countryId: Joi.string()
                .hex()
                .length(24),
            status: Joi.number()
                .valid(documentationStatus.active, documentationStatus.inactive),
            localeData: Joi.object().pattern(/^[a-z]{2}-[A-Z]{2}$/,
                Joi.object({
                    content: Joi.string().max(250).required(),
                    name: Joi.string().max(1000).required()
                })
            ).default({}),
        });

        await createSchema.validateAsync({
            source,
            name,
            content,
            topicId,
            countryId,
            status,
            localeData
        });

        const id = req.params.id;
        const documentation = await Documentation.findById({ _id: id });
        if (!documentation) {
            return res.status(400).json({
                success: false,
                message: __("validation.notFound", { field: __("model.documentation.displayName") }),
                status: 400,
                data: null
            })
        };

        next();

        req.documentation = documentation;

    } catch (error) {
        next(error);
    }
};

export const getDocumentationsValidator = async (req, res, next) => {
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