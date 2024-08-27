import express from "express";
import { uploadImage } from "../controllers/upload.controller.js";
import multer from "multer";

const router = express.Router();

const upload = multer({ storage: multer.memoryStorage() });

router.post("/", upload.single("image"), uploadImage);

export default router;