import mongoose from "mongoose";
const { Schema, model } = mongoose;

const documentationSchema = new Schema({
    source: {
        type: String,
        required: true,
        maxLengthL: 250,
    },
    name: {
        type: String,
        required: true,
        maxLength: 250,
    },
    content: {
        type: String,
        required: true,
        maxLength: 1000,
    },
    status: {
        type: Number,
        enum: [0, 1],
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

const Documentation = model("Documentation", documentationSchema);

export default Documentation;