import Joi from "joi";
import Country from "../models/country.model.js";
import { applyRequestContentLanguage, t } from "../utils/localization.util.js";
import { countryStatus } from "../constants/country.constant.js";

export const createCountryValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, description, image, localeData } = req.body;

        const createSchema = Joi.object({
            name: Joi.string()
                .max(250)
                .required(),
            description: Joi.string()
                .max(1000)
                .required(),
            image: Joi.string()
                .max(1000),
            localeData: Joi.object({
                "en-US": Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                }).required(),
                "vi-VN": Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                }).required(),
                "ja-JP": Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                }).required(),
                "ru-RU": Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                }).required()
            }).required()
        });

        await createSchema.validateAsync({
            name,
            description,
            image,
            localeData
        });

        const existedCountry = await Country.findOne({ name });
        if (existedCountry) {
            return res.status(400).json({
                success: false,
                message: __("validation.unique", { field: __("model.country.name") }),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const updateCountryValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, description, image, localeData } = req.body;

        const createSchema = Joi.object({
            name: Joi.string()
                .max(250)
                .required(),
            description: Joi.string()
                .max(1000)
                .required(),
            image: Joi.string()
                .max(1000),
            localeData: Joi.object({
                "en-US": Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                }).required(),
                "vi-VN": Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                }).required(),
                "ja-JP": Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                }).required(),
                "ru-RU": Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                }).required()
            }).required()
        });

        await createSchema.validateAsync({
            name,
            description,
            image,
            localeData
        });

        const id = req.params.id;
        const country = Country.findOne({ _id: id });
        req.country = country;

        if (!country) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", {field: __("model.country.name")}),
                status: 404,
                data: null
            });
        }

        const existedCountry = await Country.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
        if (existedCountry) {
            return res.status(404).json({
                success: false,
                message: __("validation.unique", { field: __("model.country.name") }),
                status: 404,
                data: null
            });
        }

        next();
    } catch (error) {
        next(error);
    }
};

export const getListCountryValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);

    const schema = Joi.object({
        page: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                'number.base': __('question.invalidPage'),
                'number.min': __('question.pageMin')
            }),
        page_size: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                'number.base': __('question.invalidPageSize'),
                'number.min': __('question.pageSizeMin')
            }),
        search: Joi.string()
            .optional()
            .allow('')
            .messages({
                'string.base': __('question.invalidSearch')
            }),
        sortOrder: Joi.number()
            .valid(1, -1)
            .optional()
            .messages({
                'any.only': __('question.invalidSortOrder')
            }),
        status: Joi.number()
            .valid(0, 1)
            .optional()
            .messages({
                'any.only': __('question.invalidStatus')
            }),
    });

    try {
        const value = await schema.validateAsync(req.query);
        req.query = value;
        next();
    } catch (error) {
        next(error);
    }
}