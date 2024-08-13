import Joi from 'joi';
import Topic from "../models/topic.model.js";
import Country from "../models/country.model.js";
import { BaseQuestion } from "../models/question.model.js";
import { applyRequestContentLanguage } from '../utils/localization.util.js';
import { questionType, answer } from "../constants/question.constant.js";

export const createQuestionValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const baseQuestionSchema = Joi.object({
        topicId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                'string.hex': __('question.invalidTopicId'),
                'string.length': __('question.invalidTopicIdLength'),
                'any.required': __('question.topicIdRequired')
            }),
        countryId: Joi.string()
            .hex()
            .length(24)
            .required()
            .messages({
                'string.hex': __('question.invalidCountryId'),
                'string.length': __('question.invalidCountryIdLength'),
                'any.required': __('question.countryIdRequired')
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
                'any.only': __('question.invalidQuestionType'),
                'any.required': __('question.questionTypeRequired')
            }),
        ask: Joi.string()
            .required()
            .messages({
                'any.required': __('question.askRequired')
            }),
        localeData: Joi.object().messages({
            'object.base': __('question.invalidLocaleData')
        })
    });

    const trueFalseSchema = baseQuestionSchema.keys({
        answer: Joi.boolean()
            .required()
            .messages({
                'boolean.base': __('question.invalidTrueFalseAnswer'),
                'any.required': __('question.trueFalseAnswerRequired')
            })
    });

    const multipleChoiceSchema = baseQuestionSchema.keys({
        options: Joi.array()
            .items(
                Joi.string().messages({
                    'string.base': __('question.invalidOption')
                })
            )
            .required()
            .messages({
                'array.base': __('question.invalidOptionsArray'),
                'any.required': __('question.optionsRequired')
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
                'any.only': __('question.invalidMultipleChoiceAnswer'),
                'any.required': __('question.multipleChoiceAnswerRequired')
            })
    });

    const matchingSchema = baseQuestionSchema.keys({
        leftColumn: Joi.array()
            .items(
                Joi.string().messages({
                    'string.base': __('question.invalidLeftColumnItem')
                })
            )
            .required()
            .messages({
                'array.base': __('question.invalidLeftColumnArray'),
                'any.required': __('question.leftColumnRequired')
            }),
        rightColumn: Joi.array()
            .items(
                Joi.string().messages({
                    'string.base': __('question.invalidRightColumnItem')
                })
            )
            .required()
            .messages({
                'array.base': __('question.invalidRightColumnArray'),
                'any.required': __('question.rightColumnRequired')
            }),
        answer: Joi.array()
            .items(
                Joi.array()
                    .length(2)
                    .messages({
                        'array.length': __('question.invalidMatchingAnswerPair')
                    })
            )
            .required()
            .messages({
                'array.base': __('question.invalidMatchingAnswerArray'),
                'any.required': __('question.matchingAnswerRequired')
            })
    });

    const fillInTheBlankSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.string()
                    .messages({
                    'string.base': __('question.invalidFillInTheBlankAnswer')
                })
            )
            .required()
            .messages({
                'array.base': __('question.invalidFillInTheBlankAnswerArray'),
                'any.required': __('question.fillInTheBlankAnswerRequired')
            })
    });

    const questionSchema = Joi.alternatives().conditional('.questionType', {
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
        console.log(existedQuestion)
        if (existedQuestion) {
            console.log("question exists")
            return res.status(404).json({
                success: false,
                message: __('question.questionExists'),
                status: 404,
                data: null
            });
        }

        const existedTopic = await Topic.findById(data.topicId);
        if (!existedTopic) {
            console.log("topic not found")
            return res.status(404).json({
                success: false,
                message: __('topic.notFound'),
                status: 404,
                data: null
            });
        }

        const existedCountry = await Country.findById(data.countryId);
        if (!existedCountry) {
            console.log("country not found")
            return res.status(404).json({
                success: false,
                message: __('country.notFound'),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
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
            'string.hex': __('question.invalidId'),
            'string.length': __('question.invalidIdLength'),
            'any.required': __('question.idRequired')
        });

    try {
        await getQuestionSchema.validateAsync(id);

        const existedQuestion = await BaseQuestion.findById(id);
        if (!existedQuestion) {
            return res.status(404).json({
                success: false,
                message: __('question.notFound'),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
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
                'number.base': __('question.invalidPage'),
                'number.min': __('question.pageMin')
            }),
        page_size: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                'number.base': __('question.invalidPageSize'),
                'number.min': __('question.pageSizeMin')
            }),
        search: Joi.string()
            .optional()
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
        const data = req.query;
        await getQuestionsSchema.validateAsync(data);

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
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
                'string.hex': __('question.invalidTopicId'),
                'string.length': __('question.invalidTopicIdLength'),
            }),
        countryId: Joi.string()
            .hex()
            .length(24)
            .messages({
                'string.hex': __('question.invalidCountryId'),
                'string.length': __('question.invalidCountryIdLength'),
            }),
        questionType: Joi.number()
            .valid(
                questionType.trueFalse,
                questionType.multipleChoice,
                questionType.matching,
                questionType.fillInTheBlank
            )
            .messages({
                'any.only': __('question.invalidQuestionType'),
            }),
        ask: Joi.string()
        localeData: Joi.object().messages({
            'object.base': __('question.invalidLocaleData')
        })
    });

    const trueFalseSchema = baseQuestionSchema.keys({
        answer: Joi.boolean()
            .messages({
                'boolean.base': __('question.invalidTrueFalseAnswer'),
            })
    });

    const multipleChoiceSchema = baseQuestionSchema.keys({
        options: Joi.array()
            .items(
                Joi.string().messages({
                    'string.base': __('question.invalidOption')
                })
            )
            .messages({
                'array.base': __('question.invalidOptionsArray'),
            }),
        answer: Joi.number()
            .valid(
                answer.a,
                answer.b,
                answer.c,
                answer.d
            )
            .messages({
                'any.only': __('question.invalidMultipleChoiceAnswer'),
            })
    });

    const matchingSchema = baseQuestionSchema.keys({
        leftColumn: Joi.array()
            .items(
                Joi.string().messages({
                    'string.base': __('question.invalidLeftColumnItem')
                })
            )
            .messages({
                'array.base': __('question.invalidLeftColumnArray'),
            }),
        rightColumn: Joi.array()
            .items(
                Joi.string().messages({
                    'string.base': __('question.invalidRightColumnItem')
                })
            )
            .messages({
                'array.base': __('question.invalidRightColumnArray'),
            }),
        answer: Joi.array()
            .items(
                Joi.array()
                    .length(2)
                    .messages({
                        'array.length': __('question.invalidMatchingAnswerPair')
                    })
            )
            .messages({
                'array.base': __('question.invalidMatchingAnswerArray'),
            })
    });

    const fillInTheBlankSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.string()
                    .messages({
                    'string.base': __('question.invalidFillInTheBlankAnswer')
                })
            )
            .messages({
                'array.base': __('question.invalidFillInTheBlankAnswerArray'),
            })
    });

    const questionSchema = Joi.alternatives().conditional('.questionType', {
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
                message: __('question.notFound'),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
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
            'string.hex': __('question.invalidId'),
            'string.length': __('question.invalidIdLength'),
            'any.required': __('question.idRequired')
        });

    try {
        await deleteQuestionSchema.validateAsync(id);

        const existedQuestion = await BaseQuestion.findById(id);
        if (!existedQuestion) {
            return res.status(404).json({
                success: false,
                message: __('question.notFound'),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __('error.internalServerError'),
            status: error.status || 500,
            data: error.data || null
        });
    }
}