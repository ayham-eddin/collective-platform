import mongoose, { Document, Schema } from "mongoose";

export type PermissionAction =
  | "create"
  | "read"
  | "update"
  | "delete"
  | "publish";

export type PermissionModule =
  | "events"
  | "gallery"
  | "videos"
  | "team"
  | "pages"
  | "home-content"
  | "settings"
  | "contact"
  | "admins";

export interface Permission {
  module: PermissionModule;
  actions: PermissionAction[];
}

export interface RoleDocument extends Document {
  name: string;
  permissions: Permission[];
  isSuperAdmin: boolean;
}

const permissionSchema = new Schema<Permission>(
  {
    module: {
      type: String,
      required: true,
      enum: [
        "events",
        "gallery",
        "videos",
        "team",
        "pages",
        "home-content",
        "settings",
        "contact",
        "admins",
      ],
    },
    actions: {
      type: [String],
      required: true,
      enum: ["create", "read", "update", "delete", "publish"],
      default: [],
    },
  },
  { _id: false },
);

const roleSchema = new Schema<RoleDocument>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    permissions: {
      type: [permissionSchema],
      default: [],
    },
    isSuperAdmin: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true },
);

export const Role = mongoose.model<RoleDocument>("Role", roleSchema);
