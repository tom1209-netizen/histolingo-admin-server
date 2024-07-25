import mongoose from "mongoose";
const { Schema, model } = mongoose;

const countrySchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            maxLength: 150,
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
        status: {
            type: Number,
            enum: [0, 1],
            required: true,
        },
        localeData: {
            type: Schema.Types.Mixed,
            required: true
        }
    },
    { timestamps: true }
);

const Country = model("Country", countrySchema);

export default Country;
