import mongoose from "mongoose";
const { Schema, model } = mongoose;

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 250,
    },
    status: {
        type: Number,
        enum: [0, 1],
        required: true,
    },
    permissions: {
        type: [String],
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

const role = model("Role", roleSchema);

export default role;