import mongoose from "mongoose";
import {answer, questionStatus, questionType} from "../constants/question.constant.js";

const {Schema, model} = mongoose;

const baseOptions = {
    discriminatorKey: "questionType",
    collection: "questions",
    timestamps: true,
};

const questionSchema = new Schema(
    {
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
        questionType: {
            type: Number,
            enum: [questionType.trueFalse, questionType.multipleChoice, questionType.matching, questionType.fillInTheBlank],
            required: true,
        },
        ask: {
            type: String,
            required: true,
        },
        status: {
            type: Number,
            enum: [questionStatus.active, questionStatus.inactive],
            default: questionStatus.active,
        },
        explanation: {
            type: {
                text: {type: String, required: true},
                imageUrl: {type: String, required: true}
            }
        },
        localeData: {
            type: Schema.Types.Mixed,
            required: true,
        }
    },
    baseOptions
);

const BaseQuestion = model("BaseQuestion", questionSchema);

// True/False Question
const trueFalseSchema = new Schema({
    answer: {
        type: Boolean,
        required: true,
    },
});

// Multiple Choice Question
const multipleChoiceSchema = new Schema({
    options: [String],
    answer: {
        type: Number,
        enum: [answer.a, answer.b, answer.c, answer.d],
        required: true,
    },
});

// Matching Question
const matchingSchema = new Schema({
    answer: {
        type: [Object],
        required: true,
    },
});

// Fill-in-the-Blank Question
const fillInTheBlankSchema = new Schema({
    answer: [String],
});

const TrueFalseQuestion = BaseQuestion.discriminator(questionType.trueFalse, trueFalseSchema);
const MultipleChoiceQuestion = BaseQuestion.discriminator(
    questionType.multipleChoice,
    multipleChoiceSchema
);
const MatchingQuestion = BaseQuestion.discriminator(questionType.matching, matchingSchema);
const FillInTheBlankQuestion = BaseQuestion.discriminator(
    questionType.fillInTheBlank,
    fillInTheBlankSchema
);

export {
    BaseQuestion,
    TrueFalseQuestion,
    MultipleChoiceQuestion,
    MatchingQuestion,
    FillInTheBlankQuestion,
};