import type {
  CreateGalleryImagePayload,
  GalleryImageItem,
  ReorderGalleryItem,
  UpdateGalleryImagePayload,
} from "../types/gallery.types";
import { api } from "./api";

interface GalleryListResponse {
  success: boolean;
  data: GalleryImageItem[];
}

interface GalleryItemResponse {
  success: boolean;
  data: GalleryImageItem;
}

export const getPublicGalleryImages = async (): Promise<GalleryImageItem[]> => {
  const response = await api.get<GalleryListResponse>("/gallery/public");
  return response.data.data;
};

export const getAdminGalleryImages = async (): Promise<GalleryImageItem[]> => {
  const response = await api.get<GalleryListResponse>("/gallery/admin");
  return response.data.data;
};

export const createAdminGalleryImage = async (
  payload: CreateGalleryImagePayload,
): Promise<GalleryImageItem> => {
  const response = await api.post<GalleryItemResponse>(
    "/gallery/admin",
    payload,
  );
  return response.data.data;
};

export const updateAdminGalleryImage = async (
  imageId: string,
  payload: UpdateGalleryImagePayload,
): Promise<GalleryImageItem> => {
  const response = await api.put<GalleryItemResponse>(
    `/gallery/admin/${imageId}`,
    payload,
  );

  return response.data.data;
};

export const reorderAdminGalleryImages = async (
  items: ReorderGalleryItem[],
): Promise<GalleryImageItem[]> => {
  const response = await api.put<GalleryListResponse>(
    "/gallery/admin/reorder",
    {
      items,
    },
  );

  return response.data.data;
};

export const deleteAdminGalleryImage = async (
  imageId: string,
): Promise<GalleryImageItem> => {
  const response = await api.delete<GalleryItemResponse>(
    `/gallery/admin/${imageId}`,
  );

  return response.data.data;
};
