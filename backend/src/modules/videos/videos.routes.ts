import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  createVideoController,
  deleteVideoController,
  getAdminVideosController,
  getPublicVideosController,
  getVideoByIdController,
  updateVideoController,
} from "./videos.controller";

export const videoRoutes = Router();

videoRoutes.get("/public", getPublicVideosController);
videoRoutes.get("/public/:id", getVideoByIdController);

videoRoutes.get(
  "/admin",
  authenticate,
  requirePermission("videos", "read"),
  getAdminVideosController,
);

videoRoutes.post(
  "/admin",
  authenticate,
  requirePermission("videos", "create"),
  createVideoController,
);

videoRoutes.put(
  "/admin/:id",
  authenticate,
  requirePermission("videos", "update"),
  updateVideoController,
);

videoRoutes.delete(
  "/admin/:id",
  authenticate,
  requirePermission("videos", "delete"),
  deleteVideoController,
);
