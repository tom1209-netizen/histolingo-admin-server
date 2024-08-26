import { feedbackService } from "../services/feedback.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { isValidStatus } from "../utils/validation.utils.js";

export const getFeedbacksController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    const { page = 1, pageSize = 10, search, sortOrder = -1, status } = req.query;

    const maxPageSize = 100;
    const limitedPageSize = Math.min(pageSize, maxPageSize);

    const filters = {};

    if (isValidStatus(status)) {
        filters.status = Number(status);
    }

    if (search) {
        filters.content = { $regex: new RegExp(search, 'i') };
    }

    try {
        const { feedbacks, totalFeedbacksCount } = await feedbackService.getFeedbacks(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("feedback.getFeedbacksSuccess"),
            status: 200,
            data: {
                feedbacks,
                totalFeedbacks: totalFeedbacksCount,
                totalPage: Math.ceil(totalFeedbacksCount / limitedPageSize),
                currentPage: Number(page)
            }
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

export const getFeedbackController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;

    try {
        const feedback = await feedbackService.getFeedback(id);

        return res.status(200).json({
            success: true,
            message: __("feedback.getFeedbackSuccess"),
            status: 200,
            data: {
                feedback
            }
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

export const replyFeedbackController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    const { id } = req.params;
    const { reply } = req.body;

    try {
        await feedbackService.replyFeedback(id, reply);

        return res.status(200).json({
            success: true,
            message: __("feedback.replyFeedbackSuccess"),
            status: 200,
            data: null
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