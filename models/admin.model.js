import mongoose, { Schema } from "mongoose";
import { adminStatus } from "../constants/admin.constant.js";

const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        require: true,
        unique: true
    },
    firstName: {
        type: String,
        require: true
    },
    lastName: {
        type: String,
        require: true
    },
    // adminName: { type: String, require: true, unique: true },
    password: {
        type: String,
        require: true
    },
    roles: [{
        type: Schema.Types.ObjectId,
        ref: "role"
    }],
    status: {
        type: Number,
        enum: [adminStatus.active, adminStatus.inactive],
        require: true,
        default: adminStatus.active
    },
    salt: {
        type: String,
        require: true
    },
    supervisorId: {
        type: Schema.Types.ObjectId,
        ref: "admin",
        require: true
    }
});

export const adminModel = mongoose.model("admin", adminSchema);