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
    getCountriesValidator,
    updateCountryValidator

} from "../middlewares/country.middleware.js";
import {
    createCountryController,
    getCountryController,
    getCountriesController,
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
    getCountryController
);
countryRoute.get(
    "/",
    authentication,
    authorization(rolePrivileges.country.read),
    getCountriesValidator,
    getCountriesController
);

export default countryRoute;