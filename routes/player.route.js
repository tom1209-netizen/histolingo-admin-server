import { Router } from "express";
import {
    authentication,
    authorization

} from "../middlewares/auth.middleware.js";
import {
    rolePrivileges

} from "../constants/role.constant.js";
import {
    getListPlayerValidator,
    getPlayerById

} from "../middlewares/player.middleware.js";
import {
    getListPlayerController,
    updateStatusPlayerController

} from "../controllers/player.controller.js";

const playerRoute = Router();

playerRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.player.read),
    getListPlayerValidator,
    getListPlayerController
);

playerRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.player.delete),
    getPlayerById,
    updateStatusPlayerController
);

export default playerRoute;