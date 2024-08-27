import Feedback from "../models/feedback.model.js";
import Player from "../models/player.model.js";
import { sendEmail } from "../utils/email.utils.js";

class FeedbackService {
    async getFeedbacks(filters, page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;

        const results = await Feedback.aggregate([
            { $match: filters },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize }
                    ]
                }
            }
        ]);

        const totalFeedbacksCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const feedbacks = results[0].documents;

        return { feedbacks, totalFeedbacksCount };
    }

    async getFeedback(id) {
        const feedback = await Feedback.findById(id);
        return feedback;
    }

    async replyFeedback(id, subject, reply) {
        const feedback = await Feedback.findById(id);
        const feedbackOwner = await Player.findById(feedback.createdBy);
        const email = feedbackOwner.email;

        await sendEmail(subject, reply, email);
    }
}

export const feedbackService = new FeedbackService();
