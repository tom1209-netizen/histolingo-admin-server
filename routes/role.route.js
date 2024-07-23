import { Router } from "express";
import {
    createRoleValidator,
    updateRoleValidator,
    getRoleValidator
} from "../middlewares/role.middleware.js";
import {
    createRoleController,
    getRolesController,
    getRoleController,
    updateRolesController
} from "../controllers/role.controller.js";

const roleRoute = Router();

roleRoute.post("/createRole", createRoleValidator, createRoleController);
roleRoute.get("/getRoles", getRolesController);
roleRoute.get("/getRole/:id", getRoleValidator, getRoleController);
roleRoute.put("/updateRole/:id", updateRoleValidator, updateRolesController);

export default roleRoute;