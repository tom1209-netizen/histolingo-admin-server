import mongoose from "mongoose";
import { feedbackStatus } from "../constants/feedback.constant.js";
const { Schema, model } = mongoose;

const feedbackSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    content: {
        type: String,
        required: true,
        maxLength: 1000,
    },
    testId: {
        type: Schema.Types.ObjectId,
        ref: "Test",
        required: true,
    },
    status: {
        type: Number,
        enum: [feedbackStatus.inactive, feedbackStatus.active],
        default: feedbackStatus.active,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
})

const Feedback = model("Feedback", feedbackSchema);

export default Feedback;