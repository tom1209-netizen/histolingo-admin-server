import Joi from "joi";
import { playerStatus } from "../constants/player.constant.js";
import Player from "../models/player.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const getListPlayerValidator = async (req, res, next) => {
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
};

export const getPlayerById = async (req, res, next) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const id = req.params.id;
        const schema = Joi.object({
            id: Joi.string()
                .hex()
                .length(24)
                .required(),
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