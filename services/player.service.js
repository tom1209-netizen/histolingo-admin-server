import Player from "../models/player.model.js";

class PlayerService {
    async deletePlayer(id) {
        const deletedPlayer = await Player.findOneAndUpdate(id, { status: 0 });
        return deletedPlayer;
    }
};

const playerService = new PlayerService();
export default playerService;