import Topic from "../models/topic.model.js";

class TopicService {
    async createTopic(name, description, image, countryId, localeData) {
        const newTopic = await Topic.create(
            { name,
                description,
                image,
                countryId,
                localeData,
                status: 1
            });
        return newTopic;
    }

    async getTopics(filters, page, page_size, sortOrder) {
        const skip = (page - 1) * page_size;

        const topics = await Topic.find(filters)
            .sort({ createAt: sortOrder })
            .skip(skip)
            .limit(page_size);

        return topics;
    }

    async getTopic(id) {
        const topic = await Topic.findById(id);
        return topic;
    }

    async updateTopic(id, name, description, image, countryId, localeData) {
        const updatedTopic = await Topic.findByIdAndUpdate(id,
            {
                name,
                description,
                image,
                countryId,
                localeData,
            },
            { new: true });
        return updatedTopic;
    }
}

export const TopicService = new TopicService();