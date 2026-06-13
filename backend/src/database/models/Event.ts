import mongoose, { Document, Schema } from "mongoose";

interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

interface EventImage {
  url: string;
  publicId: string;
  alt?: LocalizedText;
}

interface EventVideo {
  youtubeUrl: string;
  title: LocalizedText;
  description?: LocalizedText;
}

export type EventStatus = "draft" | "published" | "archived";

export interface EventDocument extends Document {
  title: LocalizedText;
  slug: string;
  shortDescription: LocalizedText;
  description: LocalizedText;
  coverImage?: EventImage;
  galleryImages: EventImage[];
  videos: EventVideo[];
  eventDate: Date;
  startTime: string;
  endTime?: string;
  location: LocalizedText;
  googleMapsUrl?: string;
  ticketUrl?: string;
  lineup: string[];
  category?: string;
  status: EventStatus;
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

const eventImageSchema = new Schema<EventImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
    alt: { type: localizedTextSchema },
  },
  { _id: false },
);

const eventVideoSchema = new Schema<EventVideo>(
  {
    youtubeUrl: { type: String, required: true, trim: true },
    title: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema },
  },
  { _id: false },
);

const eventSchema = new Schema<EventDocument>(
  {
    title: { type: localizedTextSchema, required: true },
    slug: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    shortDescription: { type: localizedTextSchema, required: true },
    description: { type: localizedTextSchema, required: true },

    coverImage: { type: eventImageSchema },
    galleryImages: { type: [eventImageSchema], default: [] },
    videos: { type: [eventVideoSchema], default: [] },

    eventDate: { type: Date, required: true },
    startTime: { type: String, required: true, trim: true },
    endTime: { type: String, trim: true },

    location: { type: localizedTextSchema, required: true },
    googleMapsUrl: { type: String, trim: true },
    ticketUrl: { type: String, trim: true },

    lineup: { type: [String], default: [] },
    category: { type: String, trim: true },

    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "draft",
    },

    isFeatured: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true },
);

export const Event = mongoose.model<EventDocument>("Event", eventSchema);
