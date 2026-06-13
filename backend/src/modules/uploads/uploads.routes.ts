import { Router } from "express";
import multer from "multer";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  uploadMultipleImagesController,
  uploadSingleImageController,
} from "./uploads.controller";

export const uploadRoutes = Router();

const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (request, file, callback) => {
    if (!file.mimetype.startsWith("image/")) {
      callback(new Error("Only image files are allowed"));
      return;
    }

    callback(null, true);
  },
});

uploadRoutes.post(
  "/single",
  authenticate,
  requirePermission("gallery", "create"),
  upload.single("image"),
  uploadSingleImageController,
);

uploadRoutes.post(
  "/multiple",
  authenticate,
  requirePermission("gallery", "create"),
  upload.array("images", 10),
  uploadMultipleImagesController,
);
