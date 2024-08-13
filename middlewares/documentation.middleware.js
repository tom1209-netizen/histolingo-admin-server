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

        const id = req.params.id;
        const documentation = await Documentation.findById({ _id: id });
        if (!documentation) {
            return res.status(400).json({
                success: false,
                message: __("validation.notFound", { field: "model.documentation.name" }),
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

export const getListDocumentationValidator = async (req, res, next) => {
    const schema = Joi.object({
        search: Joi.string().allow(''),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        status: Joi.number()
            .allow(null, "")
            .valid(documentationStatus.active, documentationStatus.inactive),
    });

    try {
        const value = await schema.validateAsync(req.query);
        req.query = value;
        next();
    } catch (error) {
        next(error);
    }
};