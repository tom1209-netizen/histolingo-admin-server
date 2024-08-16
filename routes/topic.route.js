import { Router } from "express";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    createTopicValidator,
    updateTopicValidator,
    getTopicValidator,
    getTopicsValidator
} from "../middlewares/Topic.middleware.js";
import {
    createTopicController,
    getTopicsController,
    getTopicController,
    updateTopicController,
} from "../controllers/topic.controller.js";
import { rolePrivileges } from "../constants/role.constant.js";

const topicRoute = Router();

topicRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.topic.create),
    createTopicValidator,
    createTopicController
);

topicRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.topic.read),
    getTopicsValidator,
    getTopicsController
);

topicRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.topic.read),
    getTopicValidator,
    getTopicController
);

topicRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.topic.update),
    updateTopicValidator,
    updateTopicController
);

export default topicRoute;