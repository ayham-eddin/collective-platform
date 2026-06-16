import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { getDashboardStatsController } from "./dashboard.controller";

export const dashboardRoutes = Router();

dashboardRoutes.get("/admin/stats", authenticate, getDashboardStatsController);
