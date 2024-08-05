import mongoose from "mongoose";
import { countryStatus } from "../constants/country.constant.js";
const { Schema, model } = mongoose;

const countrySchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            maxLength: 250,
        },
        description: {
            type: String,
            require: true,
            maxLength: 1000,
        },
        image: {
            type: String,
            require: true,
            maxLength: 1000,
        },
        status: {
            type: Number,
            enum: [countryStatus.active, countryStatus.inactive],
            default: countryStatus.active,
            require: true,
        },
        localeData: {
            type: Schema.Types.Mixed,
        }
    },
    { timestamps: true }
);

const Country = model("Country", countrySchema);

export default Country;
