import { Router } from "express";
import { activityLogRoutes } from "../modules/activity-logs/activityLogs.routes";
import { adminRoutes } from "../modules/admin/admin.routes";
import { authRoutes } from "../modules/auth/auth.routes";
import { contactRoutes } from "../modules/contact/contact.routes";
import { dashboardRoutes } from "../modules/dashboard/dashboard.routes";
import { eventRoutes } from "../modules/events/events.routes";
import { galleryRoutes } from "../modules/gallery/gallery.routes";
import { homeContentRoutes } from "../modules/home-content/homeContent.routes";
import { settingsRoutes } from "../modules/settings/settings.routes";
import { teamRoutes } from "../modules/team/team.routes";
import { uploadRoutes } from "../modules/uploads/uploads.routes";
import { videoRoutes } from "../modules/videos/videos.routes";

export const apiRoutes = Router();

apiRoutes.get("/health", (request, response) => {
  response.status(200).json({
    success: true,
    message: "Collective Platform API is running",
  });
});

apiRoutes.use("/auth", authRoutes);
apiRoutes.use("/admins", adminRoutes);
apiRoutes.use("/activity-logs", activityLogRoutes);
apiRoutes.use("/events", eventRoutes);
apiRoutes.use("/gallery", galleryRoutes);
apiRoutes.use("/uploads", uploadRoutes);
apiRoutes.use("/videos", videoRoutes);
apiRoutes.use("/team", teamRoutes);
apiRoutes.use("/home-content", homeContentRoutes);
apiRoutes.use("/settings", settingsRoutes);
apiRoutes.use("/contact", contactRoutes);
apiRoutes.use("/dashboard", dashboardRoutes);
