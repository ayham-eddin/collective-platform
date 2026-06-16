import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  createContactMessageController,
  deleteContactMessageController,
  getAdminContactMessagesController,
  updateContactMessageController,
} from "./contact.controller";

export const contactRoutes = Router();

contactRoutes.post("/public", createContactMessageController);

contactRoutes.get(
  "/admin",
  authenticate,
  requirePermission("contact", "read"),
  getAdminContactMessagesController,
);

contactRoutes.put(
  "/admin/:id",
  authenticate,
  requirePermission("contact", "update"),
  updateContactMessageController,
);

contactRoutes.delete(
  "/admin/:id",
  authenticate,
  requirePermission("contact", "delete"),
  deleteContactMessageController,
);
