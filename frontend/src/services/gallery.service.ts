import type {
  CreateGalleryImagePayload,
  GalleryImageItem,
  GalleryImageStatus,
  ReorderGalleryItem,
  UpdateGalleryImagePayload,
} from "../types/gallery.types";
import { api } from "./api";

interface GalleryListResponse {
  success: boolean;
  data: GalleryImageItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface GalleryItemResponse {
  success: boolean;
  data: GalleryImageItem;
}

export interface GetPublicGalleryImagesParams {
  page: number;
  limit: number;
  search: string;
}

export interface GetAdminGalleryImagesParams {
  page: number;
  limit: number;
  status: GalleryImageStatus | "all";
  search: string;
}

export const getPublicGalleryImages = async (
  params: GetPublicGalleryImagesParams,
): Promise<GalleryListResponse> => {
  const response = await api.get<GalleryListResponse>("/gallery/public", {
    params,
  });

  return response.data;
};

export const getAdminGalleryImages = async (
  params: GetAdminGalleryImagesParams,
): Promise<GalleryListResponse> => {
  const response = await api.get<GalleryListResponse>("/gallery/admin", {
    params,
  });

  return response.data;
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
  const response = await api.put<{
    success: boolean;
    data: GalleryImageItem[];
  }>("/gallery/admin/reorder", {
    items,
  });

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
