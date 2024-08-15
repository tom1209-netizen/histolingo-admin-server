import { Router } from "express";
import {
    createAdminValidator,
    loginAdminValidator,
    updateAdminValidator,
    getListAdminValidator,
    getRolesToAdminValidator
} from "../middlewares/admin.middleware.js";
import {
    createAdminController,
    generateRefreshTokenController,
    getByIdController,
    getCurrentAdminController,
    getListAdmin,
    getRolesToAdminController,
    loginAdminController,
    updateAdminController
} from "../controllers/admin.controller.js";
import {
    authentication,
    authorization
} from "../middlewares/auth.middleware.js";
import {
    rolePrivileges
} from "../constants/role.constant.js";

const adminRoute = Router();

adminRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.admin.create),
    createAdminValidator,
    createAdminController
);

adminRoute.get(
    "/getRoles",
    authentication,
    authorization(rolePrivileges.admin.create),
    getRolesToAdminValidator,
    getRolesToAdminController
);

adminRoute.post(
    "/login",
    loginAdminValidator,
    loginAdminController
);

adminRoute.get(
    "/me",
    authentication,
    authorization(rolePrivileges.admin.read),
    getCurrentAdminController
);

adminRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.admin.read),
    getListAdminValidator,
    getListAdmin
);

adminRoute.post(
    "/generateRefreshToken",
    authentication,
    generateRefreshTokenController
);

adminRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.admin.update),
    updateAdminValidator,
    updateAdminController
);

adminRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.admin.read),
    getByIdController
);

export default adminRoute;