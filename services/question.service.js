import { BaseQuestion } from "../models/question.model.js";

class QuestionService {
    async createQuestion(data) {
        const newQuestion = await BaseQuestion.create(data)
            .populate("topicId")
            .populate("countryId");
        return newQuestion;
    }

    async getQuestions(filters, page, page_size, sortOrder) {
        const skip = (page - 1) * page_size;

        const questions = await BaseQuestion.find(filters)
            .sort({ createdAt: parseInt(sortOrder, 10) })
            .skip(skip)
            .limit(page_size)
            .populate("topicId")
            .populate("countryId");

        return questions;
    }

    async getQuestion(id) {
        const question = await BaseQuestion.findById(id)
            .populate("topicId")
            .populate("countryId");
        return question;
    }

    async updateQuestion(id, updateData) {
        const updatedQuestion = await BaseQuestion.findByIdAndUpdate(id, updateData, { new: true })
            .populate("topicId")
            .populate("countryId");
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