import { Router } from "express";
import { createAdminValidator, loginAdminValidator, updateAdminValidator, getListAdminValidator } from "../middlewares/admin.middleware.js";
import { createAdminController, getByIdController, getCurrentAdminController, getListAdmin, loginAdminController, updateAdminController } from "../controllers/admin.controller.js";
import { authentication, authorization } from "../middlewares/auth.middleware.js";
import { rolePrivileges } from "../constants/role.constant.js";

const adminRoute = Router();

adminRoute.post("/create", authentication, authorization(rolePrivileges.admin.create), createAdminValidator, createAdminController);
adminRoute.post("/login", loginAdminValidator, loginAdminController);
adminRoute.get("/getCurrent", authentication, authorization(rolePrivileges.admin.read), getCurrentAdminController);
adminRoute.put("/update", authentication, authorization(rolePrivileges.admin.update), updateAdminValidator, updateAdminController);
adminRoute.get("/getList", authentication, authorization(rolePrivileges.admin.read), getListAdminValidator, getListAdmin);
adminRoute.get("/getById/:id", authentication, authorization(rolePrivileges.admin.read), getByIdController);

export default adminRoute;