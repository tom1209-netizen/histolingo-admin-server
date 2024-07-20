import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "admin",
        require: true,
        unique: true
    },
    refreshToken: {
        type: String,
        unique: true
    }
});

export const tokenModel = mongoose.model("token", tokenSchema)