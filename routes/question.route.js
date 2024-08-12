import { Router } from "express";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    rolePrivileges
} from "../constants/role.constant.js";
import {
    createQuestionController,
    getQuestionsController,
    getQuestionController,
    updateQuestionController,
    deleteQuestionController
} from "../controllers/question.controller.js";
import {
    createQuestionValidator,
    getQuestionValidator,
    updateQuestionValidator
} from "../middlewares/question.middleware.js";

const questionRoute = Router();

questionRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.question.create),
    createQuestionValidator,
    createQuestionController
);

questionRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.question.read),
    getQuestionsController
);

questionRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.question.read),
    getQuestionValidator,
    getQuestionController
);

questionRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.question.update),
    updateQuestionValidator,
    updateQuestionController
);

questionRoute.delete(
    "/:id",
    authentication,
    authorization(rolePrivileges.question.delete),
    deleteQuestionController
);

export default questionRoute;
