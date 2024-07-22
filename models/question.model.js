import mongoose from "mongoose";
import { questionType, answer } from "../constants/question.constant.js";
import { languageField, languageArrayField } from "../utils/language.utils";
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
        countryId: {
            type: Schema.Types.ObjectId,
            ref: "Country",
            require: true,
        },
        questionType: {
            type: Number,
            enum: [questionType.trueFalse, questionType.multipleChoice, questionType.matching, questionType.fillInTheBlank],
            require: true,
        },
        ask: languageField(650000),
        createdAt: {
            type: Date,
            require: true,
        },
        updatedAt: {
            type: Date,
            require: true,
        }
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
    corrects: languageArrayField,
    correct: {
        type: Number,
        enum: [answer.a, answer.b, answer.c, answer.d],
        required: true,
    },
});

// Matching Question
const matchingSchema = new Schema({
    leftColumn: languageArrayField,
    rightColumn: languageArrayField,
    corrects: {
        type: [[Number]],
        required: true,
    },
});

// Fill-in-the-Blank Question
const fillInTheBlankSchema = new Schema({
    corrects: languageArrayField,
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
