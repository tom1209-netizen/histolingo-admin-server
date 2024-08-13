import Player from "../models/player.model.js";
import playerService from "../services/player.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const getListPlayerController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { search = '', page = 1, limit = 10, status } = req.query;

        const searchCondition = search
            ? { name: { $regex: search, $options: 'i' } } : {};
        if (status !== null && status !== undefined && status !== "") {
            searchCondition.status = status;
        }

        const players = await Player.find(searchCondition)
            .skip((page - 1) * limit)
            .limit(Number(limit));

        const totalPlayers = await Player.countDocuments(searchCondition);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.player.name") }),
            data: {
                players,
                totalPages: Math.ceil(totalPlayers / limit),
                totalCount: totalPlayers,
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

export const deletePlayerController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const player = req.player;
        const deletedPlayer = await playerService.deletePlayer(player);

        return res.status(200).json({
            success: true,
            message: __("message.updatedSuccess", { field: __("model.player.name") }),
            status: 200,
            data: {
                deletedPlayer: {
                    fullName: deletedPlayer.fullName,
                    email: deletedPlayer.email,
                    phoneNumber: deletedPlayer.phoneNumber,
                    userName: deletedPlayer.userName,
                    totalScore: deletedPlayer.totalScore,
                    totalTime: deletedPlayer.totalTime,
                    rank: deletedPlayer.rank,
                    sex: deletedPlayer.sex,
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
}