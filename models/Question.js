import mongoose from "mongoose";
const { Schema, model } = mongoose;

const baseOptions = {
    discriminatorKey: "questionType",
    collection: "questions",
};

const questionSchema = new Schema(
    {
        topicId: {
            type: Schema.Types.ObjectId,
            ref: "Topic",
            require: true,
        },
        dateOfBirth: {
            type: Date,
            require: true,
        },
        questionType: {
            type: Number,
            enum: [0, 1, 2, 3],
            require: true,
        },
        ask: {
            type: String,
            maxlength: 65000,
            required: true,
        },
    },
    baseOptions
);

const BaseQuestion = model("BaseQuestion", questionSchema);

// True/False Question
const trueFalseSchema = new Schema({
    correct: {
        type: Boolean,
        required: true,
    },
});

// Multiple Choice Question
const multipleChoiceSchema = new Schema({
    answers: {
        type: [String],
        required: true,
    },
    correct: {
        type: Number,
        enum: [0, 1, 2, 3],
        required: true,
    },
});

// Matching Question
const matchingSchema = new Schema({
    leftColumn: {
        type: [String],
        required: true,
    },
    rightColumn: {
        type: [String],
        required: true,
    },
    corrects: {
        type: [Number],
        required: true,
    },
});

// Fill-in-the-Blank Question
const fillInTheBlankSchema = new Schema({
    corrects: {
        type: [String],
        required: true,
    },
});

const TrueFalseQuestion = BaseQuestion.discriminator("0", trueFalseSchema);
const MultipleChoiceQuestion = BaseQuestion.discriminator(
    "1",
    multipleChoiceSchema
);
const MatchingQuestion = BaseQuestion.discriminator("2", matchingSchema);
const FillInTheBlankQuestion = BaseQuestion.discriminator(
    "3",
    fillInTheBlankSchema
);

export {
    BaseQuestion,
    TrueFalseQuestion,
    MultipleChoiceQuestion,
    MatchingQuestion,
    FillInTheBlankQuestion,
};
