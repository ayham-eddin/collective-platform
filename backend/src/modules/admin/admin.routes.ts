import { Router } from "express";

export const adminRoutes = Router();

adminRoutes.get("/status", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Admin module is ready",
  });
});
