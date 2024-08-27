import Joi from "joi";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import Documentation from "../models/documentation.model.js";
import { documentationStatus } from "../constants/documentation.constant.js";
import Topic from "../models/topic.model.js";

export const createDocumentationValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { source, name, content, topicId, countryId, image, localeData } = req.body;

        const createSchema = Joi.object({
            source: Joi.string()
                .max(1000)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.source" }),
                    "string.max": __("validation.max", { field: "field.source", max: 1000 }),
                    "any.required": __("validation.required", { field: "field.source" })
                }),
            name: Joi.string()
                .max(250)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.name" }),
                    "string.max": __("validation.max", { field: "field.name", max: 250 }),
                    "any.required": __("validation.required", { field: "field.name" })
                }),
            content: Joi.string()
                .max(100000)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.content" }),
                    "string.max": __("validation.max", { field: "field.content", max: 100000 }),
                    "any.required": __("validation.required", { field: "field.content" })
                }),
            topicId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.topicId" }),
                    "string.hex": __("validation.hex", { field: "field.topicId" }),
                    "string.length": __("validation.length", { field: "field.topicId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.topicId" })
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
            image: Joi.string()
                .uri()
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.image" }),
                    "string.uri": __("validation.image.uri", { field: "field.image" }),
                    "any.required": __("validation.image.required", { field: "field.image" })
                }),
            localeData: Joi.object().pattern(
                new RegExp("^[a-z]{2}-[A-Z]{2}$"),
                Joi.object({
                    name: Joi.string().max(250).messages({
                        "string.base": __("validation.string", { field: "field.name" }),
                        "string.max": __("validation.max", { field: "field.name", max: 250 }),
                    }),
                    content: Joi.string().max(1000).messages({
                        "string.base": __("validation.string", { field: "field.description" }),
                        "string.max": __("validation.max", { field: "field.description", max: 1000 }),
                    })
                })
            ).default({})
                .messages({
                    "object.pattern.match": __("validation.pattern", { pattern: "^[a-z]{2}-[A-Z]{2}$" })
                }),
        });

        await createSchema.validateAsync({
            source,
            name,
            content,
            topicId,
            countryId,
            image,
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
        const { source, name, content, topicId, countryId, image, status, localeData } = req.body;

        const createSchema = Joi.object({
            source: Joi.string()
                .max(1000)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.source" }),
                    "string.max": __("validation.max", { field: "field.source", max: 1000 }),
                    "any.required": __("validation.required", { field: "field.source" })
                }),
            name: Joi.string()
                .max(250)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.name" }),
                    "string.max": __("validation.max", { field: "field.name", max: 250 }),
                    "any.required": __("validation.required", { field: "field.name" })
                }),
            content: Joi.string()
                .max(100000)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.content" }),
                    "string.max": __("validation.max", { field: "field.content", max: 100000 }),
                    "any.required": __("validation.required", { field: "field.content" })
                }),
            topicId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.topicId" }),
                    "string.hex": __("validation.hex", { field: "field.topicId" }),
                    "string.length": __("validation.length", { field: "field.topicId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.topicId" })
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
            image: Joi.string()
                .uri()
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.image" }),
                    "string.uri": __("validation.image.uri", { field: "field.image" }),
                    "any.required": __("validation.image.required", { field: "field.image" })
                }),
            status: Joi.number()
                .valid(documentationStatus.active, documentationStatus.inactive)
                .optional()
                .messages({
                    "any.only": __("validation.invalid", { field: "field.status" })
                }),
            localeData: Joi.object().pattern(
                new RegExp("^[a-z]{2}-[A-Z]{2}$"),
                Joi.object({
                    name: Joi.string().max(250).messages({
                        "string.base": __("validation.string", { field: "field.name" }),
                        "string.max": __("validation.max", { field: "field.name", max: 250 }),
                    }),
                    content: Joi.string().max(1000).messages({
                        "string.base": __("validation.string", { field: "field.description" }),
                        "string.max": __("validation.max", { field: "field.description", max: 1000 }),
                    })
                })
            ).default({})
                .messages({
                    "object.pattern.match": __("validation.pattern", { pattern: "^[a-z]{2}-[A-Z]{2}$" })
                }),
        });

        await createSchema.validateAsync({
            source,
            name,
            content,
            topicId,
            countryId,
            image,
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
            .valid(documentationStatus.active, documentationStatus.inactive)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: "field.status" })
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