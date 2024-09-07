import Joi from "joi";
import Topic from "../models/topic.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { topicStatus } from "../constants/topic.constant.js";

export const createTopicValidator = async (req, res, next) => {
    const { name, description, image, countryId, localeData } = req.body;
    const __ = applyRequestContentLanguage(req);

    const createTopicSchema = Joi.object({
        name: Joi.string()
            .max(250)
            .required()
            .messages({
                "string.base": __("validation.string", { field: __("field.name") }),
                "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                "any.required": __("validation.required", { field: __("field.name") })
            }),
        description: Joi.string()
            .max(1000)
            .required()
            .messages({
                "string.base": __("validation.string", { field: __("field.description") }),
                "string.max": __("validation.max", { field: __("field.description"), max: 1000 }),
                "any.required": __("validation.required", { field: __("field.description") })
            }),
        image: Joi.string()
            .uri()
            .required()
            .messages({
                "string.base": __("validation.string", { field: __("field.image") }),
                "string.uri": __("validation.uri", { field: __("field.image") }),
                "any.required": __("validation.required", { field: __("field.image") })
            }),
        countryId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.base": __("validation.string", { field: __("field.countryId") }),
                "string.hex": __("validation.hex", { field: __("field.countryId") }),
                "string.length": __("validation.length", { field: __("field.countryId"), length: 24 }),
                "any.required": __("validation.required", { field: __("field.countryId") })
            }),
        localeData: Joi.object().pattern(
            new RegExp("^[a-z]{2}-[A-Z]{2}$"),
            Joi.object({
                name: Joi.string().max(250).messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                }),
                description: Joi.string().max(1000).messages({
                    "string.base": __("validation.string", { field: __("field.description") }),
                    "string.max": __("validation.max", { field: __("field.description"), max: 1000 }),
                })
            })
        ).default({})
            .messages({
                "object.pattern.match": __("validation.pattern", { pattern: "^[a-z]{2}-[A-Z]{2}$" })
            })
    });

    try {
        await createTopicSchema.validateAsync({ name, description, image, countryId, localeData });

        const existedTopic = await Topic.findOne({ name });
        if (existedTopic) {
            return res.status(404).json({
                success: false,
                message: __("validation.exist", { field: __("model.topic.name") }),
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
                "string.base": __("validation.string", { field: __("field.topicId") }),
                "string.hex": __("validation.hex", { field: __("field.topicId") }),
                "string.length": __("validation.length", { field: __("field.topicId"), length: 24 }),
                "any.required": __("validation.required", { field: __("field.topicId") })
            }),
        name: Joi.string()
            .max(250)
            .messages({
                "string.base": __("validation.string", { field: __("field.name") }),
                "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
            }),
        description: Joi.string()
            .max(1000)
            .messages({
                "string.base": __("validation.string", { field: __("field.description") }),
                "string.max": __("validation.max", { field: __("field.description"), max: 1000 }),
            }),
        image: Joi.string()
            .uri()
            .messages({
                "string.base": __("validation.string", { field: __("field.image") }),
                "string.uri": __("validation.uri", { field: __("field.image") }),
            }),
        status: Joi.number()
            .valid(topicStatus.active, topicStatus.inactive)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.status") })
            }),
        countryId: Joi.string()
            .hex()
            .length(24)
            .messages({
                "string.base": __("validation.string", { field: __("field.countryId") }),
                "string.hex": __("validation.hex", { field: __("field.countryId") }),
                "string.length": __("validation.length", { field: __("field.countryId"), length: 24 }),
            }),
        localeData: Joi.object().pattern(
            new RegExp("^[a-z]{2}-[A-Z]{2}$"),
            Joi.object({
                name: Joi.string().max(250).messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                }),
                description: Joi.string().max(1000).messages({
                    "string.base": __("validation.string", { field: __("field.description") }),
                    "string.max": __("validation.max", { field: __("field.description"), max: 1000 }),
                })
            })
        ).default({})
            .messages({
                "object.pattern.match": __("validation.pattern", { pattern: "^[a-z]{2}-[A-Z]{2}$" })
            })
    });

    try {
        await updateTopicSchema.validateAsync({ id, name, description, image, countryId, localeData });

        const existedTopic = await Topic.findById(id);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.topic.name") }),
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
                "string.base": __("validation.string", { field: __("field.topicId") }),
                "string.hex": __("validation.hex", { field: __("field.topicId") }),
                "string.length": __("validation.length", { field: __("field.topicId"), length: 24 }),
                "any.required": __("validation.required", { field: __("field.topicId") })
            })
    });

    try {
        await getTopicSchema.validateAsync({ id });

        const existedTopic = await Topic.findById(id);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.topic.name") }),
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
};

export const getTopicsValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const getTopicsSchema = Joi.object({
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
            .valid(topicStatus.active, topicStatus.inactive, "")
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.status") })
            }),
        countryName: Joi.string()
            .optional()
            .messages({
                "string.base": __("validation.invalid", { field: __("field.search") })
            })
    });

    try {
        const data = req.query;
        await getTopicsSchema.validateAsync(data);

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