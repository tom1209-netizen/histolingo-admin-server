import topicService from "../services/topic.service.js";
import { t } from "../utils/localization.util.js";
import { isValidStatus } from "../utils/validation.utils.js";

export const createTopicController = async (req, res) => {
    try {
        const { name, description, image, countryId, localeData } = req.body;
        const newTopic = await topicService.createTopic(name, description, image, countryId, localeData);

        return res.status(201).json({
            success: true,
            message: t(req.contentLanguage, "topic.createTopicSuccess"),
            status: 201,
            data: {
                topic: {
                    name: newTopic.name,
                    description: newTopic.description,
                    image: newTopic.image,
                    countryId: newTopic.countryId,
                    status: newTopic.status,
                    localeData: newTopic.localeData
                }
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getTopicsController = async (req, res) => {
    const { page = 1, page_size = 10, name, status } = req.query;

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
        const topics = await topicService.getTopics(filters, page, limitedPageSize);

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "topic.getTopicsSuccess"),
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
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getTopicController = async (req, res) => {
    try {
        const { id } = req.params;
        const topic = await topicService.getTopic(id);

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "topic.getTopicSuccess"),
            status: 200,
            data: {
                topic: {
                    name: topic.name,
                    description: topic.description,
                    image: topic.image,
                    countryId: topic.countryId,
                    status: topic.status,
                    localeData: topic.localeData
                }
            }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const updateTopicController = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, image, countryId, localeData } = req.body;

        const updatedTopic = await topicService.updateTopic(id, name, description, image, countryId, localeData);

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "topic.updateTopicSuccess"),
            status: 200,
            data: {
                topic: {
                    name: updatedTopic.name,
                    description: updatedTopic.description,
                    image: updatedTopic.image,
                    countryId: updatedTopic.countryId,
                    localeData: updatedTopic.localeData
                }
            }
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}