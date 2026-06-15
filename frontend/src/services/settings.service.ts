import type {
  SiteSettingsItem,
  UpdateSiteSettingsPayload,
} from "../types/settings.types";
import { api } from "./api";

interface SiteSettingsResponse {
  success: boolean;
  data: SiteSettingsItem;
}

export const getPublicSiteSettings = async (): Promise<SiteSettingsItem> => {
  const response = await api.get<SiteSettingsResponse>("/settings/public");
  return response.data.data;
};

export const getAdminSiteSettings = async (): Promise<SiteSettingsItem> => {
  const response = await api.get<SiteSettingsResponse>("/settings/admin");
  return response.data.data;
};

export const updateAdminSiteSettings = async (
  payload: UpdateSiteSettingsPayload,
): Promise<SiteSettingsItem> => {
  const response = await api.put<SiteSettingsResponse>(
    "/settings/admin",
    payload,
  );

  return response.data.data;
};
