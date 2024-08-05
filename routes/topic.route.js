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
    deleteTopicController
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

topicRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.topic.update),
    updateTopicValidator,
    updateTopicController
);

topicRoute.delete(
    "/:id",
    authentication,
    authorization(rolePrivileges.topic.delete),
    deleteTopicController
);

export default topicRoute;