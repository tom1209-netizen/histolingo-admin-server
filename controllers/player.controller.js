import Player from "../models/player.model.js";
import playerService from "../services/player.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const getListPlayerController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { search = '', page = 1, page_size = 10, status } = req.query;

        const searchCondition = search
            ? { fullName: { $regex: search, $options: 'i' } } : {};
        if (status !== null && status !== undefined && status !== "") {
            searchCondition.status = status;
        }

        const players = await Player.find(searchCondition)
            .skip((page - 1) * page_size)
            .limit(Number(page_size));

        const totalPlayers = await Player.countDocuments(searchCondition);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.player.name") }),
            data: {
                players,
                totalPages: Math.ceil(totalPlayers / page_size),
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

export const updateStatusPlayerController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const id = req.params.id;
        const player = req.player;
        const newStatus = player.status === 1 ? 0 : 1;
        const updatedPlayer = await playerService.updateStatusPlayer(id, newStatus);

        if (!updatedPlayer) {
            return res.status(404).json({
                success: false,
                message: __("validation.notFound", { field: __("model.player.name") }),
                status: 404,
                data: null
            });
        }

        return res.status(200).json({
            success: true,
            message: __("message.updatedSuccess", { field: __("model.player.name") }),
            status: 200,
            data: {
                updatedPlayer: {
                    fullName: updatedPlayer.fullName,
                    email: updatedPlayer.email,
                    phoneNumber: updatedPlayer.phoneNumber,
                    userName: updatedPlayer.userName,
                    totalScore: updatedPlayer.totalScore,
                    totalTime: updatedPlayer.totalTime,
                    rank: updatedPlayer.rank,
                    sex: updatedPlayer.sex,
                    status: updatedPlayer.status
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