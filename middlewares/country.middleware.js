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
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                    "any.required": __("validation.required", { field: __("field.name") })
                }),
            description: Joi.string()
                .max(1000)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("field.description") }),
                    "string.max": __("validation.max", { field: __("field.description"), max: 1000 }),
                    "any.required": __("validation.required", { field: __("field.description") })
                }),
            image: Joi.string()
                .max(1000)
                .messages({
                    "string.base": __("validation.string", { field: __("field.image") }),
                    "string.max": __("validation.max", { field: __("field.image"), max: 1000 }),
                }),
            localeData: Joi.object().pattern(
                new RegExp("^[a-z]{2}-[A-Z]{2}$"),
                Joi.object({
                    name: Joi.string().max(250).messages({
                        "string.base": __("validation.string", { field: __("field.name") }),
                        "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                    }),
                    description: Joi.string().max(1000).messages({
                        "string.base": __("validation.string", { field: __("field.description") }),
                        "string.max": __("validation.max", { field: __("field.description"), max: 1000 }),
                    })
                })
            ).default({})
                .messages({
                    "object.pattern.match": __("validation.localeData.pattern", { pattern: "^[a-z]{2}-[A-Z]{2}$" })
                })
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
                .max(250)
                .messages({
                    "string.base": __("validation.string", { field: __("field.name") }),
                    "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                }),
            description: Joi.string()
                .max(1000)
                .messages({
                    "string.base": __("validation.string", { field: __("field.description") }),
                    "string.max": __("validation.max", { field: __("field.description"), max: 1000 }),
                }),
            image: Joi.string()
                .max(1000)
                .uri()
                .messages({
                    "string.base": __("validation.string", { field: __("field.image") }),
                    "string.max": __("validation.max", { field: __("field.image"), max: 1000 }),
                    "string.uri": __("validation.image.uri", { field: __("field.image") }),
                }),
            status: Joi.number()
                .valid(countryStatus.active, countryStatus.inactive)
                .optional()
                .messages({
                    "any.only": __("validation.invalid", { field: __("field.status") })
                }),
            localeData: Joi.object().pattern(
                new RegExp("^[a-z]{2}-[A-Z]{2}$"),
                Joi.object({
                    name: Joi.string().max(250).messages({
                        "string.base": __("validation.string", { field: __("field.name") }),
                        "string.max": __("validation.max", { field: __("field.name"), max: 250 }),
                    }),
                    description: Joi.string().max(1000).messages({
                        "string.base": __("validation.string", { field: __("field.description") }),
                        "string.max": __("validation.max", { field: __("field.description"), max: 1000 }),
                    })
                })
            ).default({})
                .messages({
                    "object.pattern.match": __("validation.pattern", { pattern: "^[a-z]{2}-[A-Z]{2}$" })
                }),
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
                "number.base": __("validation.invalid", { field: __("field.page") }),
                "number.min": __("validation.min", { field: __("field.page"), min: 1 })
            }),
        pageSize: Joi.number()
            .integer()
            .min(1)
            .optional()
            .messages({
                "number.base": __("validation.invalid", { field: __("field.pageSize") }),
                "number.min": __("validation.min", { field: __("field.pageSize"), min: 1 })
            }),
        search: Joi.string()
            .optional()
            .allow("")
            .messages({
                "string.base": __("validation.invalid", { field: __("field.search") })
            }),
        sortOrder: Joi.number()
            .valid(1, -1)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.sortOrder") })
            }),
        status: Joi.number()
            .valid(countryStatus.active, countryStatus.inactive)
            .optional()
            .messages({
                "any.only": __("validation.invalid", { field: __("field.status") })
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