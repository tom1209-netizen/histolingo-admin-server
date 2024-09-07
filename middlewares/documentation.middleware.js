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
                    "string.base": __("validation.string", { field: __("field.source") }),
                    "string.max": __("validation.max", { field: __("field.source"), max: 1000 }),
                    "any.required": __("validation.required", { field: __("field.source") })
                }),
            name: Joi.string()
                .max(250)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                    "any.required": __("validation.required", { field: __("field.name") })
                }),
            content: Joi.string()
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.content") }),
                    "any.required": __("validation.required", { field: __("field.content") })
                }),
            topicId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.topicId") }),
                    "string.hex": __("validation.hex", { field: __("field.topicId") }),
                    "string.length": __("validation.length", { field: __("field.topicId"), length: 24 }),
                    "any.required": __("validation.required", { field: __("field.topicId") })
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
            image: Joi.string()
                .uri()
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.image") }),
                    "string.uri": __("validation.uri", { field: __("field.image") }),
                    "any.required": __("validation.required", { field: __("field.image") })
                }),
            localeData: Joi.object().pattern(
                new RegExp("^[a-z]{2}-[A-Z]{2}$"),
                Joi.object({
                    name: Joi.string().max(250).messages({
                        "string.base": __("validation.string", { field: __("field.name") }),
                        "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                    }),
                    content: Joi.string().messages({
                        "string.base": __("validation.string", { field: __("field.content") }),
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
                status: 400,
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
                .messages({
                    "string.base": __("validation.string", { field: __("field.source") }),
                    "string.max": __("validation.max", { field: __("field.source"), max: 1000 }),
                }),
            name: Joi.string()
                .max(250)
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                }),
            content: Joi.string()
                .messages({
                    "string.base": __("validation.string", { field: __("field.content") }),
                }),
            topicId: Joi.string()
                .hex()
                .length(24)
                .messages({
                    "string.base": __("validation.string", { field: __("field.topicId") }),
                    "string.hex": __("validation.hex", { field: __("field.topicId") }),
                    "string.length": __("validation.length", { field: __("field.topicId"), length: 24 }),
                }),
            countryId: Joi.string()
                .hex()
                .length(24)
                .messages({
                    "string.base": __("validation.string", { field: __("field.countryId") }),
                    "string.hex": __("validation.hex", { field: __("field.countryId") }),
                    "string.length": __("validation.length", { field: __("field.countryId"), length: 24 }),
                }),
            image: Joi.string()
                .uri()
                .messages({
                    "string.base": __("validation.string", { field: __("field.image") }),
                    "string.uri": __("validation.uri", { field: __("field.image") }),
                }),
            status: Joi.number()
                .valid(documentationStatus.active, documentationStatus.inactive)
                .optional()
                .messages({
                    "any.only": __("validation.invalid", { field: __("field.status") })
                }),
            localeData: Joi.object().pattern(
                new RegExp("^[a-z]{2}-[A-Z]{2}$"),
                Joi.object({
                    name: Joi.string().max(250).messages({
                        "string.base": __("validation.string", { field: __("field.name") }),
                        "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                    }),
                    content: Joi.string().messages({
                        "string.base": __("validation.string", { field: __("field.content") }),
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
            .valid(documentationStatus.active, documentationStatus.inactive, "")
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.status") })
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