import { topicService } from "../services/topic.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { isValidStatus } from "../utils/validation.utils.js";

export const createTopicController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { name, description, image, countryId, localeData } = req.body;
        const newTopic = await topicService.createTopic(name, description, image, countryId, localeData);

        return res.status(201).json({
            success: true,
            message: __("topic.createTopicSuccess"),
            status: 201,
            data: {
                newTopic
            },
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

export const getTopicsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    const { page = 1, page_size = 10, name, status, sortOrder = 1 } = req.query;

    const maxPageSize = 100;
    const limitedPageSize = Math.min(page_size, maxPageSize);

    const filters = {};

    if (name) {
        filters.name = { $regex: new RegExp(name, 'i') };
    }

    if (isValidStatus(status)) {
        filters.status = status;
    }

    try {
        const topics = await topicService.getTopics(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("topic.getTopicsSuccess"),
            status: 200,
            data: {
                topics,
                totalTopics: topics.length,
                totalPage: Math.ceil(topics.length / limitedPageSize),
                currentPage: page
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

export const getTopicController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { id } = req.params;
        const topic = await topicService.getTopic(id);

        return res.status(200).json({
            success: true,
            message: __("topic.getTopicSuccess"),
            status: 200,
            data: {
                topic
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

export const updateTopicController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { id } = req.params;
        const { name, description, image, countryId, localeData } = req.body;

        const updateData = {};
        if (name !== undefined) updateData.name = name;
        if (description !== undefined) updateData.description = description;
        if (image !== undefined) updateData.image = image;
        if (countryId !== undefined) updateData.countryId = countryId;
        if (localeData !== undefined) updateData.localeData = localeData;

        const updatedTopic = await topicService.updateTopic(id, updateData);

        if (!updatedTopic) {
            return res.status(404).json({
                success: false,
                message: __("topic.notFound"),
                status: 404,
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: __("topic.updateTopicSuccess"),
            status: 200,
            data: {
                updatedTopic
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null,
        });
    }
};

export const deleteTopicController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { id } = req.params;

        const deletedTopic = await topicService.deleteTopic(id);

        if (!deletedTopic) {
            return res.status(404).json({
                success: false,
                message: __("topic.notFound"),
                status: 404,
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: __("topic.deleteSuccess"),
            status: 200,
            data: {
                deletedTopic
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null,
        });
    }
};