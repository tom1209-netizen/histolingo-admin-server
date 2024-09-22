import mongoose from "mongoose";
import { adminStatus } from "../constants/admin.constant.js";
const { Schema, model } = mongoose;

const adminSchema = new Schema(
    {
        firstName: {
            type: String,
            required: true,
            maxlength: 100,
        },
        lastName: {
            type: String,
            required: true,
            maxlength: 100,
        },
        adminName: {
            type: String,
            required: true,
            maxlength: 100,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
            maxlength: 250,
        },
        salt: {
            type: String,
            require: true
        },
        roles: [
            {
                type: Schema.Types.ObjectId,
                ref: "Role",
                required: true,
            },
        ],
        refreshToken: {
            type: String
        },
        status: {
            type: Number,
            enum: [adminStatus.inactive, adminStatus.active],
            required: true,
            default: adminStatus.active
        },
        supervisorId: {
            type: Schema.Types.ObjectId,
            ref: "Admin",
            required: true,
        },
    },
    { timestamps: true }
);

const Admin = model("Admin", adminSchema);

export default Admin;
