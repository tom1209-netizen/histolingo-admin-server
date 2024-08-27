import Joi from "joi";
import Documentation from "../models/documentation.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { BaseQuestion } from "../models/question.model.js";
import Test from "../models/test.model.js";
import Topic from "../models/topic.model.js";
import Country from "../models/country.model.js";
import { testStatus } from "../constants/test.constant.js";
import { questionType } from "../constants/question.constant.js";


export const createTestValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, documentationsId, questionsId, topicId, countryId, localeData } = req.body;
        const schema = Joi.object({
            name: Joi.string()
                .max(250)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.name" }),
                    "string.max": __("validation.max", { field: "field.name", max: 250 }),
                    "any.required": __("validation.required", { field: "field.name" })
                }),
            documentationsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.documentationId" }),
                    "string.hex": __("validation.hex", { field: "field.documentationId" }),
                    "string.length": __("validation.length", { field: "field.documentationId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.documentationId" })
                }),
            questionsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.questionId" }),
                    "string.hex": __("validation.hex", { field: "field.questionId" }),
                    "string.length": __("validation.length", { field: "field.questionId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.questionId" })
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
            localeData: Joi.object().pattern(
                new RegExp("^[a-z]{2}-[A-Z]{2}$"),
                Joi.object({
                    name: Joi.string().max(250).messages({
                        "string.base": __("validation.string", { field: "field.name" }),
                        "string.max": __("validation.max", { field: "field.name", max: 250 }),
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
            return res.status(400).json({
                success: false,
                message: __("validation.notFound", { field: "model.topic.name" }),
                status: 400,
                data: null
            })
        };

        const country = await Country.findById({ _id: countryId });
        if (!country) {
            return res.status(400).json({
                success: false,
                message: __("validation.notFound", { field: "model.country.name" }),
                status: 400,
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
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.name" }),
                    "string.max": __("validation.max", { field: "field.name", max: 250 }),
                    "any.required": __("validation.required", { field: "field.name" })
                }),
            documentationsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.documentationId" }),
                    "string.hex": __("validation.hex", { field: "field.documentationId" }),
                    "string.length": __("validation.length", { field: "field.documentationId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.documentationId" })
                }),
            questionsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.questionId" }),
                    "string.hex": __("validation.hex", { field: "field.questionId" }),
                    "string.length": __("validation.length", { field: "field.questionId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.questionId" })
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
            status: Joi.number()
                .valid(testStatus.active, testStatus.inactive)
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
                message: __("validation.notFound", { field: "model.test.name" }),
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
                    message: __("validation.notFound", { field: "model.topic.name" }),
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
                    message: __("validation.notFound", { field: "model.country.name" }),
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
    const schema = Joi.object({
        search: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: "field.search" })
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
            .valid(testStatus.active, testStatus.inactive)
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

export const compareAnswersValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const answersData = req.body;

        const answerSchema = Joi.object({
            questionId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.questionId" }),
                    "string.hex": __("validation.hex", { field: "field.questionId" }),
                    "string.length": __("validation.length", { field: "field.questionId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.questionId" })
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
            playerAnswer: Joi.alternatives().conditional("questionType", {
                switch: [
                    {
                        is: questionType.trueFalse, then: Joi.boolean()
                            .messages({
                                "boolean.base": __("validation.invalid", { field: "model.question.trueFalseAnswer" }),
                                "any.required": __("validation.required", { field: "model.question.trueFalseAnswer" })
                            })
                    },
                    {
                        is: questionType.multipleChoice, then: Joi.number()
                            .messages({
                                "any.only": __("validation.invalid", { field: "model.question.multipleChoiceAnswer" }),
                                "any.required": __("validation.required", { field: "model.question.multipleChoiceAnswer" })
                            })
                    },
                    {
                        is: questionType.matching, then: Joi.array().items(Joi.object({
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
                        }))
                    },
                    {
                        is: questionType.fillInTheBlank, then: Joi.array()
                            .items(
                                Joi.string()
                                    .messages({
                                        "string.base": __("validation.invalid", { field: "model.question.fillInTheBlankAnswer" })
                                    })
                            )
                            .messages({
                                "array.base": __("validation.invalid", { field: "model.question.fillInTheBlankAnswers" }),
                                "any.required": __("validation.required", { field: "model.question.fillInTheBlankAnswers" })
                            })
                    }
                ],
                otherwise: Joi.any().forbidden()
            }).messages({
                "any.required": __("validation.required", { field: "field.playerAnswer" })
            })
        });

        const baseSubmitSchema = Joi.object({
            playerId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.playerId" }),
                    "string.hex": __("validation.hex", { field: "field.playerId" }),
                    "string.length": __("validation.length", { field: "field.playerId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.playerId" })
                }),
            testId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.testId" }),
                    "string.hex": __("validation.hex", { field: "field.testId" }),
                    "string.length": __("validation.length", { field: "field.testId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.testId" })
                }),
            answers: Joi.array()
                .items(answerSchema)
                .required()
                .messages({
                    "array.base": __("validation.invalid", { field: "field.answers" }),
                    "any.required": __("validation.required", { field: "field.answers" })
                })
        });

        await baseSubmitSchema.validateAsync(answersData);

        req.answers = answersData;

        next();
    } catch (error) {
        next(error);
    }
};

