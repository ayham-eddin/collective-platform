import mongoose, { Document, Schema, Types } from "mongoose";

export interface AuditLogDocument extends Document {
  admin: Types.ObjectId;
  action: string;
  module: string;
  targetId?: string;
  message: string;
}

const auditLogSchema = new Schema<AuditLogDocument>(
  {
    admin: {
      type: Schema.Types.ObjectId,
      ref: "Admin",
      required: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    module: {
      type: String,
      required: true,
      trim: true,
    },
    targetId: {
      type: String,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
  },
  { timestamps: true },
);

export const AuditLog = mongoose.model<AuditLogDocument>(
  "AuditLog",
  auditLogSchema,
);
