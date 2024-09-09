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
    getQuestionsValidator,
    updateQuestionValidator,
    deleteQuestionValidator
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
    getQuestionsValidator,
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

export default questionRoute;
