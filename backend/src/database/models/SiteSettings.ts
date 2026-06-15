import mongoose, { Document, Schema } from "mongoose";

interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

interface ImageFile {
  url: string;
  publicId: string;
}

export interface SiteSettingsDocument extends Document {
  siteName: LocalizedText;
  siteDescription: LocalizedText;
  logo?: ImageFile;
  favicon?: ImageFile;
  contactEmail: string;
  contactPhone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
}

const localizedTextSchema = new Schema<LocalizedText>(
  {
    de: { type: String, required: true, trim: true },
    en: { type: String, required: true, trim: true },
    ar: { type: String, required: true, trim: true },
  },
  { _id: false },
);

const imageFileSchema = new Schema<ImageFile>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const siteSettingsSchema = new Schema<SiteSettingsDocument>(
  {
    siteName: {
      type: localizedTextSchema,
      required: true,
    },
    siteDescription: {
      type: localizedTextSchema,
      required: true,
    },
    logo: {
      type: imageFileSchema,
    },
    favicon: {
      type: imageFileSchema,
    },
    contactEmail: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    contactPhone: {
      type: String,
      trim: true,
    },
    instagramUrl: {
      type: String,
      trim: true,
    },
    facebookUrl: {
      type: String,
      trim: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    tiktokUrl: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true },
);

export const SiteSettings = mongoose.model<SiteSettingsDocument>(
  "SiteSettings",
  siteSettingsSchema,
);
