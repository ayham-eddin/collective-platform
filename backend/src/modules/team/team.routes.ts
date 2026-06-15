import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";
import { requirePermission } from "../../middleware/permission.middleware";
import {
  createTeamMemberController,
  deleteTeamMemberController,
  getAdminTeamMembersController,
  getPublicTeamMembersController,
  updateTeamMemberController,
} from "./team.controller";

export const teamRoutes = Router();

teamRoutes.get("/public", getPublicTeamMembersController);

teamRoutes.get(
  "/admin",
  authenticate,
  requirePermission("team", "read"),
  getAdminTeamMembersController,
);

teamRoutes.post(
  "/admin",
  authenticate,
  requirePermission("team", "create"),
  createTeamMemberController,
);

teamRoutes.put(
  "/admin/:id",
  authenticate,
  requirePermission("team", "update"),
  updateTeamMemberController,
);

teamRoutes.delete(
  "/admin/:id",
  authenticate,
  requirePermission("team", "delete"),
  deleteTeamMemberController,
);
