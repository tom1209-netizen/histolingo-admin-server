import { feedbackService } from "../services/feedback.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const createFeedbackController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    const data = req.body;

    try {
        const feedback = await feedbackService.createFeedback(data);

        return res.status(201).json({
            success: true,
            message: __("feedback.createFeedbackSuccess"),
            status: 201,
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

export const getFeedbacksController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    const { filters, page, page_size, sortOrder } = req.query;

    try {
        const feedbacks = await feedbackService.getFeedbacks(filters, page, page_size, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("feedback.getFeedbacksSuccess"),
            status: 200,
            data: {
                feedbacks
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