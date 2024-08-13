import Documentation from "../models/documentation.model.js";

class DocumentationService {
    async createDocumentation(source, name, content, topicId, countryId, localeData) {
        const newDocumentation = await Documentation.create({
            source,
            name,
            content,
            topicId,
            countryId,
            localeData
        });
        return newDocumentation
    }

    async updateDocumentation(documentation, updateData) {
        try {
            const updatedDocumentation = Documentation.findOneAndUpdate(documentation, updateData, { new: true });
            return updatedDocumentation;
        } catch (e) {
            const error = new Error(e.message);
            error.status = 500;
            error.data = null;
            throw error;
        }
    }

    async getDocumentation(id) {
        const documentation = await Documentation.findById({ _id: id });
        return documentation;
    }

    async getListDocumentations(searchCondition, page, limit) {
        const documentations = await Documentation.find(searchCondition)
            .skip((page - 1) * limit)
            .limit(Number(limit));
        return documentations;
    }
}

const documentationService = new DocumentationService();

export default documentationService;