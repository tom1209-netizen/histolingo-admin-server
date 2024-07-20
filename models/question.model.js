import mongoose from "mongoose";
import { questionType, answer } from "../constants/question.constant";
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
<<<<<<< HEAD
    corrects: languageArrayField,
    correct: {
        type: Number,
        enum: [answer.a, answer.b, answer.c, answer.d],
=======
    answers: {
        type: [String],
        required: true,
    },
    correct: {
        type: Number,
        enum: [0, 1, 2, 3],
>>>>>>> cca1f6bebe14681c917c2dfad8d86a1d054685b0
        required: true,
    },
});

// Matching Question
const matchingSchema = new Schema({
<<<<<<< HEAD
    leftColumn: languageArrayField,
    rightColumn: languageArrayField,
    corrects: {
        type: [[Number]],
=======
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
>>>>>>> cca1f6bebe14681c917c2dfad8d86a1d054685b0
        required: true,
    },
});

// Fill-in-the-Blank Question
const fillInTheBlankSchema = new Schema({
<<<<<<< HEAD
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
=======
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
>>>>>>> cca1f6bebe14681c917c2dfad8d86a1d054685b0
    fillInTheBlankSchema
);

export {
    BaseQuestion,
    TrueFalseQuestion,
    MultipleChoiceQuestion,
    MatchingQuestion,
    FillInTheBlankQuestion,
};
