import Joi from "joi";
import Topic from "../models/topic.model.js";
import Country from "../models/country.model.js";
import { BaseQuestion } from "../models/question.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { questionType, answer, questionStatus } from "../constants/question.constant.js";

export const createQuestionValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const baseQuestionSchema = Joi.object({
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
        questionType: Joi.number()
            .valid(
                questionType.trueFalse,
                questionType.multipleChoice,
                questionType.matching,
                questionType.fillInTheBlank
            )
            .required()
            .messages({
                "any.only": __("validation.invalid", { field: "model.question.questionType" }),
                "any.required": __("validation.required", { field: "model.question.questionType" })
            }),
        ask: Joi.string()
            .required()
            .messages({
                "any.required": __("validation.required", { field: "model.question.ask" })
            }),
        localeData: Joi.object().messages({
            "object.base": __("validation.invalid", { field: "field.localeData" })
        })
    });

    const trueFalseSchema = baseQuestionSchema.keys({
        answer: Joi.boolean()
            .required()
            .messages({
                "boolean.base": __("validation.invalid", { field: "model.question.trueFalseAnswer" }),
                "any.required": __("validation.required", { field: "model.question.trueFalseAnswer" })
            })
    });

    const multipleChoiceSchema = baseQuestionSchema.keys({
        options: Joi.array()
            .items(
                Joi.string().messages({
                    "string.base": __("validation.invalid", { field: "model.question.option" })
                })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: "model.question.options" }),
                "any.required": __("validation.required", { field: "model.question.options" })
            }),
        answer: Joi.number()
            .valid(
                answer.a,
                answer.b,
                answer.c,
                answer.d
            )
            .required()
            .messages({
                "any.only": __("validation.invalid", { field: "model.question.multipleChoiceAnswer" }),
                "any.required": __("validation.required", { field: "model.question.multipleChoiceAnswer" })
            })
    });

    const matchingSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.object({
                    leftColumn: Joi.string()
                        .required()
                        .messages({
                            "string.base": __("validation.invalid", { field: "model.question.leftColumn" }),
                            "any.required": __("validation.required", { field: "model.question.leftColumn" })
                        }),
                    rightColumn: Joi.string()
                        .required()
                        .messages({
                            "string.base": __("validation.invalid", { field: "model.question.rightColumn" }),
                            "any.required": __("validation.required", { field: "model.question.rightColumn" })
                        })
                })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: "model.question.matchingAnswer" }),
                "array.includes": __("validation.invalid", { field: "model.question.matchingAnswerItem" }),
                "any.required": __("validation.required", { field: "model.question.matchingAnswer" })
            })
    });

    const fillInTheBlankSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.string()
                    .messages({
                        "string.base": __("validation.invalid", { field: "model.question.fillInTheBlankAnswer" })
                    })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: "model.question.fillInTheBlankAnswers" }),
                "any.required": __("validation.required", { field: "model.question.fillInTheBlankAnswers" })
            })
    });

    const questionSchema = Joi.alternatives().conditional(".questionType", {
        switch: [
            { is: questionType.multipleChoice, then: multipleChoiceSchema },
            { is: questionType.trueFalse, then: trueFalseSchema },
            { is: questionType.matching, then: matchingSchema },
            { is: questionType.fillInTheBlank, then: fillInTheBlankSchema }
        ],
        otherwise: baseQuestionSchema
    });

    try {
        const data = req.body
        await questionSchema.validateAsync(data);

        const existedQuestion = await BaseQuestion.findOne({ ask: data.ask });
        if (existedQuestion) {
            return res.status(404).json({
                success: false,
                message: __("validation.exist", { field: __("model.question.name") }),
                status: 404,
                data: null
            });
        }

        const existedTopic = await Topic.findById(data.topicId);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.topic.name") }),
                status: 404,
                data: null
            });
        }

        const existedCountry = await Country.findById(data.countryId);
        if (!existedCountry) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.country.name") }),
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
}

export const getQuestionValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;

    const getQuestionSchema = Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": __("validation.string", { field: "field.questionId" }),
            "string.hex": __("validation.hex", { field: "field.questionId" }),
            "string.length": __("validation.length", { field: "field.questionId", length: 24 }),
            "any.required": __("validation.required", { field: "field.questionId" })
        });

    try {
        await getQuestionSchema.validateAsync(id);

        const existedQuestion = await BaseQuestion.findById(id);
        if (!existedQuestion) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.question.name") }),
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
}

