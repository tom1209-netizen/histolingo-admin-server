import { questionService } from "../services/question.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { isValidStatus } from "../utils/validation.utils.js";

export const createQuestionController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    const data = req.body

    try {
        const newQuestion = await questionService.createQuestion(data);

        return res.status(201).json({
            success: true,
            message: __("question.createQuestionSuccess"),
            status: 201,
            data: {
                newQuestion
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getQuestionsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    const { page = 1, page_size = 10, sortOrder = -1, status } = req.query;

    const maxPageSize = 100;
    const limitedPageSize = Math.min(page_size, maxPageSize);

    const filters = {};

    if (isValidStatus(status)) {
        filters.status = status;
    }

    try {
        const questions = await questionService.getQuestions(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("question.getQuestionsSuccess"),
            status: 200,
            data: {
                questions,
                totalQuestions: questions.length,
                totalPage: Math.ceil(questions.length / limitedPageSize),
                currentPage: page
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getQuestionController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    const { id } = req.params;

    try {
        const question = await questionService.getQuestion(id);

        return res.status(200).json({
            success: true,
            message: __("question.getQuestionSuccess"),
            status: 200,
            data: {
                question
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const updateQuestionController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    const { id } = req.params;
    const data = req.body;

    try {
        const updatedQuestion = await questionService.updateQuestion(id, data);

        return res.status(200).json({
            success: true,
            message: __("question.updateQuestionSuccess"),
            status: 200,
            data: {
                updatedQuestion
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const deleteQuestionController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    const { id } = req.params;

    try {
        const deletedQuestion = await questionService.deleteQuestion(id);

        return res.status(200).json({
            success: true,
            message: __("question.deleteQuestionSuccess"),
            status: 200,
            data: {
                deletedQuestion
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
}