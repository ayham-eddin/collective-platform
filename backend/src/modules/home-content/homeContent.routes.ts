import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  getAdminHomeContentController,
  getPublicHomeContentController,
  updateHomeContentController,
} from "./homeContent.controller";

export const homeContentRoutes = Router();

homeContentRoutes.get("/public", getPublicHomeContentController);

homeContentRoutes.get(
  "/admin",
  authenticate,
  requirePermission("home-content", "read"),
  getAdminHomeContentController,
);

homeContentRoutes.put(
  "/admin",
  authenticate,
  requirePermission("home-content", "update"),
  updateHomeContentController,
);