export const saveTestResultValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const resultData = req.body;

        const answerSchema = Joi.object({
            questionId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.questionId" }),
                    "string.hex": __("validation.hex", { field: "field.questionId" }),
                    "string.length": __("validation.length", { field: "field.questionId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.questionId" })
                }),
            playerAnswer: Joi.alternatives().conditional("questionType", {
                switch: [
                    {
                        is: questionType.trueFalse, then: Joi.boolean()
                            .messages({
                                "boolean.base": __("validation.invalid", { field: "model.question.trueFalseAnswer" }),
                                "any.required": __("validation.required", { field: "model.question.trueFalseAnswer" })
                            })
                    },
                    {
                        is: questionType.multipleChoice, then: Joi.number()
                            .messages({
                                "any.only": __("validation.invalid", { field: "model.question.multipleChoiceAnswer" }),
                                "any.required": __("validation.required", { field: "model.question.multipleChoiceAnswer" })
                            })
                    },
                    {
                        is: questionType.matching, then: Joi.array().items(Joi.object({
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
                        }))
                    },
                    {
                        is: questionType.fillInTheBlank, then: Joi.array()
                            .items(
                                Joi.string()
                                    .messages({
                                        "string.base": __("validation.invalid", { field: "model.question.fillInTheBlankAnswer" })
                                    })
                            )
                            .messages({
                                "array.base": __("validation.invalid", { field: "model.question.fillInTheBlankAnswers" }),
                                "any.required": __("validation.required", { field: "model.question.fillInTheBlankAnswers" })
                            })
                    }
                ],
                otherwise: Joi.any().forbidden()
            }).messages({
                "any.required": __("validation.required", { field: "field.playerAnswer" })
            }),
            isCorrect: Joi.boolean()
                .required()
                .messages({
                    "any.required": __("validation.required", { field: "field.isCorrect" })
                }),
        });

        const testResultSchema = Joi.object({
            playerId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.playerId" }),
                    "string.hex": __("validation.hex", { field: "field.playerId" }),
                    "string.length": __("validation.length", { field: "field.playerId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.playerId" })
                }),
            testId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: "field.testId" }),
                    "string.hex": __("validation.hex", { field: "field.testId" }),
                    "string.length": __("validation.length", { field: "field.testId", length: 24 }),
                    "any.required": __("validation.required", { field: "field.testId" })
                }),
            answers: Joi.array()
                .items(answerSchema)
                .required()
                .messages({
                    "array.base": __("validation.invalid", { field: "field.answers" }),
                    "any.required": __("validation.required", { field: "field.answers" })
                })
        });

        await testResultSchema.validateAsync(resultData);

        req.resultData = resultData;
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
                "string.base": __("validation.string", { field: "field.testResultId" }),
                "string.hex": __("validation.hex", { field: "field.testResultId" }),
                "string.length": __("validation.length", { field: "field.testResultId", length: 24 }),
                "any.required": __("validation.required", { field: "field.testResultId" })
            }),
        questionId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                "string.base": __("validation.string", { field: "field.questionId" }),
                "string.hex": __("validation.hex", { field: "field.questionId" }),
                "string.length": __("validation.length", { field: "field.questionId", length: 24 }),
                "any.required": __("validation.required", { field: "field.questionId" })
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
            .messages({
                "any.required": __("validation.required", { field: "field.playerAnswer" })
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