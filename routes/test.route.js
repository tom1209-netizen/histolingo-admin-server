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
    getQuestionsController,
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

testRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.test.read),
    getTestsValidator,
    getTestsController
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


testRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.test.update),
    updateTestValidator,
    updateTestController
);

export default testRoute;