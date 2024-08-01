import { localeData } from "../localization.js";

export const loadContentLanguage = async (req, res, next) => {
  try {
    let contentLanguage = req.header("Content-Language");

    if (!contentLanguage) {
      contentLanguage = "en-US";
    }
    if (!localeData[contentLanguage]) {
      throw new Error("System does not support this language");
    }
    req.contentLanguage = contentLanguage;
    next();
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};