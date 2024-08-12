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
            .required(),
        countryId: Joi.string()
            .hex()
            .length(24)
            .required(),
        questionType: Joi.number()
            .valid(
                questionType.trueFalse,
                questionType.multipleChoice,
                questionType.matching,
                questionType.fillInTheBlank
            )
            .required(),
        ask: Joi.string()
            .required(),
        localeData: Joi.object()
    })

    const trueFalseSchema = baseQuestionSchema.keys({
        answer: Joi.boolean()
            .required()
    });

    const multipleChoiceSchema = baseQuestionSchema.keys({
        options: Joi.array()
            .items(
                Joi.string()
            )
            .required(),
        answer: Joi.number()
            .valid(
                answer.a,
                answer.b,
                answer.c,
                answer.d
            )
            .required()
    });

    const matchingSchema = baseQuestionSchema.keys({
        leftColumn: Joi.array()
            .items(
                Joi.string()
            )
            .required(),
        rightColumn: Joi.array()
            .items(
                Joi.string()
            )
            .required(),
        answer: Joi.array()
            .items(
                Joi.array()
                    .length(2)
            )
            .required()
    });

    const fillInTheBlankSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.string()
            )
            .required()
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
        if (existedQuestion) {
            return res.status(404).json({
                success: false,
                message: __('question.questionExists'),
                status: 404,
                data: null
            });
        }

        const existedTopic = await Topic.findById(data.topicId);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: __('topic.notFound'),
                status: 404,
                data: null
            });
        }

        const existedCountry = await Country.findById(data.countryId);
        if (!existedCountry) {
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
            .required();

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

export const updateQuestionValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;

    const baseQuestionSchema = Joi.object({
        topicId: Joi.string()
            .hex()
            .length(24),
        countryId: Joi.string()
            .hex()
            .length(24),
        questionType: Joi.number()
            .valid(
                questionType.trueFalse,
                questionType.multipleChoice,
                questionType.matching,
                questionType.fillInTheBlank
            )
            .required(),
        ask: Joi.string(),
        localeData: Joi.object()
    })

    const trueFalseSchema = baseQuestionSchema.keys({
        answer: Joi.boolean()
    });

    const multipleChoiceSchema = baseQuestionSchema.keys({
        options: Joi.array()
            .items(
                Joi.string()
            ),
        answer: Joi.number()
            .valid(
                answer.a,
                answer.b,
                answer.c,
                answer.d
            ),
    });

    const matchingSchema = baseQuestionSchema.keys({
        leftColumn: Joi.array()
            .items(
                Joi.string()
            ),
        rightColumn: Joi.array()
            .items(
                Joi.string()
            ),
        answer: Joi.array()
            .items(
                Joi.array()
                    .length(2)
            ),
    });

    const fillInTheBlankSchema = baseQuestionSchema.keys({
        answer: Joi.array()
            .items(
                Joi.string()
            )
            .required()
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