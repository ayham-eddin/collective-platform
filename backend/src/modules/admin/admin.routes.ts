import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  createAdminController,
  createRoleController,
  deleteAdminController,
  deleteRoleController,
  getAdminsController,
  getRolesController,
  updateAdminController,
  updateRoleController,
} from "./admin.controller";

export const adminRoutes = Router();

adminRoutes.get("/status", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Admin module is ready",
  });
});

adminRoutes.get("/profile", authenticate, (request, response) => {
  response.status(200).json({
    success: true,
    message: "Protected route works",
  });
});

adminRoutes.get(
  "/roles",
  authenticate,
  requirePermission("admins", "read"),
  getRolesController,
);

adminRoutes.post(
  "/roles",
  authenticate,
  requirePermission("admins", "create"),
  createRoleController,
);

adminRoutes.put(
  "/roles/:id",
  authenticate,
  requirePermission("admins", "update"),
  updateRoleController,
);

adminRoutes.delete(
  "/roles/:id",
  authenticate,
  requirePermission("admins", "delete"),
  deleteRoleController,
);

adminRoutes.get(
  "/",
  authenticate,
  requirePermission("admins", "read"),
  getAdminsController,
);

adminRoutes.post(
  "/",
  authenticate,
  requirePermission("admins", "create"),
  createAdminController,
);

adminRoutes.put(
  "/:id",
  authenticate,
  requirePermission("admins", "update"),
  updateAdminController,
);

adminRoutes.delete(
  "/:id",
  authenticate,
  requirePermission("admins", "delete"),
  deleteAdminController,
);
