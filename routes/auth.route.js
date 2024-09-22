import { refreshAccessTokenController } from "../controllers/auth.controller.js";
import {
    authentication,
    refreshTokenValidator
} from "../middlewares/auth.middleware.js";
import { Router } from "express";

const authRoute = Router();

authRoute.post(
    "/refresh-token",
    refreshTokenValidator,
    refreshAccessTokenController
);

export default authRoute;