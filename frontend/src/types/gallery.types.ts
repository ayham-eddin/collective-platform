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
  createdAt: string;
  updatedAt: string;
}
