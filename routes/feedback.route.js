import { Router } from "express";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    createFeedbackValidator,
    getFeedbackValidator,
} from "../middlewares/feedback.middleware.js";
import {
    createFeedbackController,
    getFeedbacksController,
    getFeedbackController,
} from "../controllers/feedback.controller.js";
import { rolePrivileges } from "../constants/role.constant.js";

const feedbackRoute = Router();

feedbackRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.feedback.read),
    createFeedbackValidator,
    createFeedbackController
);

feedbackRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.feedback.read),
    getFeedbacksController
);

feedbackRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.feedback.read),
    getFeedbackValidator,
    getFeedbackController
);