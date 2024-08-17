import Player from "../models/player.model.js";

class PlayerService {
    async updateStatusPlayer(id, newStatus) {
        const updatedPlayer = await Player.findByIdAndUpdate(id, { status: newStatus }, { new: true });
        return updatedPlayer;
    }

    async getPlayers(filters, page, pageSize, sortOrder) {
        const skip = (page - 1) * pageSize;

        const results = await Player.aggregate([
            { $match: filters },
            {
                $facet: {
                    totalCount: [{ $count: "count" }],
                    documents: [
                        // { $sort: { createdAt: Number(sortOrder) } },
                        { $skip: skip },
                        { $limit: pageSize },
                        {
                            $project: {
                                password: 0
                            }
                        }
                    ]
                }
            }
        ])

        const totalPlayersCount = results[0].totalCount[0]
            ? results[0].totalCount[0].count
            : 0;
        const players = results[0].documents;

        return { players, totalPlayersCount };
    }
};

const playerService = new PlayerService();
export default playerService;