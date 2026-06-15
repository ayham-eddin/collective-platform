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

interface ButtonLink {
  label: LocalizedText;
  url: string;
}

export interface HomeContentDocument extends Document {
  heroBadge: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  heroImage?: ImageFile;
  primaryButton: ButtonLink;
  secondaryButton: ButtonLink;
  aboutEyebrow: LocalizedText;
  aboutTitle: LocalizedText;
  aboutText: LocalizedText;
  aboutButton: ButtonLink;
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

const buttonLinkSchema = new Schema<ButtonLink>(
  {
    label: {
      type: localizedTextSchema,
      required: true,
    },
    url: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { _id: false },
);

const homeContentSchema = new Schema<HomeContentDocument>(
  {
    heroBadge: {
      type: localizedTextSchema,
      required: true,
    },
    heroTitle: {
      type: localizedTextSchema,
      required: true,
    },
    heroSubtitle: {
      type: localizedTextSchema,
      required: true,
    },
    heroImage: {
      type: imageFileSchema,
    },
    primaryButton: {
      type: buttonLinkSchema,
      required: true,
    },
    secondaryButton: {
      type: buttonLinkSchema,
      required: true,
    },
    aboutEyebrow: {
      type: localizedTextSchema,
      required: true,
    },
    aboutTitle: {
      type: localizedTextSchema,
      required: true,
    },
    aboutText: {
      type: localizedTextSchema,
      required: true,
    },
    aboutButton: {
      type: buttonLinkSchema,
      required: true,
    },
  },
  { timestamps: true },
);

export const HomeContent = mongoose.model<HomeContentDocument>(
  "HomeContent",
  homeContentSchema,
);
