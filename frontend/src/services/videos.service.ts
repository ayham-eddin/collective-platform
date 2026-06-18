import { api } from "./api";
import type {
  VideoItem,
  VideoPayload,
  VideoStatus,
  VideoType,
} from "../types/video.types";

interface VideosResponse {
  success: boolean;
  data: VideoItem[];
}

interface AdminVideosResponse {
  success: boolean;
  data: VideoItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface VideoResponse {
  success: boolean;
  data: VideoItem;
}

export interface GetAdminVideosParams {
  page: number;
  limit: number;
  status: VideoStatus | "all";
  type: VideoType | "all";
  search: string;
}

export const getPublicVideos = async (): Promise<VideoItem[]> => {
  const response = await api.get<VideosResponse>("/videos/public");
  return response.data.data;
};

export const getAdminVideos = async (
  params: GetAdminVideosParams,
): Promise<AdminVideosResponse> => {
  const response = await api.get<AdminVideosResponse>("/videos/admin", {
    params,
  });

  return response.data;
};

export const createAdminVideo = async (
  payload: VideoPayload,
): Promise<VideoItem> => {
  const response = await api.post<VideoResponse>("/videos/admin", payload);
  return response.data.data;
};

export const updateAdminVideo = async (
  videoId: string,
  payload: VideoPayload,
): Promise<VideoItem> => {
  const response = await api.put<VideoResponse>(
    `/videos/admin/${videoId}`,
    payload,
  );

  return response.data.data;
};

export const deleteAdminVideo = async (videoId: string): Promise<VideoItem> => {
  const response = await api.delete<VideoResponse>(`/videos/admin/${videoId}`);
  return response.data.data;
};
