import { Router } from "express";
import { createAdminValidator, loginAdminValidator, updateAdminValidator, getListAdminValidator } from "../middlewares/admin.middleware.js";
import { createAdminController, getByIdController, getCurrentAdminController, getListAdmin, loginAdminController, updateAdminController } from "../controllers/admin.controller.js";
import { authentication, authorization } from "../middlewares/auth.middleware.js";
import { rolePrivileges } from "../constants/role.constant.js";

const adminRoute = Router();

adminRoute.post("/", authentication, authorization(rolePrivileges.admin.create), createAdminValidator, createAdminController);
adminRoute.post("/login", loginAdminValidator, loginAdminController);
adminRoute.get("/me", authentication, authorization(rolePrivileges.admin.read), getCurrentAdminController);
adminRoute.patch("/:id", authentication, authorization(rolePrivileges.admin.update), updateAdminValidator, updateAdminController);
adminRoute.get("/", authentication, authorization(rolePrivileges.admin.read), getListAdminValidator, getListAdmin);
adminRoute.get("/:id", authentication, authorization(rolePrivileges.admin.read), getByIdController);
adminRoute.post("/generateRefreshToken", );

export default adminRoute;