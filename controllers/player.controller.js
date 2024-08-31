import playerService from "../services/player.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";
import { isValidStatus } from "../utils/validation.utils.js";

export const getPlayersController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const { page = 1, pageSize = 10, search = "", status, sortOrder = -1 } = req.query;

        const maxPageSize = 100;
        const limitedPageSize = Math.min(pageSize, maxPageSize);

        const filters = search
            ? {
                $or: [
                    { userName: { $regex: search, $options: "i" } },
                    { fullName: { $regex: search, $options: "i" } },
                ]
            }
            : {};
        if (isValidStatus(status)) {
            filters.status = Number(status);
        }

        const { players, totalPlayersCount } = await playerService.getPlayers(filters, page, limitedPageSize, sortOrder);

        return res.status(200).json({
            success: true,
            message: __("message.getSuccess", { field: __("model.player.name") }),
            data: {
                players,
                totalPages: Math.ceil(totalPlayersCount / pageSize),
                totalCount: totalPlayersCount,
                currentPage: Number(page)
            },
        });
    } catch (error) {
        return res.status(error.status || 500).json({
            success: false,
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};

export const updateStatusPlayerController = async (req, res) => {
    const __ = applyRequestContentLanguage(req);
    try {
        const id = req.params.id;
        const newStatus = req.body.status;
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
            message: error.message || __("error.internalServerError"),
            status: error.status || 500,
            data: error.data || null
        });
    }
};