import type { GalleryImageStatus } from "../../../types/gallery.types";

export type GalleryFormState = {
  titleDe: string;
  titleEn: string;
  titleAr: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionAr: string;
  status: GalleryImageStatus;
  isFeatured: boolean;
};

export const initialGalleryFormState: GalleryFormState = {
  titleDe: "",
  titleEn: "",
  titleAr: "",
  descriptionDe: "",
  descriptionEn: "",
  descriptionAr: "",
  status: "published",
  isFeatured: false,
};
