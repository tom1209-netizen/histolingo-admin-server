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
            default: 0,
        },
        isFinish: {
            type: Boolean,
            default: false,
        },
        answers: [
            {
                question: {
                    type: Schema.Types.Mixed,
                },
                playerAnswer: {
                    type: Schema.Types.Mixed,
                    default: null,
                },
                isCorrect: {
                    type: Boolean,
                    default: false,
                },
            },
        ],
        createdAt: {
            type: Date,
            default: Date.now,
        },
        finishAt: {
            type: Date,
        }
    },
    { timestamps: true }
);

const TestResult = model("TestResult", testResultSchema);

export default TestResult;
