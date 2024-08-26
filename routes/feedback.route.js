import { Router } from "express";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    getFeedbackValidator,
    getFeedbacksValidator,
    replyFeedbackValidator
} from "../middlewares/feedback.middleware.js";
import {
    getFeedbacksController,
    getFeedbackController,
    replyFeedbackController
} from "../controllers/feedback.controller.js";
import { rolePrivileges } from "../constants/role.constant.js";

const feedbackRoute = Router();

feedbackRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.feedback.read),
    getFeedbacksValidator,
    getFeedbacksController
);

feedbackRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.feedback.read),
    getFeedbackValidator,
    getFeedbackController
);

feedbackRoute.post(
    "/reply/:id",
    authentication,
    authorization(rolePrivileges.feedback.reply),
    replyFeedbackValidator,
    replyFeedbackController
);

export default feedbackRoute;