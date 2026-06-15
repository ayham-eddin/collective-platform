import type {
  HomeContentItem,
  UpdateHomeContentPayload,
} from "../types/homeContent.types";
import { api } from "./api";

interface HomeContentResponse {
  success: boolean;
  data: HomeContentItem;
}

export const getPublicHomeContent = async (): Promise<HomeContentItem> => {
  const response = await api.get<HomeContentResponse>("/home-content/public");
  return response.data.data;
};

export const getAdminHomeContent = async (): Promise<HomeContentItem> => {
  const response = await api.get<HomeContentResponse>("/home-content/admin");
  return response.data.data;
};

export const updateAdminHomeContent = async (
  payload: UpdateHomeContentPayload,
): Promise<HomeContentItem> => {
  const response = await api.put<HomeContentResponse>(
    "/home-content/admin",
    payload,
  );

  return response.data.data;
};
