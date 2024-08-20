import countryService from "../services/country.service.js";
import { applyRequestContentLanguage, t } from "../utils/localization.util.js";

export const createCountryController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, description, image, localeData } = req.body;
        const newCountry = await countryService.createCountry(name, description, image, localeData);

        return res.status(201).json({
            success: true,
            message: __("message.createdSuccess", { field: __("model.country.name") }),
            status: 201,
            data: {
                country: {
                    id: newCountry._id,
                    name: newCountry.name,
                    description: newCountry.description,
                    image: newCountry.image,
                    localeData: newCountry.localeData,
                },
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
};

export const updateCountryController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { id } = req.params;
        const updateData = req.body;

        const updatedCountry = await countryService.updateCountry(id, updateData);

        return res.status(200).json({
            success: true,
            message: __("message.updatedSuccess", { field: __("model.country.name") }),
            status: 200,
            data: {
                updatedCountry: {
                    _id: updatedCountry._id,
                    name: updatedCountry.name,
                    description: updatedCountry.description,
                    image: updatedCountry.image,
                    status: updatedCountry.status,
                    localeData: updatedCountry.localeData,
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
};

export const getCountryController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const id = req.params.id;
        const country = await countryService.getCountry(id);

        if (!country) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.country.name") }),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: __("message.getSuccess", { field: __("model.country.name") }),
                status: 200,
                data: {
                    country: {
                        _id: country._id,
                        name: country.name,
                        description: country.description,
                        image: country.image,
                        status: country.status,
                        localeData: country.localeData,
                        createdAt: country.createdAt,
                        updatedAt: country.updatedAt
                    }
                }
            });
        }
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || "Internal Server Error",
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const getCountriesController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { search = '', page = 1, pageSize = 10, status, sortOrder = -1  } = req.query;

        const maxPageSize = 100;
        const limitedPageSize = Math.min(pageSize, maxPageSize);

        const filters = search
            ? { name: { $regex: search, $options: 'i' } } : {};
        if (status !== null && status !== undefined && status !== "") {
            filters.status = status;
        }

        const { countries, totalCountriesCount } = await countryService.getCountries(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.country.name") }),
            data: {
                countries,
                totalPages: Math.ceil(totalCountriesCount / limitedPageSize),
                totalCount: totalCountriesCount,
                currentPage: Number(page)
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
};