import Country from "../models/country.model.js";
import countryService from "../services/country.service.js";
import { t } from "../utils/localization.util.js";

export const createCountryController = async (req, res) => {
    try {
        const { name, description, image, localeData } = req.body;
        console.log(req.body);
        const newCountry = await countryService.createCountry(name, description, image, localeData);

        return res.status(201).json({
            success: true,
            message: t(req.contentLanguage, "country.createSuccess"),
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
    try {
        const { country } = req.body;
        const updateData = req.body;

        const updatedCountry = await countryService.updateCountry(country, updateData);

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "country.updateSuccess"),
            status: 200,
            data: {
                updatedCountry: {
                    _id: updatedCountry._id,
                    name: updatedCountry.name,
                    description: updatedCountry.description,
                    image: updatedCountry.image,
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

export const getCountryByIdController = async (req, res) => {
    try {
        const id = req.params.id;
        const country = await Country.findById({ _id: id });

        if (!country) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "country.notFound"),
                status: 404,
                data: null
            });
        } else {
            return res.status(200).json({
                success: true,
                message: t(req.contentLanguage, "country.getByIdSuccess"),
                status: 200,
                data: country
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

export const getListCountryController = async (req, res) => {
    try {
        const { search = '', page = 1, limit = 10, status } = req.query;

        // Tạo điều kiện tìm kiếm
        const searchCondition = search
            ? { name: { $regex: search, $options: 'i' } } : {};
        if (status !== null && status !== undefined && status !== "") {
            searchCondition.status = status;
        }

        // Lấy danh sách theo điều kiện tìm kiếm và phân trang
        const countries = await Country.find(searchCondition)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        // Lấy tổng số lượng Country để tính toán phân trang
        const totalCountries = await Country.countDocuments(searchCondition);

        return res.status(200).json({
            success: true,
            message: t(req.contentLanguage, "country.getListSuccess"),
            data: {
                countries,
                totalPages: Math.ceil(totalCountries / limit),
                totalCount: totalCountries,
                currentPage: Number(page)
            },
        });
    } catch (error) {
        next(error);
    }
}