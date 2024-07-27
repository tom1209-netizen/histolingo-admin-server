import { Router } from "express";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    createRoleValidator,
    updateRoleValidator,
    getRoleValidator,
    getRolePermissionsValidator,
} from "../middlewares/role.middleware.js";
import {
    createRole,
    getRoles,
    getRole,
    updateRole,
    getRolePermission
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
    createRole
);

roleRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.role.read),
    getRoles
);

roleRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.role.read),
    getRoleValidator,
    getRole
);

roleRoute.put(
    "/:id",
    authentication,
    authorization(rolePrivileges.role.update),
    updateRoleValidator,
    updateRole
);

roleRoute.get(
    "/permissions/:id",
    authentication,
    getRolePermissionsValidator,
    getRolePermission,
)


export default roleRoute;