import { Router } from "express";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    createRoleValidator,
    updateRoleValidator,
    getRoleValidator,
} from "../middlewares/role.middleware.js";
import {
    createRoleController,
    getRolesController,
    getRoleController,
    updateRoleController,
    getAllPermissionController
} from "../controllers/role.controller.js";
import {
    rolePrivileges
} from "../constants/role.constant.js";

const roleRoute = Router();

roleRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.role.create),
    createRoleValidator,
    createRoleController
);

roleRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.role.read),
    getRolesController
);

roleRoute.get(
    "/permissions",
    authentication,
    authorization(rolePrivileges.role.read),
    getAllPermissionController,
)

roleRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.role.read),
    getRoleValidator,
    getRoleController
);

roleRoute.put(
    "/:id",
    authentication,
    authorization(rolePrivileges.role.update),
    updateRoleValidator,
    updateRoleController
);

export default roleRoute;