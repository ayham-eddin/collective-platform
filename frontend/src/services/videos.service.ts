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

export interface GetPublicVideosParams {
  page: number;
  limit: number;
  type: VideoType | "all";
  search: string;
}

export interface GetAdminVideosParams {
  page: number;
  limit: number;
  status: VideoStatus | "all";
  type: VideoType | "all";
  search: string;
}

export const getPublicVideos = async (
  params: GetPublicVideosParams,
): Promise<VideosResponse> => {
  const response = await api.get<VideosResponse>("/videos/public", {
    params,
  });

  return response.data;
};

export const getAdminVideos = async (
  params: GetAdminVideosParams,
): Promise<VideosResponse> => {
  const response = await api.get<VideosResponse>("/videos/admin", {
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
