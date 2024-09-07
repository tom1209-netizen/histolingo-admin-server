import {
    BaseQuestion,
    MultipleChoiceQuestion,
    TrueFalseQuestion,
    MatchingQuestion,
    FillInTheBlankQuestion
} from "../models/question.model.js";

class QuestionService {
    async createQuestion(data) {
        const newQuestion = await BaseQuestion.create(data);
        return newQuestion;
    }

    async getQuestions(filters, page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;

        const results = await BaseQuestion.aggregate([
            {
                $lookup: {
                    from: "topics",
                    localField: "topicId",
                    foreignField: "_id",
                    as: "topic",
                    pipeline: [
                        { $project: { name: 1 } }
                    ]
                }
            },
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country",
                    pipeline: [
                        { $project: { name: 1 } }
                    ]
                }
            },
            {
                $addFields: {
                    topic: { $arrayElemAt: ["$topic", 0] },
                    country: { $arrayElemAt: ["$country", 0] }
                }
            },
            { $match: filters },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize },
                    ]
                }
            },
        ]);

        const totalQuestionsCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const questions = results[0].documents;

        return { questions, totalQuestionsCount };
    }

    async getQuestion(id) {
        const question = await BaseQuestion.findById(id)
            .populate("topicId")
            .populate("countryId");
        return question;
    }

    async updateQuestion(id, updateData) {
        let updatedQuestion;

        switch (updateData.questionType) {
            case 0: // Multiple Choice Question
                updatedQuestion = await MultipleChoiceQuestion.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true }
                );
                break;
            case 1: // True/False Question
                updatedQuestion = await TrueFalseQuestion.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true }
                );
                break;
            case 2: // Matching Question
                updatedQuestion = await MatchingQuestion.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true }
                );
                break;
            case 3: // Fill-in-the-Blank Question
                updatedQuestion = await FillInTheBlankQuestion.findByIdAndUpdate(
                    id,
                    updateData,
                    { new: true }
                );
                break;
            default:
                throw new Error('Invalid question type');
        }

        // Populate common fields for all types
        updatedQuestion = await BaseQuestion.findById(updatedQuestion._id)
            .populate('topicId')
            .populate('countryId');

        return updatedQuestion;
    }

    async deleteQuestion(id) {
        const deletedQuestion = await BaseQuestion.findByIdAndUpdate(id, { status: 0 })
            .populate("topicId")
            .populate("countryId");
        return deletedQuestion;
    }
}

export const questionService = new QuestionService();