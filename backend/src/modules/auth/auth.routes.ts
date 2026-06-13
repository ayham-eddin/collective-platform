import { Router } from "express";
import { loginController } from "./auth.controller";
import { authenticate } from "../../middleware/auth.middleware";

export const authRoutes = Router();

authRoutes.get("/status", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Auth module is ready",
  });
});

authRoutes.post("/login", loginController);

authRoutes.get("/me", authenticate, (request, response) => {
  response.status(200).json({
    success: true,
    message: "Authenticated",
  });
});
