import mongoose from "mongoose";
import { documentationStatus } from "../constants/documentation.constant.js";
const { Schema, model } = mongoose;

const documentationSchema = new Schema(
    {
        source: {
            type: String,
            required: true,
            maxLength: 250,
        },
        name: {
            type: String,
            required: true,
            maxLength: 150,
        },
        content: {
            type: String,
            required: true,
            maxLength: 1000,
        },
        topicId: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            required: true,
        },
        countryId: {
            type: Schema.Types.ObjectId,
            ref: "Country",
            required: true,
        },
        image: {
            type: String,
            require: true,
            maxLength: 1000,
        },
        status: {
            type: Number,
            enum: [documentationStatus.inactive, documentationStatus.active],
            default: documentationStatus.active,
            required: true,
        },
        localeData: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    { timestamps: true }
)

const Documentation = model("Documentation", documentationSchema);

export default Documentation;