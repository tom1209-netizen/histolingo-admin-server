import { Router } from "express";
import { authentication, authorization } from "../middlewares/auth.middleware.js";
import { rolePrivileges } from "../constants/role.constant.js";

const documentationRoute = Router();

documentationRoute.post("/create", authentication, authorization(rolePrivileges.documentation.create))

export default documentationRoute;