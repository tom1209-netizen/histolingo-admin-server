import mongoose from "mongoose";
const { Schema, model } = mongoose;

const topicSchema = new Schema({
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
        enum: [0, 1],
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