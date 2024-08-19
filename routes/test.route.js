import { Router } from "express";
import {
    authentication,
    authorization

} from "../middlewares/auth.middleware.js";
import {
    rolePrivileges

} from "../constants/role.constant.js";
import {
    createTestValidator,
    getDataValidator,
    getTestsValidator,
    updateTestValidator

} from "../middlewares/test.middleware.js";
import {
    createTestController,
    getCountriesController,
    getTestsController,
    getTestController,
    getTopicsController,
    updateTestController,
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
    "/getQuestionTest",
    authentication,
    authorization(rolePrivileges.test.create),
    getDataValidator,
    getQuestionsController
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

testRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.test.read),
    getTestController
);



export default testRoute;