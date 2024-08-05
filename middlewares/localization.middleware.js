import { localeData } from "../localization.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const loadContentLanguage = async (req, res, next) => {
  const __ = applyRequestContentLanguage(req);

  try {
    let contentLanguage = req.header("Content-Language");

    if (!contentLanguage) {
      contentLanguage = "en-US";
    }
    if (!localeData[contentLanguage]) {
      return res.status(400).json({ message: __("error.unsupportedLanguage") });
    }
    req.contentLanguage = contentLanguage;
    next();
  } catch (error) {
    res.status(500).json({ message: __("error.internalServerError") });
  }
};