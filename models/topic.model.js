import mongoose from "mongoose";
import { topicStatus } from "../constants/topic.constant";
import { languageField } from "../utils/language.utils";
const { Schema, model } = mongoose;

const topicSchema = new Schema({
    name: languageField(250),
    description: languageField(1000),
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
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
})

const Topic = model("Topic", topicSchema);

export default Topic;