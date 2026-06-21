import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  createEventController,
  deleteEventController,
  getAdminEventByIdController,
  getAdminEventsController,
  getEventBySlugController,
  getPublicEventsController,
  getPublicGroupedEventsController,
  updateEventController,
} from "./events.controller";

export const eventRoutes = Router();

eventRoutes.get("/public", getPublicEventsController);
eventRoutes.get("/public-grouped", getPublicGroupedEventsController);
eventRoutes.get("/public/:slug", getEventBySlugController);

eventRoutes.get(
  "/admin",
  authenticate,
  requirePermission("events", "read"),
  getAdminEventsController,
);

eventRoutes.get(
  "/admin/:id",
  authenticate,
  requirePermission("events", "read"),
  getAdminEventByIdController,
);

eventRoutes.post(
  "/admin",
  authenticate,
  requirePermission("events", "create"),
  createEventController,
);

eventRoutes.put(
  "/admin/:id",
  authenticate,
  requirePermission("events", "update"),
  updateEventController,
);

eventRoutes.delete(
  "/admin/:id",
  authenticate,
  requirePermission("events", "delete"),
  deleteEventController,
);
