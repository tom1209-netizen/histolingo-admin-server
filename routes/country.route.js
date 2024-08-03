import { Router } from "express";
import { authentication, authorization } from "../middlewares/auth.middleware.js";
import { rolePrivileges } from "../constants/role.constant.js";
import { createCountryValidator, getListCountryValidator, updateCountryValidator } from "../middlewares/country.middleware.js";
import { createCountryController, getCountryByIdController, getListCountryController, updateCountryController } from "../controllers/country.controller.js";

const countryRoute = Router();

countryRoute.post("/create", authentication, authorization(rolePrivileges.country.create), createCountryValidator, createCountryController);
countryRoute.patch("/update/:id", authentication, authorization(rolePrivileges.country.update), updateCountryValidator, updateCountryController);
countryRoute.get("/getById/:id", authentication, authorization(rolePrivileges.country.read), getCountryByIdController);
countryRoute.get("/getList", authentication, authorization(rolePrivileges.country.read), getListCountryValidator, getListCountryController);

export default countryRoute;