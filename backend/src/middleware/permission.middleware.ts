import { NextFunction, Response } from "express";
import { AuthRequest } from "./auth.middleware";
import { Role } from "../database/models/Role";

export const requirePermission =
  (
    moduleName: string,
    action: "create" | "read" | "update" | "delete" | "publish",
  ) =>
  async (
    request: AuthRequest,
    response: Response,
    next: NextFunction,
  ): Promise<void> => {
    if (!request.admin) {
      response.status(401).json({
        success: false,
        message: "Unauthorized",
      });

      return;
    }

    const role = await Role.findById(request.admin.roleId);

    if (!role) {
      response.status(403).json({
        success: false,
        message: "Role not found",
      });

      return;
    }

    if (role.isSuperAdmin) {
      next();
      return;
    }

    const permission = role.permissions.find(
      (item) => item.module === moduleName,
    );

    const allowed = permission?.actions.includes(action);

    if (!allowed) {
      response.status(403).json({
        success: false,
        message: "Insufficient permissions",
      });

      return;
    }

    next();
  };
