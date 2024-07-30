import { Router } from "express";
import { getAdminValidator, createAdminValidator, loginAdminValidator, updateAdminValidator, getListAdminValidator } from "../middlewares/admin.middleware.js";
import { createAdminController, getByIdController, getCurrentAdminController, getListAdmin, loginAdminController, updateAdminController } from "../controllers/admin.controller.js";

const adminRoute = Router();

adminRoute.post("/create", createAdminValidator, createAdminController);
adminRoute.post("/login", loginAdminValidator, loginAdminController);
adminRoute.get("/getCurrent", getAdminValidator, getCurrentAdminController);
adminRoute.put("/update", updateAdminValidator, updateAdminController);
adminRoute.get("/getList", getListAdminValidator, getListAdmin);
adminRoute.get("/getById/:id", getAdminValidator, getByIdController);

export default adminRoute;