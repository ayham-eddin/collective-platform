import mongoose, { Document, Schema } from "mongoose";

export type ContactMessageStatus = "unread" | "read" | "archived";

export interface ContactMessageDocument extends Document {
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  isDeleted: boolean;
}

const contactMessageSchema = new Schema<ContactMessageDocument>(
  {
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    subject: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    status: {
      type: String,
      enum: ["unread", "read", "archived"],
      default: "unread",
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const ContactMessage = mongoose.model<ContactMessageDocument>(
  "ContactMessage",
  contactMessageSchema,
);
