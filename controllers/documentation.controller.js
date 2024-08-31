import documentationService from "../services/documentation.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { isValidStatus } from "../utils/validation.utils.js";

export const createDocumentationController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { source, name, content, topicId, countryId, image, localeData } = req.body;
        const newDocumentation = await documentationService.createDocumentation(source, name, content, topicId, countryId, image, localeData);

        return res.status(201).json({
            success: true,
            message: __("message.createdSuccess", { field: __("model.documentation.displayName") }),
            status: 201,
            data: {
                documentation: {
                    id: newDocumentation._id,
                    source: newDocumentation.source,
                    name: newDocumentation.name,
                    content: newDocumentation.content,
                    image: newDocumentation.image,
                    localeData: newDocumentation.localeData
                }
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
};

export const updateDocumentationController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedDocumentation = await documentationService.updateDocumentation(id, updateData);

        return res.status(200).json({
            success: true,
            message: __("message.updatedSuccess", { field: __("model.documentation.displayName") }),
            status: 200,
            data: {
                updatedDocumentation: {
                    id: updatedDocumentation._id,
                    source: updatedDocumentation.source,
                    name: updatedDocumentation.name,
                    content: updatedDocumentation.content,
                    image: updatedDocumentation.image,
                    status: updatedDocumentation.status,
                    localeData: updatedDocumentation.localeData
                }
            }
        })
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getDocumentationController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);

    try {
        const id = req.params.id;
        const documentation = await documentationService.getDocumentation(id);

        if (!documentation) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.documentation.displayName") }),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: __("message.getSuccess", { field: __("model.documentation.displayName") }),
                status: 200,
                data: {
                    documentation: {
                        id: documentation._id,
                        source: documentation.source,
                        name: documentation.name,
                        topicId: documentation.topicId,
                        countryId: documentation.countryId,
                        content: documentation.content,
                        status: documentation.status,
                        localeData: documentation.localeData,
                        createdAt: documentation.createdAt,
                        updatedAt: documentation.updatedAt
                    }
                }
            });
        }
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getDocumentationsController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { page = 1, pageSize = 10, search = "", status, sortOrder = -1 } = req.query;

        const maxPageSize = 100;
        const limitedPageSize = Math.min(pageSize, maxPageSize);

        const filters = search
            ? { name: { $regex: search, $options: "i" } } : {};
        if (isValidStatus(status)) {
            filters.status = Number(status);
        }

        const { documentations, totalDocumentationsCount } = await documentationService.getDocumentations(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.documentation.displayListName") }),
            data: {
                documentations,
                totalPages: Math.ceil(totalDocumentationsCount / limitedPageSize),
                totalCount: totalDocumentationsCount,
                currentPage: Number(page)
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
};