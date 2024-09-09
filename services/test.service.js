import { questionType } from "../constants/question.constant.js";
import Country from "../models/country.model.js";
import Documentation from "../models/documentation.model.js";
import { BaseQuestion } from "../models/question.model.js";
import Test from "../models/test.model.js";
import TestResult from "../models/testResult.model.js";
import Topic from "../models/topic.model.js";
import _ from "lodash";

class TestService {
    async createTest(name, createdBy, documentationsId, topicId, countryId, questions, localeData) {
        const newTest = await Test.create({
            name,
            createdBy,
            documentationsId,
            topicId,
            countryId,
            questionsId: questions.map(q => q._id),
            localeData
        });
        return newTest;
    }

    async updateTest(test, updateData) {
        try {
            const updatedTest = Test.findOneAndUpdate(test, updateData, { new: true });
            return updatedTest;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    async getTests(filters, page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;

        const results = await Test.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: "topics",
                    localField: "topicId",
                    foreignField: "_id",
                    as: "topicDetails"
                }
            },
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "countryDetails"
                }
            },
            {
                $lookup: {
                    from: "admins",
                    localField: "createdBy",
                    foreignField: "_id",
                    as: "adminDetails"
                }
            },
            { $unwind: "$topicDetails" },
            { $unwind: "$countryDetails" },
            { $unwind: "$adminDetails" },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                name: 1,
                                questionsId: 1,
                                status: 1,
                                localeData: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                createdBy: {
                                    _id: "$adminDetails._id",
                                    name: "$adminDetails.adminName"
                                },
                                topic: {
                                    _id: "$topicDetails._id",
                                    name: "$topicDetails.name"
                                },
                                country: {
                                    _id: "$countryDetails._id",
                                    name: "$countryDetails.name"
                                },
                            }
                        }
                    ]
                }
            }
        ]);

        const totalTestsCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const tests = results[0].documents;

        return { tests, totalTestsCount };
    }

    async getTest(id) {
        const test = await Test.findById({ _id: id })
            .populate([
                { path: "createdBy", select: "adminName" },
                { path: "documentationsId", select: "name" },
                { path: "topicId", select: "name" },
                { path: "countryId", select: "name" },
                { path: "questionsId", select: "questionType ask localeData options leftColumn rightColumn answer" },
            ]);
        return test;
    }

    async getTopicsTest(filters) {
        const topics = await Topic.find(filters, "name _id")

        return topics;
    }

    async getCountriesTest(filters) {
        const countries = await Country.find(filters, "name _id")

        return countries;
    }

    async getDocumentationsTest(filters) {
        const documentations = await Documentation.find(filters, "name _id")

        return documentations;
    }

    async getQuestionsTest(filters) {
        const questions = await BaseQuestion.find(filters, "ask _id")

        return questions;
    }

    async getQuestionTest(id) {
        const questions = await BaseQuestion.findById({ _id: id });
        return questions;
    }

    async saveResults(playerId, testId, score, answers) {
        const newTestResult = await TestResult.create({
            playerId,
            testId,
            score,
            answers
        });
        return newTestResult;
    }

    async checkAnswer(testResult, answer, playerAnswer, question) {
        let isCorrect = false;
        if (question.questionType === questionType.trueFalse || question.questionType === questionType.multipleChoice) {
            isCorrect = playerAnswer === Number(question.answer);
        } else if (question.questionType === questionType.matching) {
            const sortedPlayerAnswer = _.sortBy(playerAnswer, ["leftColumn", "rightColumn"]);
            const sortedCorrectAnswer = _.sortBy(question.answer, ["leftColumn", "rightColumn"]);
            isCorrect = _.isEqual(sortedPlayerAnswer, sortedCorrectAnswer);
        } else if (question.questionType === questionType.fillInTheBlank) {
            const sortedPlayerAnswer = _.sortBy(playerAnswer);
            const sortedCorrectAnswer = _.sortBy(question.answer);
            isCorrect = _.isEqual(sortedPlayerAnswer, sortedCorrectAnswer);
        }

        testResult.score = testResult.answers.filter(ans => ans.isCorrect).length;
        answer.playerAnswer = playerAnswer;
        answer.isCorrect = isCorrect;

        // await testResult.save();
        return isCorrect;
    }
};

const testService = new TestService();
export default testService;