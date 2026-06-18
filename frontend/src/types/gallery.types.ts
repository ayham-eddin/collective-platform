export interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

export type GalleryImageStatus = "draft" | "published" | "archived";

export interface GalleryImageFile {
  url: string;
  publicId: string;
}

export interface GalleryImageItem {
  _id: string;
  title: LocalizedText;
  description?: LocalizedText;
  image: GalleryImageFile;
  status: GalleryImageStatus;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryImagePayload {
  title: LocalizedText;
  description?: LocalizedText;
  image: GalleryImageFile;
  status: GalleryImageStatus;
  isFeatured: boolean;
  sortOrder?: number;
}

export interface UpdateGalleryImagePayload {
  title?: LocalizedText;
  description?: LocalizedText;
  image?: GalleryImageFile;
  status?: GalleryImageStatus;
  isFeatured?: boolean;
  sortOrder?: number;
}

export interface ReorderGalleryItem {
  id: string;
  sortOrder: number;
}
