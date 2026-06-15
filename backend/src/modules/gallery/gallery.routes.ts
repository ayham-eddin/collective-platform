import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  createGalleryImageController,
  deleteGalleryImageController,
  getAdminGalleryImagesController,
  getGalleryImageByIdController,
  getPublicGalleryImagesController,
  updateGalleryImageController,
} from "./gallery.controller";

export const galleryRoutes = Router();

galleryRoutes.get("/public", getPublicGalleryImagesController);
galleryRoutes.get("/public/:id", getGalleryImageByIdController);

galleryRoutes.get(
  "/admin",
  authenticate,
  requirePermission("gallery", "read"),
  getAdminGalleryImagesController,
);

galleryRoutes.post(
  "/admin",
  authenticate,
  requirePermission("gallery", "create"),
  createGalleryImageController,
);

galleryRoutes.put(
  "/admin/:id",
  authenticate,
  requirePermission("gallery", "update"),
  updateGalleryImageController,
);

galleryRoutes.delete(
  "/admin/:id",
  authenticate,
  requirePermission("gallery", "delete"),
  deleteGalleryImageController,
);
