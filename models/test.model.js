import mongoose from "mongoose";
import { testStatus } from "../constants/test.constant";
const { Schema, model } = mongoose;

const testSchema = new Schema({
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
<<<<<<< HEAD
        enum: [testStatus.inactive, testStatus.active],
        default: testStatus.active,
=======
        enum: [0, 1],
>>>>>>> cca1f6bebe14681c917c2dfad8d86a1d054685b0
        require: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
});

const Test = model("Test", testSchema);

export default Test;