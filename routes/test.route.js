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
    compareAnswersValidator,
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
    getQuestionsController,
    compareAnswersController,
    startDemoController,
    checkAnswerController

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
    authorization(rolePrivileges.test.create),
    getDataValidator,
    getCountriesController
);

testRoute.get(
    "/getTopicsTest",
    authentication,
    authorization(rolePrivileges.test.create),
    getDataValidator,
    getTopicsController
);

testRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.test.update),
    updateTestValidator,
    updateTestController
);

testRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.test.read),
    getTestsValidator,
    getTestsController
);

testRoute.post(
    "/demo",
    authentication,
    compareAnswersValidator,
    compareAnswersController
);

testRoute.get(
    "/getQuestions/:id",
    authentication,
    authorization(rolePrivileges.test.create),
    getQuestionsController
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

testRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.test.read),
    getTestController
);


export default testRoute;