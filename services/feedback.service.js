import Feedback from "../models/feedback.model.js";

class FeedbackService {
    async createFeedback(feedback) {
        const newFeedback = await Feedback.create(feedback);
        return newFeedback;
    }

    async getFeedbacks(filters, page, page_size, sortOrder) {
        const skip = (page - 1) * page_size;

        const feedbacks = await Feedback.find(filters)
            .sort({ createdAt: parseInt(sortOrder, 10) })
            .skip(skip)
            .limit(page_size);

        return feedbacks;
    }

    async getFeedback(id) {
        const feedback = await Feedback.findById(id);
        return feedback;
    }
}

export const feedbackService = new FeedbackService();
