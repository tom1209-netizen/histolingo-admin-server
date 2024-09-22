import { Router } from "express";
import {
    createAdminValidator,
    loginAdminValidator,
    updateAdminValidator,
    getAdminsValidator,
    getRolesToAdminValidator,
    resetAdminPasswordValidator
} from "../middlewares/admin.middleware.js";
import {
    createAdminController,
    getAdminController,
    getCurrentAdminController,
    getAdmins,
    getRolesToAdminController,
    loginAdminController,
    updateAdminController,
    resetAdminPasswordController
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

adminRoute.post(
    "/reset-password",
    authentication,
    resetAdminPasswordValidator,
    resetAdminPasswordController
)

adminRoute.get(
    "/me",
    authentication,
    getCurrentAdminController
);

adminRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.admin.read),
    getAdminsValidator,
    getAdmins
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
    getAdminController
);

export default adminRoute;