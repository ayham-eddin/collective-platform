import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { ActivityAction, ActivityLog } from "../database/models/ActivityLog";
import { AuthRequest } from "./auth.middleware";

const getActionFromMethod = (method: string): ActivityAction => {
  if (method === "POST") return "create";
  if (method === "PUT" || method === "PATCH") return "update";
  if (method === "DELETE") return "delete";
  return "unknown";
};

const getModuleFromPath = (path: string) => {
  const pathParts = path.split("/").filter(Boolean);

  if (pathParts[0] === "api" && pathParts[1]) {
    return pathParts[1];
  }

  return "unknown";
};

const getTargetIdFromPath = (path: string) => {
  const pathParts = path.split("/").filter(Boolean);
  const lastPart = pathParts[pathParts.length - 1];

  if (!lastPart) {
    return undefined;
  }

  return Types.ObjectId.isValid(lastPart) ? lastPart : undefined;
};

const shouldTrackActivity = (request: Request) => {
  const isWriteRequest = ["POST", "PUT", "PATCH", "DELETE"].includes(
    request.method,
  );

  if (!isWriteRequest) {
    return false;
  }

  if (request.path.includes("/auth/login")) {
    return false;
  }

  if (request.path.includes("/contact/public")) {
    return false;
  }

  if (request.path.includes("/uploads/")) {
    return false;
  }

  return request.path.startsWith("/api/");
};

export const requestLogger = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const startedAt = Date.now();

  response.on("finish", () => {
    const duration = Date.now() - startedAt;

    console.log(
      `[REQUEST] ${request.method} ${request.originalUrl} ${response.statusCode} ${duration}ms`,
    );
  });

  next();
};

export const adminActivityLogger = (
  request: AuthRequest,
  response: Response,
  next: NextFunction,
): void => {
  response.on("finish", () => {
    if (!shouldTrackActivity(request)) {
      return;
    }

    if (!request.admin?.adminId) {
      return;
    }

    if (response.statusCode >= 400) {
      return;
    }

    void ActivityLog.create({
      adminId: request.admin.adminId,
      action: getActionFromMethod(request.method),
      module: getModuleFromPath(request.path),
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      targetId: getTargetIdFromPath(request.path),
      ip: request.ip,
      userAgent: request.headers["user-agent"],
    }).catch((error: unknown) => {
      console.error("[ACTIVITY_LOG_ERROR]", error);
    });
  });

  next();
};
