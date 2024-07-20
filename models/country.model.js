import mongoose from "mongoose";
const { Schema, model } = mongoose;

const countrySchema = new Schema({
    name: {
        type: String,
        require: true,
        maxLength: 250,
    },
    description: {
        type: String,
        require: true,
        maxLength: 1000,
    },
    image: {
        type: String,
        require: true,
        maxLength: 1000,
    },
    status: {
        type: Number,
        enum: [0, 1],
        require: true,
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

const Country = model("Country", countrySchema);

export default Country;
