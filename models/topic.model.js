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
<<<<<<< HEAD
        enum: [topicStatus.inactive, topicStatus.active],
        default: topicStatus.active,
=======
        enum: [0, 1],
>>>>>>> cca1f6bebe14681c917c2dfad8d86a1d054685b0
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