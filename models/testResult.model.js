import mongoose from "mongoose";
const { Schema, model } = mongoose;

const testResultSchema = new Schema(
    {
        playerId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
        testId: {
            type: Schema.Types.ObjectId,
            ref: "Test",
            required: true,
        },
        score: {
            type: Number,
            required: true,
        },
        answers: [
            {
                questionId: {
                    type: Schema.Types.ObjectId,
                    ref: "BaseQuestion",
                    required: true,
                },
                playerAnswer: {
                    type: Schema.Types.Mixed,
                    required: true,
                },
                isCorrect: {
                    type: Boolean,
                    required: true,
                },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
    },
    { timestamps: true }
);

const TestResult = model("TestResult", testResultSchema);

export default TestResult;
