import Country from "../models/country.model.js";
import { BaseQuestion } from "../models/question.model.js";
import Test from "../models/test.model.js";
import Topic from "../models/topic.model.js";

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

    async updateDocumentation(test, updateData) {
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

    async getTest(id){
        const test = await Test.findById({ _id: id })
        .populate([
            { path: 'createdBy', select: 'adminName' },
            { path: 'documentationsId', select: 'name' },
            { path: 'topicId', select: 'name' },
            { path: 'countryId', select: 'name' },  
            { path: 'questionsId', select: 'questionType ask localeData answer' },  
        ]);
        return test;
    }

    async getTopicsTest (filters){
        const topics = await Topic.find(filters, 'name _id')

        return topics;
    }

    async getCountriesTest (filters){
        const countries = await Country.find(filters, 'name _id')

        return countries;
    }

    async getQuestionsTest (filters){
        const questions = await BaseQuestion.find(filters, 'ask _id')

        return questions;
    }
};

const testService = new TestService();
export default testService;