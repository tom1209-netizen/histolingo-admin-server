import Joi from "joi";
import Player from "../models/player.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { playerStatus } from "../constants/player.constant.js";

export const getListPlayerValidator = async (req, res, next) => {
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
            .valid(playerStatus.active, playerStatus.inactive)
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
};

export const getPlayerById = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const id = req.params.id;
        const schema = Joi.object({
            id: Joi.string()
                .hex()
                .length(24)
                .required()
                .messages({
                    "string.base": __("validation.string", { field: __("model.player.name") }),
                    "string.hex": __("validation.hex", { field: __("model.player.name") }),
                    "string.length": __("validation.length", { field: __("model.player.name"), length: 24 }),
                    "any.required": __("validation.required", { field: __("model.player.name") })
                }),
        });

        await schema.validateAsync({ id });

        const player = await Player.findOne({ _id: id });
        if (!player) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.player.name") }),
                status: 404,
                data: null
            });
        };
        req.player = player;

        next();
    } catch (error) {
        next(error);
    }
};