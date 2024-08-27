import { uploadImageToFirebase } from "../services/firebase.service.js";
import { applyRequestContentLanguage } from "../utils/localization.util.js";

export const uploadImage = async (req, res) => {
  const __ = applyRequestContentLanguage(req)

  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({
        success: false,
        message: __("message.fileRequired"),
        status: 400,
        data: null,
      })
    }

    const fileUrl = await uploadImageToFirebase(file);
    res.status(200).json({
        success: true,
        message: __("message.uploadSuccess"),
        status: 200,
        data: {
            fileUrl
        }
    })
  } catch (error) {
    return res.status(error.status || 500).json({
      success: false,
      message: error.message || __("error.internalServerError"),
      status: error.status || 500,
      data: error.data || null,
    })
  }
};