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
            message: __("message.createdSuccess", { field: __("model.topic.name") }),
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

    const { page = 1, pageSize = 10, search, countryName, status, sortOrder = -1 } = req.query;

    const maxPageSize = 100;
    const limitedPageSize = Math.min(pageSize, maxPageSize);

    const filters = {};

    if (search) {
        filters.name = { $regex: new RegExp(search, "i") };
    }

    if (isValidStatus(status)) {
        filters.status = Number(status);
    }

    if (countryName) {
        filters["country.name"] = countryName;
    }

    try {
        const { topics, totalTopicsCount } = await topicService.getTopics(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.topic.name") }),
            status: 200,
            data: {
                topics,
                totalTopics: totalTopicsCount,
                totalPage: Math.ceil(totalTopicsCount / limitedPageSize),
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

export const getTopicController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { id } = req.params;
        const topic = await topicService.getTopic(id);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.topic.name") }),
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
        const data = req.body;

        const updatedTopic = await topicService.updateTopic(id, data);

        if (!updatedTopic) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.topic.name") }),
                status: 404,
                data: null,
            });
        }

        return res.status(200).json({
            success: true,
            message: __("message.updatedSuccess", { field: __("model.topic.name") }),
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