import { localeData } from "../localization.js";

export const t = (language, path, values = {}) => {
    let currentLocaleData = localeData[language];

    const parts = path.split(".");
    let target = currentLocaleData;
    for (const key of parts) {
        if (target[key]) {
            target = target[key];
        } else {
            target = null;
            break;
        }
    }
    if (typeof target === "string") {
        for (const key in values) {
            target = target.replace(new RegExp(`{{${key}}}`, "g"), values[key]);
        }
    }
    return target;
};

export const applyRequestContentLanguage = (req) => {
    const contentLanguage = req.contentLanguage;
    return (path, value = {}) => {
        return t(contentLanguage, path, value);
    }
};