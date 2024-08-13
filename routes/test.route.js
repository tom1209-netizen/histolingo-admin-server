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
    getListTestValidator,
    getTopicsValidator,
    updateTestValidator

} from "../middlewares/test.middleware.js";
import {
    createTestController,
    getListTestController,
    getTestByIdController,
    getTopicsController,
    updateTestController

} from "../controllers/test.controller.js";

const testRoute = Router();

testRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.test.create),
    createTestValidator,
    createTestController
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
    getListTestValidator,
    getListTestController
);

testRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.test.read),
    getTestByIdController
);

testRoute.get(
    "/getCountriesTest",
    authentication,
    authorization(rolePrivileges.test.create),

);

testRoute.get(
    "/getTopics",
    authentication,
    authorization(rolePrivileges.test.create),
    getTopicsValidator,
    getTopicsController
);

export default testRoute;