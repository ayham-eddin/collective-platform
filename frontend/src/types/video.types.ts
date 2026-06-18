export interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

export interface MediaFile {
  url: string;
  publicId: string;
}

export type VideoType = "youtube" | "uploaded";
export type VideoStatus = "draft" | "published" | "archived";

export interface VideoItem {
  _id: string;
  title: LocalizedText;
  description?: LocalizedText;
  type: VideoType;
  youtubeUrl?: string;
  videoFile?: MediaFile;
  thumbnail?: MediaFile;
  isFeatured: boolean;
  status: VideoStatus;
  createdAt: string;
  updatedAt: string;
}

export interface VideoPayload {
  title: LocalizedText;
  description?: LocalizedText;
  type: VideoType;
  youtubeUrl?: string;
  videoFile?: MediaFile;
  thumbnail?: MediaFile;
  isFeatured: boolean;
  status: VideoStatus;
}
