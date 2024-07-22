export const languageField = (maxLength) => ({
    en: {
        type: String,
        required: true,
        maxLength,
    },
    vi: {
        type: String,
        required: true,
        maxLength,
    },
    jp: {
        type: String,
        required: true,
        maxLength,
    },
});

export const languageArrayField = {
    en: {
        type: [String],
        required: true,
    },
    vi: {
        type: [String],
        required: true,
    },
    jp: {
        type: [String],
        required: true,
    },
};