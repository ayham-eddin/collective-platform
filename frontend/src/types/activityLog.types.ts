export type ActivityAction = "create" | "update" | "delete" | "unknown";

export interface ActivityLogAdmin {
  _id: string;
  fullName: string;
  email: string;
}

export interface ActivityLogItem {
  _id: string;
  adminId?: ActivityLogAdmin;
  action: ActivityAction;
  module: string;
  method: string;
  path: string;
  statusCode: number;
  targetId?: string;
  ip?: string;
  userAgent?: string;
  createdAt: string;
  updatedAt: string;
}
