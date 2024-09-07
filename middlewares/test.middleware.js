import Joi from "joi";
import Documentation from "../models/documentation.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { BaseQuestion } from "../models/question.model.js";
import Test from "../models/test.model.js";
import Topic from "../models/topic.model.js";
import Country from "../models/country.model.js";
import { testStatus } from "../constants/test.constant.js";


export const createTestValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, documentationsId, questionsId, topicId, countryId, localeData } = req.body;
        const schema = Joi.object({
            name: Joi.string()
                .max(250)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                    "any.required": __("validation.required", { field: __("field.name") })
                }),
            documentationsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.documentationId") }),
                    "string.hex": __("validation.hex", { field: __("field.documentationId") }),
                    "string.length": __("validation.length", { field: __("field.documentationId"), length: 24 }),
                    "any.required": __("validation.required", { field: __("field.documentationId") })
                }),
            questionsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.questionId") }),
                    "string.hex": __("validation.hex", { field: __("field.questionId") }),
                    "string.length": __("validation.length", { field: __("field.questionId"), length: 24 }),
                    "any.required": __("validation.required", { field: __("field.questionId") })
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
            localeData: Joi.object().pattern(
                new RegExp("^[a-z]{2}-[A-Z]{2}$"),
                Joi.object({
                    name: Joi.string().max(250).messages({
                        "string.base": __("validation.string", { field: __("field.name") }),
                        "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                    })
                })
            ).default({}),
        });

        await schema.validateAsync({
            name,
            documentationsId,
            questionsId,
            topicId,
            countryId,
            localeData
        });

        const documentationDocs = await Documentation.find({ _id: { $in: documentationsId } });
        if (documentationDocs.length !== documentationsId.length) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.documentation.displayListName") }),
                status: 404,
                data: null
            });
        };

        const topic = await Topic.findById({ _id: topicId });
        if (!topic) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.topic.name") }),
                status: 404,
                data: null
            })
        };

        const country = await Country.findById({ _id: countryId });
        if (!country) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.country.name") }),
                status: 404,
                data: null
            })
        };

        const questionDocs = await BaseQuestion.find({ _id: { $in: questionsId } });
        if (questionDocs.length !== questionsId.length) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.question.name") }),
                status: 404,
                data: null
            });
        };

        // Attach questions to request object
        req.questions = questionDocs;
        next();
    } catch (error) {
        next(error);
    }

};

export const updateTestValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, documentationsId, questionsId, topicId, countryId, status, localeData } = req.body;
        const schema = Joi.object({
            name: Joi.string()
                .max(250)
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                }),
            documentationsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .messages({
                    "string.base": __("validation.string", { field: __("field.documentationId") }),
                    "string.hex": __("validation.hex", { field: __("field.documentationId") }),
                    "string.length": __("validation.length", { field: __("field.documentationId"), length: 24 }),
                }),
            questionsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .messages({
                    "string.base": __("validation.string", { field: __("field.questionId") }),
                    "string.hex": __("validation.hex", { field: __("field.questionId") }),
                    "string.length": __("validation.length", { field: __("field.questionId"), length: 24 }),
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
            status: Joi.number()
                .valid(testStatus.active, testStatus.inactive)
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
                    })
                })
            ).default({}),
        });

        await schema.validateAsync({
            name,
            documentationsId,
            questionsId,
            topicId,
            countryId,
            status,
            localeData
        });

        const id = req.params.id;
        const test = await Test.findById({ _id: id });
        if (!test) {
            return res.status(400).json({
                success: false,
                message: __("validation.notFound", { field: __("model.test.name") }),
                status: 400,
                data: null
            })
        };

        if (documentationsId && documentationsId.length > 0) {
            const documentationDocs = await Documentation.find({ _id: { $in: documentationsId } });
            if (documentationDocs.length !== documentationsId.length) {
                return res.status(404).json({
                    success: false,
                    message: __("validation.notFound", { field: __("model.documentation.displayListName") }),
                    status: 404,
                    data: null
                });
            };
        }

        if (topicId) {
            const topic = await Topic.findById({ _id: topicId });
            if (!topic) {
                return res.status(400).json({
                    success: false,
                    message: __("validation.notFound", { field: __("model.topic.name") }),
                    status: 400,
                    data: null
                })
            };
        }

        if (countryId) {
            const country = await Country.findById({ _id: countryId });
            if (!country) {
                return res.status(400).json({
                    success: false,
                    message: __("validation.notFound", { field: __("model.country.name") }),
                    status: 400,
                    data: null
                })
            };
        }

        if (questionsId && questionsId.length > 0) {
            const questionDocs = await BaseQuestion.find({ _id: { $in: questionsId } });
            if (questionDocs.length !== questionsId.length) {
                return res.status(404).json({
                    success: false,
                    message: __("validation.notFound", { field: __("model.question.name") }),
                    status: 404,
                    data: null
                });
            };
        }

        req.test = test;
        next();
    } catch (error) {
        next(error);
    }
};

export const getDataValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const schema = Joi.object({
        search: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: __("field.search") })
            })
    });

    try {
        const value = await schema.validateAsync(req.query);
        req.query = value;
        next();
    } catch (error) {
        next(error);
    }
};


export const getTestsValidator = async (req, res, next) => {
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
            .valid(testStatus.active, testStatus.inactive, "")
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

export const startDemoValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { testId } = req.body;
        const existingTest = await Test.findById({ _id: testId });
        if (!existingTest) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.test.name") }),
                status: 404,
                data: null
            });
        }
        req.test = existingTest;

        next();
    } catch (error) {
        next(error);
    }
};

export const checkAnswerValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const schema = Joi.object({
        testResultId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.base": __("validation.string", { field: __("field.testResultId") }),
                "string.hex": __("validation.hex", { field: __("field.testResultId") }),
                "string.length": __("validation.length", { field: __("field.testResultId"), length: 24 }),
                "any.required": __("validation.required", { field: __("field.testResultId") })
            }),
        questionId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.base": __("validation.string", { field: __("field.questionId") }),
                "string.hex": __("validation.hex", { field: __("field.questionId") }),
                "string.length": __("validation.length", { field: __("field.questionId"), length: 24 }),
                "any.required": __("validation.required", { field: __("field.questionId") })
            }),
        playerAnswer: Joi.alternatives()
            .try(
                Joi.boolean(),
                Joi.number(),
                Joi.array().items(
                    Joi.object({
                        leftColumn: Joi.string().required(),
                        rightColumn: Joi.string().required()
                    })
                ),
                Joi.array().items(Joi.string())
            )
            .required()
            .not(Joi.string())
            .messages({
                "any.only": __("validation.invalid", { field: __("field.playerAnswer") }),
                "any.required": __("validation.required", { field: __("field.playerAnswer") })
            })
    });

    try {
        await schema.validateAsync(req.body);
        next();
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: error.message,
            status: 400,
            data: null
        });
    }
};