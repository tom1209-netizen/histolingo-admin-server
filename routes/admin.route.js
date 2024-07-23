import { Router } from "express";
import { getAdminValidator, createAdminValidator, loginAdminValidator, updateAdminValidator } from "../middlewares/admin.middleware.js";
import { createAdminController, getCurrentAdminController, getListAdmin, loginAdminController, updateAdminController } from "../controllers/admin.controller.js";

const adminRoute = Router();

adminRoute.post("/createAdmin", createAdminValidator, createAdminController);
adminRoute.post("/login", loginAdminValidator, loginAdminController);
adminRoute.get("/getAdmin", getAdminValidator, getCurrentAdminController);
adminRoute.put("/updateAdmin", updateAdminValidator, updateAdminController);
adminRoute.get("/getListAdmin", getListAdmin);

export default adminRoute;