import mongoose, { Document, Schema, Types } from "mongoose";

export interface AdminDocument extends Document {
  email: string;
  password: string;
  fullName: string;
  role: Types.ObjectId;
  isActive: boolean;
  lastLoginAt?: Date;
}

const adminSchema = new Schema<AdminDocument>(
  {
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    fullName: {
      type: String,
      required: true,
      trim: true,
    },
    role: {
      type: Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    lastLoginAt: {
      type: Date,
    },
  },
  { timestamps: true },
);

export const Admin = mongoose.model<AdminDocument>("Admin", adminSchema);