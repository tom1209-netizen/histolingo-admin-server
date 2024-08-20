import Joi from "joi";
import Country from "../models/country.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
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
            localeData: Joi.object().pattern(/^[a-z]{2}-[A-Z]{2}$/,
                Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                })
            ).default({})
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
        };

        next();
    } catch (error) {
        next(error);
    }
};

export const updateCountryValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, description, image, status, localeData } = req.body;

        const createSchema = Joi.object({
            name: Joi.string()
                .max(250),
            description: Joi.string()
                .max(1000),
            image: Joi.string()
                .max(1000),
            status: Joi.number()
                .valid(countryStatus.active, countryStatus.inactive),
            localeData: Joi.object().pattern(/^[a-z]{2}-[A-Z]{2}$/,
                Joi.object({
                    name: Joi.string().max(250).required(),
                    description: Joi.string().max(1000).required()
                })
            ).default({})
        });

        await createSchema.validateAsync({
            name,
            description,
            image,
            status,
            localeData,
        });

        const id = req.params.id;
        const country = Country.findOne({ _id: id });
        req.country = country;

        if (!country) {
            return res.status(400).json({
                success: false,
                message: __("validation.notFound", { field: __("model.country.name") }),
                status: 404,
                data: null
            });
        }

        const existedCountry = await Country.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
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

export const getCountriesValidator = async (req, res, next) => {
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
        pageSize: Joi.number()
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