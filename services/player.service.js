import Player from "../models/player.model.js";

class PlayerService {
    async updateStatusPlayer(id, newStatus) {
        const updatedPlayer = await Player.findByIdAndUpdate(id, { status: newStatus }, { new: true });
        return updatedPlayer;
    }
};

const playerService = new PlayerService();
export default playerService;