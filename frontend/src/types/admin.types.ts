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

export interface AdminRole {
  _id: string;
  name: string;
  permissions: Permission[];
  isSuperAdmin: boolean;
}

export interface AdminItem {
  _id: string;
  email: string;
  fullName: string;
  role: AdminRole;
  isActive: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateAdminPayload {
  email: string;
  password: string;
  fullName: string;
  roleId: string;
}

export interface UpdateAdminPayload {
  fullName?: string;
  roleId?: string;
  isActive?: boolean;
  password?: string;
}
