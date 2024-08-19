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

    async getTopics(filters, page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;

        const results = await Topic.aggregate([
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "country",
                    pipeline: [
                        { $project: { name: 1 } }
                    ]
                }
            },
            {
                $addFields: {
                    country: { $arrayElemAt: ["$country", 0] }
                }
            },
            { $match: filters },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize },
                    ]
                }
            },
        ]);

        const totalTopicsCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const topics = results[0].documents;

        return { topics, totalTopicsCount };
    }

    async getTopic(id) {
        const topic = await Topic.findById(id);
        return topic;
    }

    async updateTopic(id, updateData) {
        const updatedTopic = await Topic.findByIdAndUpdate(id, updateData, { new: true });
        return updatedTopic;
    }
}

export const topicService = new TopicService();