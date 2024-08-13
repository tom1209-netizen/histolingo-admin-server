import Joi from 'joi';
import Documentation from '../models/documentation.model.js';
import { applyRequestContentLanguage } from '../utils/localization.util.js';
import { BaseQuestion } from '../models/question.model.js';
import mongoose from 'mongoose';
import Test from '../models/test.model.js';
import { testStatus } from '../constants/test.constant.js';

export const createTestValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, documentationsId, questionNumber, topicId, countryId, localeData } = req.body;
        const schema = Joi.object({
            name: Joi.string()
                .max(250)
                .required(),
            documentationsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required(),
            questionNumber: Joi.number()
                .min(1)
                .max(100)
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
            questionNumber,
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
        }

        // Fetch random questions
        const questions = await BaseQuestion.aggregate([
            {
                $match: {
                    topicId: new mongoose.Types.ObjectId(topicId),
                    countryId: new mongoose.Types.ObjectId(countryId)
                }
            },
            { $sample: { size: questionNumber } }
        ]);

        // Check if enough questions are found
        if (questions.length !== questionNumber) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.question.name") }),
                status: 404,
                data: null
            });
        }

        // Attach questions to request object
        req.questions = questions;
        next();
    } catch (error) {
        next(error);
    }

};

export const updateTestValidator = async (req, res, next) =>{
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, documentationsId, questionNumber, topicId, countryId, localeData } = req.body;
        const schema = Joi.object({
            name: Joi.string()
                .max(250)
                .required(),
            documentationsId: Joi.array()
                .items(Joi.string().hex().length(24))
                .required(),
            questionNumber: Joi.number()
                .min(1)
                .max(100)
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
            questionNumber,
            topicId,
            countryId,
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

        req.test = test;
        next();
    } catch (error) {
        next(error);
    }
};

export const getTopicsValidator = async (req, res, next) => {
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

export const getCountriesValidator = async (req, res, next) => {
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

export const getListTestValidator = async (req, res, next) => {
    const schema = Joi.object({
        search: Joi.string().allow(''),
        page: Joi.number().integer().min(1).default(1),
        page_size: Joi.number().integer().min(1).default(10),
        status: Joi.number()
            .allow(null, "")
            .valid(testStatus.active, testStatus.inactive),
    });

    try {
        const value = await schema.validateAsync(req.query);
        req.query = value;
        next();
    } catch (error) {
        next(error);
    }
};