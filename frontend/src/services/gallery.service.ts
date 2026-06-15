import type { GalleryImageItem } from "../types/gallery.types";
import { api } from "./api";

interface GalleryResponse {
  success: boolean;
  data: GalleryImageItem[];
}

export const getPublicGalleryImages = async (): Promise<GalleryImageItem[]> => {
  const response = await api.get<GalleryResponse>("/gallery/public");
  return response.data.data;
};
