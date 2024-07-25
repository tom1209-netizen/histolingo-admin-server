import mongoose from "mongoose";
const { Schema, model } = mongoose;

const languageSchema = new Schema({
    name: {
        type: String,
        maxLength: 20,
        required: true,
    },
    label: {
        type: String,
        required: true,
        maxLength: 250
    },
    content: {
        type: Schema.Types.Mixed,
        required: true,
    },
})

const Language = model("Language", languageSchema);

export default Language;