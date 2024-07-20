import mongoose from "mongoose";
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
    documentationIds: {
        type: [Schema.Types.ObjectId],
        ref: "Documentation",
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
        enum: [0, 1],
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