import { Router } from "express";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { eventRoutes } from "../modules/events/events.routes";
import { uploadRoutes } from "../modules/uploads/uploads.routes";

export const apiRoutes = Router();

apiRoutes.get("/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Collective Platform API is running",
  });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/admins", adminRoutes);
apiRoutes.use("/events", eventRoutes);
apiRoutes.use("/uploads", uploadRoutes);
