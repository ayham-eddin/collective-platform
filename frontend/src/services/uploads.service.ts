import type { UploadedMedia } from "../types/upload.types";
import { api } from "./api";

interface UploadResponse {
  success: boolean;
  data: UploadedMedia;
}

export const uploadSingleImage = async (
  imageFile: File,
): Promise<UploadedMedia> => {
  const formData = new FormData();
  formData.append("image", imageFile);

  const response = await api.post<UploadResponse>("/uploads/single", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.data.data;
};
