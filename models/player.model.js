import { model, Schema } from "mongoose";
import { playerStatus, rank, sex } from "../constants/player.constant.js";

const playerSchema = new Schema({
    fullName: {
        type: String,
        maxlength: 100,
        default: null,
    },
    dateOfBirth: {
        type: Date,
        default: null,
    },
    email: {
        type: String,
        required: true,
        unique: true,
        maxlength: 250,
    },
    phoneNumber: {
        type: String,
        maxlength: 20,
        default: null,
    },
    userName: {
        type: String,
        required: true,
        maxlength: 250,
        default: null,
    },
    password: {
        type: String,
        required: true,
        maxlength: 250,
        default: null,
    },
    avatar: {
        type: String,
        maxlength: 1000,
        default: null,
    },
    totalScore: {
        type: Number,
        default: null,
    },
    totalTime: {
        type: Number,
        default: null,
    },
    rank: {
        type: Number,
        enum: [rank.Beginner, rank.Intermediate, rank.Advanced, rank.Expert, rank.Master],
        default: rank.Beginner,
    },
    registrationDate: {
        type: Date,
        default: null,
    },
    status: {
        type: Number,
        enum: [playerStatus.active, playerStatus.inactive],
        default: playerStatus.active,
    },
    locale: {
        type: String,
        maxlength: 20,
        default: null,
    },
    sex: {
        type: Number,
        enum: [sex.female, sex.male],
        default: sex.male,
    }
});

const Player = model("Player", playerSchema);

export default Player;