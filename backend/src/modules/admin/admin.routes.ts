import { Router } from "express";
import { authenticate } from "../../middleware/auth.middleware";

export const adminRoutes = Router();

adminRoutes.get("/status", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Admin module is ready",
  });
});

adminRoutes.get("/profile", authenticate, (request, response) => {
  response.status(200).json({
    success: true,
    message: "Protected route works",
  });
});
