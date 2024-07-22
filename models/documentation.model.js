import mongoose from "mongoose";
import { documentationStatus } from "../constants/documentation.constant.js";
import { languageField } from "../utils/language.utils.js";
const { Schema, model } = mongoose;

const documentationSchema = new Schema({
    source: {
        type: String,
        required: true,
        maxLength: 250,
    },
    name: languageField(250),
    content: languageField(1000),
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
    status: {
        type: Number,
        enum: [documentationStatus.inactive, documentationStatus.active],
        default: documentationStatus.active,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

const Documentation = model("Documentation", documentationSchema);

export default Documentation;