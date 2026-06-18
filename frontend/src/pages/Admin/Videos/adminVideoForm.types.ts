import type { VideoStatus, VideoType } from "../../../types/video.types";

export type VideoFormState = {
  titleDe: string;
  titleEn: string;
  titleAr: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionAr: string;
  type: VideoType;
  youtubeUrl: string;
  status: VideoStatus;
  isFeatured: boolean;
};

export const initialVideoFormState: VideoFormState = {
  titleDe: "",
  titleEn: "",
  titleAr: "",
  descriptionDe: "",
  descriptionEn: "",
  descriptionAr: "",
  type: "youtube",
  youtubeUrl: "",
  status: "draft",
  isFeatured: false,
};
