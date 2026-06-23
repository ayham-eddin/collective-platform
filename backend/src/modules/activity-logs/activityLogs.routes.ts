import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requireSuperAdmin } from "../../middleware/permission.middleware";
import { getActivityLogsController } from "./activityLogs.controller";

export const activityLogRoutes = Router();

activityLogRoutes.get(
  "/admin",
  authenticate,
  requireSuperAdmin,
  getActivityLogsController,
);
