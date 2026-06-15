import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  getAdminSiteSettingsController,
  getPublicSiteSettingsController,
  updateSiteSettingsController,
} from "./settings.controller";

export const settingsRoutes = Router();

settingsRoutes.get("/public", getPublicSiteSettingsController);

settingsRoutes.get(
  "/admin",
  authenticate,
  requirePermission("settings", "read"),
  getAdminSiteSettingsController,
);

settingsRoutes.put(
  "/admin",
  authenticate,
  requirePermission("settings", "update"),
  updateSiteSettingsController,
);
