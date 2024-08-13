import { Router } from "express";
import {
    authentication,
    authorization

} from "../middlewares/auth.middleware.js";
import {
    rolePrivileges

} from "../constants/role.constant.js";
import {
    createDocumentationValidator,
    getListDocumentationValidator,
    updateDocumentationValidator

} from "../middlewares/documentation.middleware.js";
import {
    createDocumentationController,
    getDocumentationByIdController,
    getListDocumentationController,
    updateDocumentationController

} from "../controllers/documentation.controller.js";

const documentationRoute = Router();

documentationRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.documentation.create),
    createDocumentationValidator,
    createDocumentationController
);
documentationRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.documentation.update),
    updateDocumentationValidator,
    updateDocumentationController
);
documentationRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.documentation.read),
    getDocumentationByIdController
);
documentationRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.documentation.read),
    getListDocumentationValidator,
    getListDocumentationController
);

export default documentationRoute;