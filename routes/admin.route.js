import { Router } from "express";
import { createAdminValidator, loginAdminValidator } from "../middlewares/admin.middleware.js";
import { createAdminController, loginAdminController } from "../controllers/admin.controller.js";

const adminRoute = Router();

adminRoute.post("/admin", createAdminValidator, createAdminController);
adminRoute.post("/login", loginAdminValidator, loginAdminController);

export default adminRoute;