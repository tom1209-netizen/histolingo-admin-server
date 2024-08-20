import { countryStatus } from '../constants/country.constant.js';
import { questionStatus } from '../constants/question.constant.js';
import { topicStatus } from '../constants/topic.constant.js';
import testService from '../services/test.service.js';
import { applyRequestContentLanguage } from '../utils/localization.util.js';

export const getCountriesController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { search = '' } = req.query;
        const filters = search
            ? {
                name: { $regex: search, $options: 'i' },
                status: countryStatus.active
            }
            : { status: countryStatus.active };

        const countries = await testService.getCountriesTest(filters);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.country.name") }),
            data: countries
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getTopicsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { search = '' } = req.query;
        const filters = search
            ? {
                name: { $regex: search, $options: 'i' },
                status: topicStatus.active
            }
            : { status: topicStatus.active };


        const topics = await testService.getTopicsTest(filters);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.topic.name") }),
            data: topics
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getQuestionsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const id = req.params.id;
        const questions = await testService.getQuestions(id);

        if (!questions) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.questions.displayName") }),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: __("message.getSuccess", { field: __("model.questions.displayName") }),
                status: 200,
                data: {
                    questions: {
                        id: questions._id,
                        source: questions.source,
                        name: questions.name,
                        topicId: questions.topicId,
                        countryId: questions.countryId,
                        content: questions.content,
                        status: questions.status,
                        localeData: questions.localeData,
                        createdAt: questions.createdAt,
                        updatedAt: questions.updatedAt
                    }
                }
            });
        }
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const createTestController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, documentationsId, topicId, countryId, localeData } = req.body;
        const createdBy = req.admin._id;
        const questions = req.questions;

        const newTest = await testService.createTest(name, createdBy, documentationsId, topicId, countryId, questions, localeData);


        return res.status(201).json({
            success: true,
            message: __("message.createdSuccess", { field: __("model.test.name") }),
            status: 201,
            data: {
                test: {
                    id: newTest._id,
                    name: newTest.name,
                    createdBy: newTest.createdBy,
                    documentationsId: newTest.documentationsId,
                    questionsId: newTest.questionsId,
                    topicId: newTest.topicId,
                    countryId: newTest.countryId,
                    localeData: newTest.localeData
                },
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const updateTestController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const test = req.test;
        const updateData = req.body;

        const updatedTest = await testService.updateDocumentation(test, updateData);

        return res.status(200).json({
            success: true,
            message: __("message.updatedSuccess", { field: __("model.test.name") }),
            status: 200,
            data: {
                updatedTest: {
                    id: updatedTest._id,
                    name: updatedTest.name,
                    createdBy: updatedTest.createdBy,
                    documentationsId: updatedTest.documentationsId,
                    questionsId: updatedTest.questionsId,
                    topicId: updatedTest.topicId,
                    countryId: updatedTest.countryId,
                    status: updatedTest.status,
                    localeData: updatedTest.localeData
                }
            }
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getTestsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { page = 1, pageSize = 10, search = '', status, sortOrder = -1 } = req.query;

        const maxPageSize = 100;
        const limitedPageSize = Math.min(pageSize, maxPageSize);

        const filters = search
            ? {
                $or: [
                    { name: { $regex: search, $options: 'i' } },
                    { countryName: { $regex: search, $options: 'i' } },
                    { topicName: { $regex: search, $options: 'i' } },
                ]
            }
            : {};
        if (status !== null && status !== undefined && status !== "") {
            filters.status = status;
        }

        const { tests, totalTestsCount } = await testService.getTests(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.test.name") }),
            data: {
                tests,
                totalPages: Math.ceil(totalTestsCount / limitedPageSize),
                totalCount: totalTestsCount,
                currentPage: Number(page)
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getTestController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { id } = req.params;
        const test = await testService.getTest(id);

        if (!test) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.test.name") }),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: __("message.getSuccess", { field: __("model.test.name") }),
                status: 200,
                data: {
                    test
                }
            });
        }
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const compareAnswersController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const playerData = req.body;
        const { answers } = req.body;
        const { score, results } = await testService.compareAnswers(answers);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.result.name") }),
            data: {
                results: {
                    playerId: playerData.playerId,
                    testId: playerData.testId,
                    score,
                    answers: results,
                }
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const saveTestResultController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { playerId, testId, score, answers } = req.resultData;

        // Tạo đối tượng kết quả kiểm tra mới
        const newTestResult = await testService.saveResults(playerId, testId, score, answers);

        console.log(newTestResult)

        return res.status(201).json({
            success: true,
            message: __("message.saveSuccess", { field: __("model.testResult.name") }),
            data: newTestResult,
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};