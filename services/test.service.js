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

    async getListTests(searchCondition, page, page_size, sortOrder) {
        const skip = (page - 1) * page_size;

        const tests = await Test.find(searchCondition)
            .sort({ createdAt: parseInt(sortOrder, 10) })
            .skip(skip)
            .limit(page_size);

        return tests;
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