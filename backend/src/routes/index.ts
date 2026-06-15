import { Router } from "express";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { eventRoutes } from "../modules/events/events.routes";
import { galleryRoutes } from "../modules/gallery/gallery.routes";
import { uploadRoutes } from "../modules/uploads/uploads.routes";
import { videoRoutes } from "../modules/videos/videos.routes";
import { teamRoutes } from "../modules/team/team.routes";
import { homeContentRoutes } from "../modules/home-content/homeContent.routes";

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
apiRoutes.use("/gallery", galleryRoutes);
apiRoutes.use("/uploads", uploadRoutes);
apiRoutes.use("/videos", videoRoutes);
apiRoutes.use("/team", teamRoutes);
apiRoutes.use("/home-content", homeContentRoutes);
