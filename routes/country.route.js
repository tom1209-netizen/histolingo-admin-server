import { Router } from "express";
import {
    authentication,
    authorization

} from "../middlewares/auth.middleware.js";
import {
    rolePrivileges

} from "../constants/role.constant.js";
import {
    createCountryValidator,
    getListCountryValidator,
    updateCountryValidator

} from "../middlewares/country.middleware.js";
import {
    createCountryController,
    getCountryByIdController,
    getListCountryController,
    updateCountryController

} from "../controllers/country.controller.js";

const countryRoute = Router();

countryRoute.post(
    "/",
    authentication,
    authorization(rolePrivileges.country.create),
    createCountryValidator,
    createCountryController
);
countryRoute.patch(
    "/:id",
    authentication,
    authorization(rolePrivileges.country.update),
    updateCountryValidator,
    updateCountryController
);
countryRoute.get(
    "/:id",
    authentication,
    authorization(rolePrivileges.country.read),
    getCountryByIdController
);
countryRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.country.read),
    getListCountryValidator,
    getListCountryController
);

export default countryRoute;