import { countryStatus } from "../constants/country.constant.js";
import { topicStatus } from "../constants/topic.constant.js";
import { BaseQuestion } from "../models/question.model.js";
import TestResult from "../models/testResult.model.js";
import testService from "../services/test.service.js";
import { shuffle } from "../utils/array.utils.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { isValidStatus } from "../utils/validation.utils.js";

export const getCountriesController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { search = "" } = req.query;
        const filters = search
            ? {
                name: { $regex: search, $options: "i" },
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
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getTopicsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { search = "" } = req.query;
        const filters = search
            ? {
                name: { $regex: search, $options: "i" },
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
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getDocumentationsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { search = "", topicId, countryId } = req.query;
        const filters = search
            ? {
                name: { $regex: search, $options: "i" },
                status: countryStatus.active
            }
            : { status: countryStatus.active };

        if (topicId) {
            filters.topicId = topicId;
        }
        if (countryId) {
            filters.countryId = countryId;
        }
        const documentations = await testService.getDocumentationsTest(filters);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.documentation.displayListName") }),
            data: documentations
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getQuestionsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { search = "", topicId, countryId } = req.query;
        const filters = search
            ? {
                ask: { $regex: search, $options: "i" },
                status: countryStatus.active
            }
            : { status: countryStatus.active };

        if (topicId) {
            filters.topicId = topicId;
        }
        if (countryId) {
            filters.countryId = countryId;
        }
        const questions = await testService.getQuestionsTest(filters);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.question.name") }),
            data: questions
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getQuestionController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const id = req.params.id;
        const questions = await testService.getQuestions(id);

        if (!questions) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.question.name") }),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: __("message.getSuccess", { field: __("model.question.name") }),
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
            message: error.message || __("error.internalServerError"),
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
            message: error.message || __("error.internalServerError"),
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

        const updatedTest = await testService.updateTest(test, updateData);

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
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getTestsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { page = 1, pageSize = 10, search = "", status, sortOrder = -1 } = req.query;

        const maxPageSize = 100;
        const limitedPageSize = Math.min(pageSize, maxPageSize);

        const filters = search
            ? {
                $or: [
                    { name: { $regex: search, $options: "i" } },
                    { countryName: { $regex: search, $options: "i" } },
                    { topicName: { $regex: search, $options: "i" } },
                ]
            }
            : {};
        if (isValidStatus(status)) {
            filters.status = Number(status);
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
            message: error.message || __("error.internalServerError"),
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
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const startDemoController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const test = req.test;
        const questions = await BaseQuestion.find({
            _id: {
                $in: test.questionsId
            }
        }).lean();

        for (const question of questions) {
            if (question.questionType === 0 || question.questionType === 1 || question.questionType === 3) {
                delete question.answer;
            } else {
                const leftColumns = question.answer.map((pair) => pair.leftColumn);
                const rightColumns = question.answer.map((pair) => pair.rightColumn);

                shuffle(rightColumns);

                const newAnswer = [];
                for (let index = 0; index < leftColumns.length; index++) {
                    newAnswer.push({
                        leftColumn: leftColumns[index],
                        rightColumn: rightColumns[index]
                    });
                }
                question.answer = newAnswer;
            }
        }

        const newResult = await TestResult.create({
            playerId: req.admin._id,
            testId: test._id,
            answers: questions.map((question) => {
                return { question, playerAnswer: null, isCorrect: false }
            })
        });

        return res.status(201).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.test.name") }),
            data: { questions, test, testResultId: newResult._id }
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


export const checkAnswerController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { testResultId, questionId, playerAnswer } = req.body;

        const testResult = await TestResult.findById(testResultId);
        if (!testResult) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.testResult.name") }),
                status: 404,
                data: null,
            });
        }

        const answer = testResult.answers.find(ans => ans.question._id.toString() === questionId);

        if (!answer) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.question.name") }),
                status: 404,
                data: null,
            });
        }

        if (answer.playerAnswer !== null) {
            return res.status(400).json({
                success: false,
                message: __("validation.alreadyAnswered", { field: __("model.question.name") }),
                status: 400,
                data: null,
            });
        }

        const question = await BaseQuestion.findById(questionId).lean();
        if (!question) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.question.name") }),
                status: 404,
                data: null,
            });
        }

        const isCorrect = await testService.checkAnswer(testResult, answer, playerAnswer, question);



        return res.status(200).json({
            success: true,
            message: __("message.checkSuccess", { field: __("model.question.name") }),
            data: { isCorrect }
        });

    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};