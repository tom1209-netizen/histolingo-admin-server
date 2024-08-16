import Joi from "joi";
import { playerStatus } from "../constants/player.constant.js";
import Player from "../models/player.model.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const getListPlayerValidator = async (req, res, next) => {
    const schema = Joi.object({
        search: Joi.string().allow(''),
        page: Joi.number().integer().min(1).default(1),
        limit: Joi.number().integer().min(1).default(10),
        status: Joi.number()
            .allow(null, "")
            .valid(playerStatus.active, playerStatus.inactive),
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