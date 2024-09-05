import Documentation from "../models/documentation.model.js";

class DocumentationService {
    async createDocumentation(source, name, content, topicId, countryId, image, localeData) {
        const newDocumentation = await Documentation.create({
            source,
            name,
            content,
            topicId,
            countryId,
            image,
            localeData
        });
        return newDocumentation
    }

    async updateDocumentation(id, updateData) {
        try {
            const updatedDocumentation = Documentation.findByIdAndUpdate(id, updateData, { new: true });
            return updatedDocumentation;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    async getDocumentation(id) {
        const documentation = await Documentation.findById({ _id: id })
        .populate([
            { path: "topicId", select: "name" },
            { path: "countryId", select: "name" },  
        ]);
        return documentation;
    }

    async getDocumentations(filters, page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;

        const results = await Documentation.aggregate([
            { $match: filters },
            {
                $lookup: {
                    from: "topics",
                    localField: "topicId",
                    foreignField: "_id",
                    as: "topicDetails"
                }
            },
            {
                $lookup: {
                    from: "countries",
                    localField: "countryId",
                    foreignField: "_id",
                    as: "countryDetails"
                }
            },
            { $unwind: "$topicDetails" },
            { $unwind: "$countryDetails" },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                _id: 1,
                                source: 1,
                                name: 1,
                                content: 1,
                                image: 1,
                                status: 1,
                                localeData: 1,
                                createdAt: 1,
                                updatedAt: 1,
                                topic: {
                                    _id: "$topicDetails._id",
                                    name: "$topicDetails.name"
                                },
                                country: {
                                    _id: "$countryDetails._id",
                                    name: "$countryDetails.name"
                                },
                            }
                        }
                    ]
                }
            }
        ]);

        const totalDocumentationsCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const documentations = results[0].documents;

        return { documentations, totalDocumentationsCount };
    }
}

const documentationService = new DocumentationService();

export default documentationService;