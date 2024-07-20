import mongoose, { Schema } from "mongoose";
import { adminStatus } from "../constants/admin.constant.js";

const roleSchema = new Schema({
    name: {
        type: String,
        required: true
    },
    status: {
        type: Number,
        enum: [adminStatus.active, adminStatus.inactive],
        required: true,
        default: 1
    },
    permissions: {
        type: [String],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update when document save
roleSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export const roleModel = mongoose.model("role", roleSchema);