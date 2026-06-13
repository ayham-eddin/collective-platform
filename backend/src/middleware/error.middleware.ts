import { NextFunction, Request, Response } from "express";

export const notFoundHandler = (
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  response.status(404);
  next(new Error(`Route not found: ${request.originalUrl}`));
};

export const errorHandler = (
  error: Error,
  request: Request,
  response: Response,
  next: NextFunction,
): void => {
  const statusCode = response.statusCode === 200 ? 500 : response.statusCode;

  response.status(statusCode).json({
    success: false,
    message: error.message || "Internal server error",
  });
};
