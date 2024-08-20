import Joi from 'joi';
import Documentation from '../models/documentation.model.js';
import { applyRequestContentLanguage } from '../utils/localization.util.js';
import { BaseQuestion } from '../models/question.model.js';
import Test from '../models/test.model.js';
import Topic from '../models/topic.model.js';
import Country from '../models/country.model.js';
import { testStatus } from '../constants/test.constant.js';
import { questionType } from '../constants/question.constant.js';


export const createTestValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, documentationsId, questionsId, topicId, countryId, localeData } = req.body;
        const schema = Joi.object({
            name: Joi.string()
                .max(250)
                .required(),
            documentationsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required(),
            questionsId: Joi.array()
                .items(Joi.string().hex().length(24))
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
                    name: Joi.string().max(250).required()
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
                message: __("validation.notFound", { field: __("model.documentation.name") }),
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
                .max(250),
            documentationsId: Joi.array()
                .items(Joi.string().hex().length(24)),
            questionsId: Joi.array()
                .items(Joi.string().hex().length(24)),
            topicId: Joi.string()
                .hex()
                .length(24),
            countryId: Joi.string()
                .hex()
                .length(24),
            status: Joi.number()
                .valid(testStatus.active, testStatus.inactive),
            localeData: Joi.object().pattern(/^[a-z]{2}-[A-Z]{2}$/,
                Joi.object({
                    name: Joi.string().max(250).required()
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
                    message: __("validation.notFound", { field: __("model.documentation.name") }),
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
        search: Joi.string().allow('')
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
                    'string.hex': __('submit.invalidQuestionId'),
                    'string.length': __('submit.invalidQuestionIdLength'),
                    'any.required': __('submit.questionIdRequired')
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
                    'any.only': __('submit.invalidQuestionType'),
                    'any.required': __('submit.questionTypeRequired')
                }),
            playerAnswer: Joi.alternatives().conditional('questionType', {
                switch: [
                    { is: questionType.trueFalse, then: Joi.boolean() },
                    { is: questionType.multipleChoice, then: Joi.number() },
                    {
                        is: questionType.matching, then: Joi.array().items(Joi.object({
                            leftColumn: Joi.string()
                                .required()
                                .messages({
                                    'string.base': __('question.invalidLeftColumn'),
                                    'any.required': __('question.leftColumnRequired')
                                }),
                            rightColumn: Joi.string()
                                .required()
                                .messages({
                                    'string.base': __('question.invalidRightColumn'),
                                    'any.required': __('question.rightColumnRequired')
                                })
                        }))
                    },
                    { is: questionType.fillInTheBlank, then: Joi.array().items(Joi.string()) }
                ],
                otherwise: Joi.any().forbidden()
            }).messages({
                'any.forbidden': __('submit.invalidPlayerAnswer'),
                'any.required': __('submit.playerAnswerRequired')
            })
        });

        const baseSubmitSchema = Joi.object({
            playerId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    'string.hex': __('submit.invalidPlayerId'),
                    'string.length': __('submit.invalidPlayerIdLength'),
                    'any.required': __('submit.playerIdRequired')
                }),
            testId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    'string.hex': __('submit.invalidTestId'),
                    'string.length': __('submit.invalidTestIdLength'),
                    'any.required': __('submit.testIdRequired')
                }),
            answers: Joi.array()
                .items(answerSchema)
                .required()
                .messages({
                    'array.base': __('submit.invalidAnswersArray'),
                    'any.required': __('submit.answersRequired')
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
                    'string.hex': __('submit.invalidQuestionId'),
                    'string.length': __('submit.invalidQuestionIdLength'),
                    'any.required': __('submit.questionIdRequired')
                }),
            playerAnswer: Joi.any().required().messages({
                'any.required': __('submit.playerAnswerRequired')
            }),
            isCorrect: Joi.boolean()
                .required()
                .messages({
                    'any.required': __('submit.isCorrectRequired')
                }),
        });

        const testResultSchema = Joi.object({
            playerId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    'string.hex': __('submit.invalidPlayerId'),
                    'string.length': __('submit.invalidPlayerIdLength'),
                    'any.required': __('submit.playerIdRequired')
                }),
            testId: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    'string.hex': __('submit.invalidTestId'),
                    'string.length': __('submit.invalidTestIdLength'),
                    'any.required': __('submit.testIdRequired')
                }),
            score: Joi.number()
                .integer()
                .min(0)
                .required()
                .messages({
                    'number.base': __('submit.invalidScore'),
                    'number.min': __('submit.invalidScoreMin'),
                    'any.required': __('submit.scoreRequired')
                }),
            answers: Joi.array()
                .items(answerSchema)
                .required()
                .messages({
                    'array.base': __('submit.invalidAnswersArray'),
                    'any.required': __('submit.answersRequired')
                })
        });

        await testResultSchema.validateAsync(resultData);

        req.resultData = resultData;
        next();
    } catch (error) {
        next(error);
    }
};