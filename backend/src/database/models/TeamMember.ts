import mongoose, { Document, Schema } from "mongoose";

interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

interface MemberImage {
  url: string;
  publicId: string;
}

export interface TeamMemberDocument extends Document {
  fullName: string;
  role: LocalizedText;
  biography?: LocalizedText;
  image?: MemberImage;
  email?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
  isDeleted: boolean;
}

const localizedTextSchema = new Schema<LocalizedText>(
  {
    de: { type: String, required: true },
    en: { type: String, required: true },
    ar: { type: String, required: true },
  },
  { _id: false },
);

const imageSchema = new Schema<MemberImage>(
  {
    url: { type: String, required: true },
    publicId: { type: String, required: true },
  },
  { _id: false },
);

const teamMemberSchema = new Schema<TeamMemberDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },

    role: {
      type: localizedTextSchema,
      required: true,
    },

    biography: {
      type: localizedTextSchema,
    },

    image: {
      type: imageSchema,
    },

    email: String,
    instagramUrl: String,
    facebookUrl: String,
    linkedinUrl: String,

    sortOrder: {
      type: Number,
      default: 0,
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
  {
    timestamps: true,
  },
);

export const TeamMember = mongoose.model<TeamMemberDocument>(
  "TeamMember",
  teamMemberSchema,
);
