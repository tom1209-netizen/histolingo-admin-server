export const createDocumentationValidator = async (req, res, next) => {
    try {
        const { source, name, content, topicId, countryId } = req.body;
    } catch (error) {
        next(error);
    }
}