import Language from "./models/language.model.js";

export const localeData = {};

export const initLocaleData = async () => {
    try {
        const languages = await Language.find();
        for (let language of languages) {
            localeData[language.name] = language.content;
        }
    } catch (error) {
        console.error(error);
    }
};
