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
        questionType: Joi.number()
            .valid(
                questionType.trueFalse,
                questionType.multipleChoice,
                questionType.matching,
                questionType.fillInTheBlank
            )
            .required()
            .messages({
                "any.only": __("validation.invalid", { field: __("model.question.questionType") }),
                "any.required": __("validation.required", { field: __("model.question.questionType") })
            }),
        ask: Joi.string()
            .required()
            .messages({
                "any.required": __("validation.required", { field: __("model.question.ask") })
            }),
        localeData: Joi.object().messages({
            "object.base": __("validation.invalid", { field: __("field.localeData") })
        })
    });

    const trueFalseSchema = baseQuestionSchema.keys({
        answer: Joi.boolean()
            .required()
            .messages({
                "boolean.base": __("validation.invalid", { field: __("model.question.trueFalseAnswer") }),
                "any.required": __("validation.required", { field: __("model.question.trueFalseAnswer") })
            })
    });

    const multipleChoiceSchema = baseQuestionSchema.keys({
        options: Joi.array()
            .items(
                Joi.string().messages({
                    "string.base": __("validation.invalid", { field: __("model.question.option") })
                })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: __("model.question.options") }),
                "any.required": __("validation.required", { field: __("model.question.options") })
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
                "any.only": __("validation.invalid", { field: __("model.question.multipleChoiceAnswer") }),
                "any.required": __("validation.required", { field: __("model.question.multipleChoiceAnswer") })
            })
    });

    const matchingSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.object({
                    leftColumn: Joi.string()
                        .required()
                        .messages({
                            "string.base": __("validation.invalid", { field: __("model.question.leftColumn") }),
                            "any.required": __("validation.required", { field: __("model.question.leftColumn") })
                        }),
                    rightColumn: Joi.string()
                        .required()
                        .messages({
                            "string.base": __("validation.invalid", { field: __("model.question.rightColumn") }),
                            "any.required": __("validation.required", { field: __("model.question.rightColumn") })
                        })
                })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: __("model.question.matchingAnswer") }),
                "array.includes": __("validation.invalid", { field: __("model.question.matchingAnswerItem") }),
                "any.required": __("validation.required", { field: __("model.question.matchingAnswer") })
            })
    });

    const fillInTheBlankSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.string()
                    .messages({
                        "string.base": __("validation.invalid", { field: __("model.question.fillInTheBlankAnswer") })
                    })
            )
            .required()
            .messages({
                "array.base": __("validation.invalid", { field: __("model.question.fillInTheBlankAnswers") }),
                "any.required": __("validation.required", { field: __("model.question.fillInTheBlankAnswers") })
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
            "string.base": __("validation.string", { field: __("field.questionId") }),
            "string.hex": __("validation.hex", { field: __("field.questionId") }),
            "string.length": __("validation.length", { field: __("field.questionId"), length: 24 }),
            "any.required": __("validation.required", { field: __("field.questionId") })
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
            .valid(questionStatus.active, questionStatus.inactive, "")
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.status") })
            }),
        countryName: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: __("model.country.name") })
            }),
        topicName: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: __("model.topic.name") })
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
        questionType: Joi.number()
            .valid(
                questionType.trueFalse,
                questionType.multipleChoice,
                questionType.matching,
                questionType.fillInTheBlank
            )
            .messages({
                "any.only": __("validation.invalid", { field: __("model.question.questionType") }),
            }),
        ask: Joi.string()
            .messages({
            }),
        localeData: Joi.object().messages({
            "object.base": __("validation.invalid", { field: __("field.localeData") })
        })
    });

    const trueFalseSchema = baseQuestionSchema.keys({
        answer: Joi.boolean()
            .messages({
                "boolean.base": __("validation.invalid", { field: __("model.question.trueFalseAnswer") }),
            })
    });

    const multipleChoiceSchema = baseQuestionSchema.keys({
        options: Joi.array()
            .items(
                Joi.string().messages({
                    "string.base": __("validation.invalid", { field: __("model.question.option") })
                })
            )
            .messages({
                "array.base": __("validation.invalid", { field: __("model.question.options") }),
            }),
        answer: Joi.number()
            .valid(
                answer.a,
                answer.b,
                answer.c,
                answer.d
            )
            .messages({
                "any.only": __("validation.invalid", { field: __("model.question.multipleChoiceAnswer") }),
            })
    });

    const matchingSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.object({
                    leftColumn: Joi.string()
                        .messages({
                            "string.base": __("validation.invalid", { field: __("model.question.leftColumn") }),
                        }),
                    rightColumn: Joi.string()
                        .messages({
                            "string.base": __("validation.invalid", { field: __("model.question.rightColumn") }),
                        })
                })
            )
            .messages({
                "array.base": __("validation.invalid", { field: __("model.question.matchingAnswer") }),
                "array.includes": __("validation.invalid", { field: __("model.question.matchingAnswerItem") }),
            })
    });

    const fillInTheBlankSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.string()
                    .messages({
                        "string.base": __("validation.invalid", { field: __("model.question.fillInTheBlankAnswer") })
                    })
            )
            .messages({
                "array.base": __("validation.invalid", { field: __("model.question.fillInTheBlankAnswers") }),
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
            "string.base": __("validation.string", { field: __("model.question.name") }),
            "string.hex": __("validation.hex", { field: __("model.question.name") }),
            "string.length": __("validation.length", { field: __("model.question.name"), length: 24 }),
            "any.required": __("validation.required", { field: __("model.question.name") })
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