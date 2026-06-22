import type { ActivityLogItem } from "../types/activityLog.types";
import { api } from "./api";

interface ActivityLogsResponse {
  success: boolean;
  data: ActivityLogItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

export interface GetActivityLogsParams {
  page: number;
  limit: number;
}

export const getAdminActivityLogs = async (
  params: GetActivityLogsParams,
): Promise<ActivityLogsResponse> => {
  const response = await api.get<ActivityLogsResponse>("/activity-logs/admin", {
    params,
  });

  return response.data;
};
