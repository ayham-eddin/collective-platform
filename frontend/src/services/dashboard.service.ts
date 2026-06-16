import { api } from "./api";

export interface DashboardStats {
  totalEvents: number;
  publishedEvents: number;
  galleryImages: number;
  videos: number;
  teamMembers: number;
  unreadMessages: number;
}

interface DashboardStatsResponse {
  success: boolean;
  data: DashboardStats;
}

export const getAdminDashboardStats = async (): Promise<DashboardStats> => {
  const response = await api.get<DashboardStatsResponse>(
    "/dashboard/admin/stats",
  );

  return response.data.data;
};
