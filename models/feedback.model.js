import mongoose from "mongoose";
const { Schema, model } = mongoose;

const feedbackSchema = new Schema({
    createdBy: {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
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
        enum: [0, 1],
        required: true,
    },
})

const Feedback = model("Feedback", feedbackSchema);

export default Feedback;