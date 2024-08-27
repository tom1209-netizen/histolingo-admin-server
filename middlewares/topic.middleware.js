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
                "string.base": __("validation.string", { field: "field.name" }),
                "string.max": __("validation.max", { field: "field.name", max: 250 }),
                "any.required": __("validation.required", { field: "field.name" })
            }),
        description: Joi.string()
            .max(1000)
            .required()
            .messages({
                "string.base": __("validation.string", { field: "field.description" }),
                "string.max": __("validation.max", { field: "field.description", max: 1000 }),
                "any.required": __("validation.required", { field: "field.description" })
            }),
        image: Joi.string()
            .uri()
            .required()
            .messages({
                "string.base": __("validation.string", { field: "field.image" }),
                "string.uri": __("validation.image.uri", { field: "field.image" }),
                "any.required": __("validation.image.required", { field: "field.image" })
            }),
        countryId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.base": __("validation.string", { field: "field.countryId" }),
                "string.hex": __("validation.hex", { field: "field.countryId" }),
                "string.length": __("validation.length", { field: "field.countryId", length: 24 }),
                "any.required": __("validation.required", { field: "field.countryId" })
            }),
        localeData: Joi.object().pattern(
            new RegExp("^[a-z]{2}-[A-Z]{2}$"),
            Joi.object({
                name: Joi.string().max(250).messages({
                    "string.base": __("validation.string", { field: "field.name" }),
                    "string.max": __("validation.max", { field: "field.name", max: 250 }),
                }),
                description: Joi.string().max(1000).messages({
                    "string.base": __("validation.string", { field: "field.description" }),
                    "string.max": __("validation.max", { field: "field.description", max: 1000 }),
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
                "string.base": __("validation.string", { field: "field.topicId" }),
                "string.hex": __("validation.hex", { field: "field.topicId" }),
                "string.length": __("validation.length", { field: "field.topicId", length: 24 }),
                "any.required": __("validation.required", { field: "field.topicId" })
            }),
        name: Joi.string()
            .max(250)
            .required()
            .messages({
                "string.base": __("validation.string", { field: "field.name" }),
                "string.max": __("validation.max", { field: "field.name", max: 250 }),
                "any.required": __("validation.required", { field: "field.name" })
            }),
        description: Joi.string()
            .max(1000)
            .required()
            .messages({
                "string.base": __("validation.string", { field: "field.description" }),
                "string.max": __("validation.max", { field: "field.description", max: 1000 }),
                "any.required": __("validation.required", { field: "field.description" })
            }),
        image: Joi.string()
            .uri()
            .required()
            .messages({
                "string.base": __("validation.string", { field: "field.image" }),
                "string.uri": __("validation.image.uri", { field: "field.image" }),
                "any.required": __("validation.image.required", { field: "field.image" })
            }),
        status: Joi.number()
            .valid(topicStatus.active, topicStatus.inactive)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: "field.status" })
            }),
        countryId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.base": __("validation.string", { field: "field.countryId" }),
                "string.hex": __("validation.hex", { field: "field.countryId" }),
                "string.length": __("validation.length", { field: "field.countryId", length: 24 }),
                "any.required": __("validation.required", { field: "field.countryId" })
            }),
        localeData: Joi.object().pattern(
            new RegExp("^[a-z]{2}-[A-Z]{2}$"),
            Joi.object({
                name: Joi.string().max(250).messages({
                    "string.base": __("validation.string", { field: "field.name" }),
                    "string.max": __("validation.max", { field: "field.name", max: 250 }),
                }),
                description: Joi.string().max(1000).messages({
                    "string.base": __("validation.string", { field: "field.description" }),
                    "string.max": __("validation.max", { field: "field.description", max: 1000 }),
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
                "string.base": __("validation.string", { field: "field.topicId" }),
                "string.hex": __("validation.hex", { field: "field.topicId" }),
                "string.length": __("validation.length", { field: "field.topicId", length: 24 }),
                "any.required": __("validation.required", { field: "field.topicId" })
            })
    });

    try {
        await getTopicSchema.validateAsync({ id });

        const existedTopic = await Topic.findById(id);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: __("topic.topicNotFound"),
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
                "number.base": __("question.invalidPage"),
                "number.min": __("question.pageMin")
            }),
        pageSize: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                "number.base": __("question.invalidPageSize"),
                "number.min": __("question.pageSizeMin")
            }),
        search: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("question.invalidSearch")
            }),
        countryName: Joi.string()
            .optional()
            .messages({
                "string.base": __("question.invalidSearch")
            }),
        sortOrder: Joi.number()
            .valid(1, -1)
            .optional()
            .messages({
                "any.only": __("question.invalidSortOrder")
            }),
        status: Joi.number()
            .valid(0, 1)
            .optional()
            .messages({
                "any.only": __("question.invalidStatus")
            }),
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