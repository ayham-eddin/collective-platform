export interface VideoItem {
  _id: string;

  title: {
    de: string;
    en: string;
    ar: string;
  };

  description: {
    de: string;
    en: string;
    ar: string;
  };

  type: "youtube" | "upload";

  youtubeUrl?: string;

  videoFile?: {
    url: string;
    publicId: string;
  };

  thumbnail?: {
    url: string;
    alt?: {
      de?: string;
      en?: string;
      ar?: string;
    };
  };

  isFeatured: boolean;
  status: string;

  createdAt: string;
  updatedAt: string;
}
