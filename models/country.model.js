import mongoose from "mongoose";
const { Schema, model } = mongoose;

const countrySchema = new Schema(
    {
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
        localeData: {
            type: Schema.Types.Mixed,
        }
    },
    { timestamps: true }
);

const Country = model("Country", countrySchema);

export default Country;
