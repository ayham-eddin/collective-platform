import mongoose, { Document, Schema, Types } from "mongoose";

interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

interface ImageFile {
  url: string;
  publicId: string;
}

export type GalleryImageStatus = "draft" | "published" | "archived";

export interface GalleryImageDocument extends Document {
  title: LocalizedText;
  description?: LocalizedText;
  image: ImageFile;
  relatedEvent?: Types.ObjectId;
  status: GalleryImageStatus;
  isFeatured: boolean;
  sortOrder: number;
  isDeleted: boolean;
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

const galleryImageSchema = new Schema<GalleryImageDocument>(
  {
    title: {
      type: localizedTextSchema,
      required: true,
    },
    description: {
      type: localizedTextSchema,
    },
    image: {
      type: imageFileSchema,
      required: true,
    },
    relatedEvent: {
      type: Schema.Types.ObjectId,
      ref: "Event",
    },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
    sortOrder: {
      type: Number,
      default: 0,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const GalleryImage = mongoose.model<GalleryImageDocument>(
  "GalleryImage",
  galleryImageSchema,
);
