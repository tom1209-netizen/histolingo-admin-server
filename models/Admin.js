import mongoose from "mongoose";
const { Schema, model } = mongoose;

const adminSchema = new Schema({
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
    password: {
        type: String,
        required: true,
        maxlength: 250,
    },
    roles: [
        {
            type: Schema.Types.ObjectId,
            ref: "Role",
            required: true,
        },
    ],
    status: {
        type: Number,
        enum: [0, 1],
        required: true,
    },
    supervisorId: {
        type: Schema.Types.ObjectId,
        ref: "Admin",
        required: true,
    },
});

const Admin = model("Admin", adminSchema);

export default Admin;
