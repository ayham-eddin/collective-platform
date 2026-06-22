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

const getCleanPath = (originalUrl: string) => {
  return originalUrl.split("?")[0] || originalUrl;
};

const getModuleFromPath = (originalUrl: string) => {
  const cleanPath = getCleanPath(originalUrl);
  const pathParts = cleanPath.split("/").filter(Boolean);

  if (pathParts[0] === "api" && pathParts[1]) {
    return pathParts[1];
  }

  return "unknown";
};

const getTargetIdFromPath = (originalUrl: string) => {
  const cleanPath = getCleanPath(originalUrl);
  const pathParts = cleanPath.split("/").filter(Boolean);
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

  const cleanPath = getCleanPath(request.originalUrl);

  if (!cleanPath.startsWith("/api/")) {
    return false;
  }

  if (cleanPath.includes("/auth/login")) {
    return false;
  }

  if (cleanPath.includes("/contact/public")) {
    return false;
  }

  if (cleanPath.includes("/uploads/")) {
    return false;
  }

  return true;
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
      console.warn("[ACTIVITY_LOG_SKIPPED] Missing admin id", {
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
      });
      return;
    }

    if (response.statusCode >= 400) {
      console.warn("[ACTIVITY_LOG_SKIPPED] Request failed", {
        adminId: request.admin.adminId,
        method: request.method,
        path: request.originalUrl,
        statusCode: response.statusCode,
      });
      return;
    }

    void ActivityLog.create({
      adminId: request.admin.adminId,
      action: getActionFromMethod(request.method),
      module: getModuleFromPath(request.originalUrl),
      method: request.method,
      path: request.originalUrl,
      statusCode: response.statusCode,
      targetId: getTargetIdFromPath(request.originalUrl),
      ip: request.ip,
      userAgent:
        typeof request.headers["user-agent"] === "string"
          ? request.headers["user-agent"]
          : "",
    })
      .then(() => {
        console.log("[ACTIVITY_LOG_CREATED]", {
          adminId: request.admin?.adminId,
          action: getActionFromMethod(request.method),
          module: getModuleFromPath(request.originalUrl),
          path: request.originalUrl,
        });
      })
      .catch((error: unknown) => {
        console.error("[ACTIVITY_LOG_ERROR]", error);
      });
  });

  next();
};
