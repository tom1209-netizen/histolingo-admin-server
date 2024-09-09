import { Router } from "express";
import {
    authentication,
    authorization

} from "../middlewares/auth.middleware.js";
import {
    rolePrivileges

} from "../constants/role.constant.js";
import {
    checkAnswerValidator,
    createTestValidator,
    getDataValidator,
    getTestsValidator,
    startDemoValidator,
    updateTestValidator

} from "../middlewares/test.middleware.js";
import {
    createTestController,
    getCountriesController,
    getTestsController,
    getTestController,
    getTopicsController,
    updateTestController,
    getQuestionController,
    startDemoController,
    checkAnswerController,
    getDocumentationsController,
    getQuestionsController

} from "../controllers/test.controller.js";

const testRoute = Router();

testRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.test.create),
    createTestValidator,
    createTestController
);

testRoute.get(
    "/getCountries",
    authentication,
    getDataValidator,
    getCountriesController
);

testRoute.get(
    "/getTopics",
    authentication,
    getDataValidator,
    getTopicsController
);

testRoute.get(
    "/getDocumentations",
    authentication,
    getDataValidator,
    getDocumentationsController
);

testRoute.get(
    "/getQuestions",
    authentication,
    getDataValidator,
    getQuestionsController
);

testRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.test.read),
    getTestsValidator,
    getTestsController
);

testRoute.get(
    "/getQuestion/:id",
    authentication,
    authorization(rolePrivileges.test.create),
    getQuestionController
);

testRoute.post(
    "/startDemo",
    authentication,
    authorization(rolePrivileges.test.play),
    startDemoValidator,
    startDemoController
);

testRoute.post(
    "/checkAnswer",
    authentication,
    authorization(rolePrivileges.test.play),
    checkAnswerValidator,
    checkAnswerController
);

testRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.test.update),
    updateTestValidator,
    updateTestController
);

testRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.test.read),
    getTestController
);

export default testRoute;