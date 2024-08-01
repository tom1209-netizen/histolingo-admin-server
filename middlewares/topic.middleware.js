import Joi from 'joi';
import Topic from '../models/topic.model.js';
import { t } from '../utils/localization.util.js';

export const createTopicValidator = async (req, res, next) => {
    const { name, description, image, countryId } = req.body;

    const createSchema = Joi.object({
        name: Joi.string()
            .max(250)
            .required(),
        description: Joi.string()
            .max(1000)
            .required(),
        image: Joi.string()
            .uri()
            .required(),
        countryId: Joi.string()
            .hex()
            .length(24)
            .required()
    });

    try {
        await createSchema.validateAsync({ name, description, image, countryId });

        const existedTopic = await Topic.findOne({ name });
        if (existedTopic) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "topic.topicExists"),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const updateTopicValidator = async (req, res, next) => {
    const { id } = req.params;
    const { name, description, image, countryId } = req.body;

    const updateSchema = Joi.object({
        id: Joi.string()
            .hex()
            .length(24)
            .required(),
        name: Joi.string()
            .max(250),
        description: Joi.string()
            .max(1000),
        image: Joi.string()
            .uri(),
        countryId: Joi.string()
            .hex()
            .length(24)
    });

    try {
        await updateSchema.validateAsync({ id, name, description, image, countryId });

        const existedTopic = await Topic.findById(id);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "topic.topicNotFound"),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}

export const getTopicValidator = async (req, res, next) => {
    const { id } = req.params;

    const getSchema = Joi.object({
        id: Joi.string()
            .hex()
            .length(24)
            .required()
    });

    try {
        await getSchema.validateAsync({ id });

        const existedTopic = await Topic.findById(id);
        if (!existedTopic) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "topic.topicNotFound"),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
}