import { Router } from "express";
import multer from "multer";
import { authenticate } from "../../middleware/auth.middleware";
import {
  uploadMultipleImagesController,
  uploadSingleImageController,
  uploadSingleVideoController,
} from "./uploads.controller";

export const uploadRoutes = Router();

const storage = multer.memoryStorage();

const imageUpload = multer({
  storage,
  limits: {
    fileSize: 15 * 1024 * 1024,
  },
  fileFilter: (request, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image files are allowed"));
      return;
    }

    callback(null, true);
  },
});

const videoUpload = multer({
  storage,
  limits: {
    fileSize: 200 * 1024 * 1024,
  },
  fileFilter: (request, file, callback) => {
    if (!file.mimetype.startsWith("video/")) {
      callback(new Error("Only video files are allowed"));
      return;
    }

    callback(null, true);
  },
});

uploadRoutes.post(
  "/single",
  authenticate,
  imageUpload.single("image"),
  uploadSingleImageController,
);

uploadRoutes.post(
  "/multiple",
  authenticate,
  imageUpload.array("images", 10),
  uploadMultipleImagesController,
);

uploadRoutes.post(
  "/video",
  authenticate,
  videoUpload.single("video"),
  uploadSingleVideoController,
);
