import { Router } from "express";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    createTopicValidator,
    updateTopicValidator,
    getTopicValidator,
} from "../middlewares/Topic.middleware.js";
import {
    createTopicController,
    getTopicsController,
    getTopicController,
    updateTopicController,
} from "../controllers/Topic.controller.js";
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
    getTopicsController
);

topicRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.topic.read),
    getTopicValidator,
    getTopicController
);

topicRoute.put(
    "/:id",
    authentication,
    authorization(rolePrivileges.topic.update),
    updateTopicValidator,
    updateTopicController
);

export default topicRoute;