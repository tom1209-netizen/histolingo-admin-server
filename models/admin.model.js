import mongoose, { Schema } from "mongoose";

const adminSchema = new mongoose.Schema({
    firstName: { type: String, require: true },
    lastName: { type: String, require: true },
    adminName: { type: String, require: true, unique: true },
    password: { type: String, require: true },
    roles: [{ type: Schema.Types.ObjectId, ref: "role" }],
    status: { type: Number, enum: [0, 1], require: true, default: 1 },
    salt: { type: String, require: true },
    supervisorId: { type: Schema.Types.ObjectId, ref: "admin", require: true }
});

export const adminModel = mongoose.model("admin", adminSchema);