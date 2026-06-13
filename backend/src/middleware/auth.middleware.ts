import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../config/env";

export interface AuthRequest extends Request {
  admin?: {
    adminId: string;
    roleId: string;
  };
}

export const authenticate = (
  request: AuthRequest,
  response: Response,
  next: NextFunction,
): void => {
  const authorizationHeader = request.headers.authorization;

  if (!authorizationHeader?.startsWith("Bearer ")) {
    response.status(401).json({
      success: false,
      message: "Unauthorized",
    });

    return;
  }

  const token = authorizationHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, env.jwtAccessSecret) as {
      adminId: string;
      roleId: string;
    };

    request.admin = decoded;

    next();
  } catch {
    response.status(401).json({
      success: false,
      message: "Invalid token",
    });
  }
};
