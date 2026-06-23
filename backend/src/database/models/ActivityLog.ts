import mongoose, { Document, Schema, Types } from "mongoose";

export type ActivityAction = "create" | "update" | "delete" | "unknown";

export interface ActivityLogDocument extends Document {
  adminId?: Types.ObjectId;
  action: ActivityAction;
  module: string;
  itemType?: string;
  itemTitle?: string;
  method: string;
  path: string;
  statusCode: number;
  targetId?: string;
  ip?: string;
  userAgent?: string;
  createdAt: Date;
  updatedAt: Date;
}

const activityLogSchema = new Schema<ActivityLogDocument>(
  {
    adminId: { type: Schema.Types.ObjectId, ref: "Admin" },
    action: {
      type: String,
      enum: ["create", "update", "delete", "unknown"],
      required: true,
      default: "unknown",
    },
    module: { type: String, required: true, trim: true },
    itemType: { type: String, trim: true },
    itemTitle: { type: String, trim: true },
    method: { type: String, required: true, trim: true },
    path: { type: String, required: true, trim: true },
    statusCode: { type: Number, required: true },
    targetId: { type: String, trim: true },
    ip: { type: String, trim: true },
    userAgent: { type: String, trim: true },
  },
  { timestamps: true },
);

export const ActivityLog = mongoose.model<ActivityLogDocument>(
  "ActivityLog",
  activityLogSchema,
);
