import mongoose from "mongoose";
import { topicStatus } from "../constants/topic.constant.js";
const { Schema, model } = mongoose;

const topicSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 250,
        },
        description: {
            type: String,
            required: true,
            maxLength: 1000,
        },
        image: {
            type: String,
            required: true,
            maxLength: 1000,
        },
        countryId: {
            type: Schema.Types.ObjectId,
            ref: "Country",
            required: true,
        },
        status: {
            type: Number,
            enum: [topicStatus.inactive, topicStatus.active],
            default: topicStatus.active,
            required: true,
        },
        localeData: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    { timestamps: true }
)

const Topic = model("Topic", topicSchema);

export default Topic;