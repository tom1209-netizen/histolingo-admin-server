import { Router } from "express";
import { createAdminValidator, loginAdminValidator, updateAdminValidator, getListAdminValidator } from "../middlewares/admin.middleware.js";
import { createAdminController, getByIdController, getCurrentAdminController, getListAdmin, loginAdminController, updateAdminController } from "../controllers/admin.controller.js";
import { authentication } from "../middlewares/auth.middleware.js";

const adminRoute = Router();

adminRoute.post("/create", createAdminValidator, createAdminController);
adminRoute.post("/login", loginAdminValidator, loginAdminController);
adminRoute.get("/getCurrent", authentication, getCurrentAdminController);
adminRoute.put("/update", authentication, updateAdminValidator, updateAdminController);
adminRoute.get("/getList", authentication, getListAdminValidator, getListAdmin);
adminRoute.get("/getById/:id", authentication, getByIdController);

export default adminRoute;