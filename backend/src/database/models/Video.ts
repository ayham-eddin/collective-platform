import mongoose, { Document, Schema, Types } from "mongoose";

interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

interface MediaFile {
  url: string;
  publicId: string;
}

export type VideoType = "youtube" | "uploaded";
export type VideoStatus = "draft" | "published" | "archived";

export interface VideoDocument extends Document {
  title: LocalizedText;
  description?: LocalizedText;
  type: VideoType;
  youtubeUrl?: string;
  videoFile?: MediaFile;
  thumbnail?: MediaFile;
  relatedEvent?: Types.ObjectId;
  status: VideoStatus;
  isFeatured: boolean;
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

const mediaFileSchema = new Schema<MediaFile>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const videoSchema = new Schema<VideoDocument>(
  {
    title: {
      type: localizedTextSchema,
      required: true,
    },
    description: {
      type: localizedTextSchema,
    },
    type: {
      type: String,
      enum: ["youtube", "uploaded"],
      required: true,
    },
    youtubeUrl: {
      type: String,
      trim: true,
    },
    videoFile: {
      type: mediaFileSchema,
    },
    thumbnail: {
      type: mediaFileSchema,
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
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Video = mongoose.model<VideoDocument>("Video", videoSchema);
