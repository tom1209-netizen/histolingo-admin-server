import { Router } from "express";
import {
    authentication,
    authorization

} from "../middlewares/auth.middleware.js";
import {
    rolePrivileges

} from "../constants/role.constant.js";
import {
    getListPlayerValidator

} from "../middlewares/player.middleware.js";
import {
    getListPlayerController

} from "../controllers/player.controller.js";

const playerRoute = Router();

playerRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.player.read),
    getListPlayerValidator,
    getListPlayerController
);

playerRoute.delete(
    "/:id",
    authentication,
    authorization(rolePrivileges.player.delete)
)

export default playerRoute;