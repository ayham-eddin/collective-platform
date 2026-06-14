import { api } from "./api";
import type { VideoItem } from "../types/video.types";

interface VideosResponse {
  success: boolean;
  data: VideoItem[];
}

export const getPublicVideos = async (): Promise<VideoItem[]> => {
  const response = await api.get<VideosResponse>("/videos/public");

  return response.data.data;
};
