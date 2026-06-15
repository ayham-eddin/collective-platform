export interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

export interface GalleryImageItem {
  _id: string;
  title: LocalizedText;
  description?: LocalizedText;
  image: {
    url: string;
    publicId: string;
  };
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateGalleryImagePayload {
  title: LocalizedText;
  description?: LocalizedText;
  image: {
    url: string;
    publicId: string;
  };
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
  sortOrder?: number;
}

export interface UpdateGalleryImagePayload {
  title?: LocalizedText;
  description?: LocalizedText;
  status?: "draft" | "published" | "archived";
  isFeatured?: boolean;
  sortOrder?: number;
}

export interface ReorderGalleryItem {
  id: string;
  sortOrder: number;
}