export const getQuestionsValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const getQuestionsSchema = Joi.object({
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
            .valid(questionStatus.active, questionStatus.inactive)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: "field.status" })
            }),
        countryName: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: "model.country.name" })
            }),
        topicName: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: "model.topic.name" })
            })
    });

    try {
        const data = req.query;
        await getQuestionsSchema.validateAsync(data);

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

export const updateQuestionValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;

    const baseQuestionSchema = Joi.object({
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
        questionType: Joi.number()
            .valid(
                questionType.trueFalse,
                questionType.multipleChoice,
                questionType.matching,
                questionType.fillInTheBlank
            )
            .required()
            .messages({
                "any.only": __("validation.invalid", { field: "model.question.questionType" }),
                "any.required": __("validation.required", { field: "model.question.questionType" })
            }),
        ask: Joi.string()
            .required()
            .messages({
                "any.required": __("validation.required", { field: "model.question.ask" })
            }),
        localeData: Joi.object().messages({
            "object.base": __("validation.invalid", { field: "field.localeData" })
        })
    });

    const trueFalseSchema = baseQuestionSchema.keys({
        answer: Joi.boolean()
            .required()
            .messages({
                "boolean.base": __("validation.invalid", { field: "model.question.trueFalseAnswer" }),
                "any.required": __("validation.required", { field: "model.question.trueFalseAnswer" })
            })
    });

    const multipleChoiceSchema = baseQuestionSchema.keys({
        options: Joi.array()
            .items(
                Joi.string().messages({
                    "string.base": __("validation.invalid", { field: "model.question.option" })
                })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: "model.question.options" }),
                "any.required": __("validation.required", { field: "model.question.options" })
            }),
        answer: Joi.number()
            .valid(
                answer.a,
                answer.b,
                answer.c,
                answer.d
            )
            .required()
            .messages({
                "any.only": __("validation.invalid", { field: "model.question.multipleChoiceAnswer" }),
                "any.required": __("validation.required", { field: "model.question.multipleChoiceAnswer" })
            })
    });

    const matchingSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.object({
                    leftColumn: Joi.string()
                        .required()
                        .messages({
                            "string.base": __("validation.invalid", { field: "model.question.leftColumn" }),
                            "any.required": __("validation.required", { field: "model.question.leftColumn" })
                        }),
                    rightColumn: Joi.string()
                        .required()
                        .messages({
                            "string.base": __("validation.invalid", { field: "model.question.rightColumn" }),
                            "any.required": __("validation.required", { field: "model.question.rightColumn" })
                        })
                })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: "model.question.matchingAnswer" }),
                "array.includes": __("validation.invalid", { field: "model.question.matchingAnswerItem" }),
                "any.required": __("validation.required", { field: "model.question.matchingAnswer" })
            })
    });

    const fillInTheBlankSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.string()
                    .messages({
                        "string.base": __("validation.invalid", { field: "model.question.fillInTheBlankAnswer" })
                    })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: "model.question.fillInTheBlankAnswers" }),
                "any.required": __("validation.required", { field: "model.question.fillInTheBlankAnswers" })
            })
    });

    const questionSchema = Joi.alternatives().conditional(".questionType", {
        switch: [
            { is: questionType.multipleChoice, then: multipleChoiceSchema },
            { is: questionType.trueFalse, then: trueFalseSchema },
            { is: questionType.matching, then: matchingSchema },
            { is: questionType.fillInTheBlank, then: fillInTheBlankSchema }
        ],
        otherwise: baseQuestionSchema
    });

    try {
        const data = req.body
        await questionSchema.validateAsync(data);

        const existedQuestion = await BaseQuestion.findById(id);
        if (!existedQuestion) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.question.name") }),
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
}

export const deleteQuestionValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;

    const deleteQuestionSchema = Joi.string()
        .hex()
        .length(24)
        .required()
        .messages({
            "string.base": __("validation.string", { field: "model.question.name" }),
            "string.hex": __("validation.hex", { field: "model.question.name" }),
            "string.length": __("validation.length", { field: "model.question.name", length: 24 }),
            "any.required": __("validation.required", { field: "model.question.name" })
        });

    try {
        await deleteQuestionSchema.validateAsync(id);

        const existedQuestion = await BaseQuestion.findById(id);
        if (!existedQuestion) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.question.name") }),
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
}