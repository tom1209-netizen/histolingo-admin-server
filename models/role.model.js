import mongoose, { Schema } from "mongoose";

const roleSchema = new Schema({
    name: { type: String, required: true },
    status: { type: Number, enum: [0, 1], required: true, default: 1 },
    permissions: { type: [String], required: true },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

// Update when document save
roleSchema.pre("save", function (next) {
    this.updatedAt = Date.now();
    next();
});

export const roleModel = mongoose.model("role", roleSchema);