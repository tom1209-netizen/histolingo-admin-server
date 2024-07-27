import { Router } from "express";
import { createRoleValidator } from "../middlewares/role.middleware.js";
import { createRoleController } from "../controllers/role.controller.js";

const roleRoute = Router();

roleRoute.post("/createRole", createRoleValidator, createRoleController);

export default roleRoute;