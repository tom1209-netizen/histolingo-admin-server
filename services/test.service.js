import Country from "../models/country.model.js";
import Test from "../models/test.model.js";
import Topic from "../models/topic.model.js";

class TestService {
    async createTest(name, createdBy, documentationsId, questionNumber, topicId, countryId, questions, localeData) {
        const newTest = await Test.create({
            name,
            createdBy,
            documentationsId,
            questionNumber,
            topicId,
            countryId,
            questions: questions.map(q => q._id),
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
                                questionNumber: 1,
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
        const test = await Test.findById({ _id: id });
        return test;
    }

    async getTopicsTest (searchCondition){
        const topics = await Topic.find(searchCondition, 'name _id')

        return topics;
    }

    async getCountriesTest (searchCondition){
        const countries = await Country.find(searchCondition, 'name _id')

        return countries;
    }
};

const testService = new TestService();
export default testService;