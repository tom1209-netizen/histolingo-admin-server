import { Schema, model } from "mongoose";
import { roleStatus } from "../constants/role.constant.js";

const roleSchema = new Schema({
    name: {
        type: String,
        required: true,
        maxLength: 250,
    },
    status: {
        type: Number,
        enum: [roleStatus.inactive, roleStatus.active],
        default: roleStatus.active,
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
});

const Role = model("Role", roleSchema);

export default Role;
