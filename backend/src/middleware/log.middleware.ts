import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { ActivityAction, ActivityLog } from "../database/models/ActivityLog";
import { AuthRequest } from "./auth.middleware";

type JsonResponseBody = {
  success?: boolean;
  data?: unknown;
};

type RecordValue = string | number | boolean | null | undefined | unknown[];

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

const isRecord = (value: unknown): value is Record<string, unknown> => {
  return typeof value === "object" && value !== null && !Array.isArray(value);
};

const getStringValue = (value: unknown) => {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
};

const getLocalizedTitle = (value: unknown) => {
  if (!isRecord(value)) {
    return undefined;
  }

  return (
    getStringValue(value.de) ||
    getStringValue(value.en) ||
    getStringValue(value.ar)
  );
};

const getItemTypeFromModule = (moduleName: string) => {
  const itemTypes: Record<string, string> = {
    events: "event",
    gallery: "gallery image",
    videos: "video",
    team: "team member",
    contact: "contact message",
    admins: "admin",
    settings: "site settings",
    "home-content": "home content",
  };

  return itemTypes[moduleName] || moduleName;
};

const getItemTitleFromData = (data: unknown) => {
  if (!isRecord(data)) {
    return undefined;
  }

  const directTitle =
    getLocalizedTitle(data.title) ||
    getLocalizedTitle(data.siteName) ||
    getLocalizedTitle(data.heroTitle) ||
    getStringValue(data.fullName) ||
    getStringValue(data.name) ||
    getStringValue(data.subject) ||
    getStringValue(data.email);

  if (directTitle) {
    return directTitle;
  }

  const image = data.image;
  if (isRecord(image)) {
    return getLocalizedTitle(image.alt);
  }

  const coverImage = data.coverImage;
  if (isRecord(coverImage)) {
    return getLocalizedTitle(coverImage.alt);
  }

  return undefined;
};

const getRequestBodyTitle = (requestBody: unknown) => {
  if (!isRecord(requestBody)) {
    return undefined;
  }

  return (
    getLocalizedTitle(requestBody.title) ||
    getLocalizedTitle(requestBody.siteName) ||
    getLocalizedTitle(requestBody.heroTitle) ||
    getStringValue(requestBody.fullName) ||
    getStringValue(requestBody.name) ||
    getStringValue(requestBody.subject) ||
    getStringValue(requestBody.email)
  );
};

const getCapturedBodyData = (capturedBody: unknown) => {
  if (!isRecord(capturedBody)) {
    return undefined;
  }

  const body = capturedBody as JsonResponseBody;
  return body.data;
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
  let capturedResponseBody: unknown;

  const originalJson = response.json.bind(response);

  response.json = ((body?: unknown): Response => {
    capturedResponseBody = body;
    return originalJson(body);
  }) as Response["json"];

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

    const moduleName = getModuleFromPath(request.originalUrl);
    const responseData = getCapturedBodyData(capturedResponseBody);
    const itemTitle =
      getItemTitleFromData(responseData) || getRequestBodyTitle(request.body);

    void ActivityLog.create({
      adminId: request.admin.adminId,
      action: getActionFromMethod(request.method),
      module: moduleName,
      itemType: getItemTypeFromModule(moduleName),
      itemTitle,
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
          module: moduleName,
          itemTitle,
          path: request.originalUrl,
        });
      })
      .catch((error: unknown) => {
        console.error("[ACTIVITY_LOG_ERROR]", error);
      });
  });

  next();
};
