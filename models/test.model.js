import mongoose from "mongoose";
import { testStatus } from "../constants/test.constant.js";
const { Schema, model } = mongoose;

const testSchema = new Schema(
    {
        name: {
            type: String,
            require: true,
            maxLength: 250,
        },
        createdBy: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            require: true,
        },
        questionNumber: {
            type: Number,
            min: 1,
            max: 100,
            require: true,
        },
        topicId: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            require: true,
        },
        countryId: {
            type: Schema.Types.ObjectId,
            ref: "Country",
            require: true,
        },
        status: {
            type: Number,
            enum: [testStatus.inactive, testStatus.active],
            default: testStatus.active,
            require: true,
        },
        questionsId: [
            {
                type: Schema.Types.ObjectId,
                ref: "BaseQuestion",
                required: true,
            },
        ],
        localeData: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    { timestamps: true }
);

const Test = model("Test", testSchema);

export default Test;