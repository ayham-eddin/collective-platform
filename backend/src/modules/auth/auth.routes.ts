import { Router } from "express";

export const authRoutes = Router();

authRoutes.get("/status", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Auth module is ready",
  });
});
