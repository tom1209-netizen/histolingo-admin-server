import Joi from "joi";
import Country from "../models/country.model.js";
import { applyRequestContentLanguage, t } from "../utils/localization.util.js";
import { countryStatus } from "../constants/country.constant.js";

export const createCountryValidator = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { name, description, image } = req.body;

        const createSchema = Joi.object({
            name: Joi.string()
                .max(250)
                .required(),
            description: Joi.string()
                .max(1000)
                .required(),
            image: Joi.string()
                .max(1000),
        });

        await createSchema.validateAsync({
            name,
            description,
            image
        })

        const existedCountry = await Country.findOne({ name });
        if (existedCountry) {
            return res.status(400).json({
                success: false,
                message: __("validation.unique", {field: __("model.country.name")}),
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
    try {
        const { name, description, image } = req.body;

        const createSchema = Joi.object({
            name: Joi.string()
                .max(250)
                .required(),
            description: Joi.string()
                .max(1000)
                .required(),
            image: Joi.string()
                .max(1000),
        });

        await createSchema.validateAsync({
            name,
            description,
            image
        });

        const id = req.params.id;
        const country = Country.findOne({ _id: id });
        req.country = country;

        if (!country) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "country.notFound"),
                status: 404,
                data: null
            });
        }

        const existedCountry = await Country.findOne({ name: req.body.name, _id: { $ne: req.params.id } });
        if (existedCountry) {
            return res.status(404).json({
                success: false,
                message: t(req.contentLanguage, "country.countryExists"),
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
    const schema = Joi.object({
        search: Joi.string().allow(''),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        status: Joi.number()
            .allow(null, "")
            .valid(countryStatus.active, countryStatus.inactive),
    });

    try {
        const value = await schema.validateAsync(req.query);
        req.query = value;
        next();
    } catch (error) {
        next(error);
    }
}