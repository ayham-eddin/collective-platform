import type {
  AdminItem,
  AdminRole,
  CreateAdminPayload,
  Permission,
  UpdateAdminPayload,
} from "../types/admin.types";
import { api } from "./api";

interface AdminsResponse {
  success: boolean;
  data: AdminItem[];
}

interface AdminResponse {
  success: boolean;
  data: AdminItem;
}

interface RolesResponse {
  success: boolean;
  data: AdminRole[];
}

interface RoleResponse {
  success: boolean;
  data: AdminRole;
}

export interface CreateRolePayload {
  name: string;
  permissions: Permission[];
}

export interface UpdateRolePayload {
  name?: string;
  permissions?: Permission[];
}

export const getAdminUsers = async (): Promise<AdminItem[]> => {
  const response = await api.get<AdminsResponse>("/admins");
  return response.data.data;
};

export const getAdminRoles = async (): Promise<AdminRole[]> => {
  const response = await api.get<RolesResponse>("/admins/roles");
  return response.data.data;
};

export const createAdminRole = async (
  payload: CreateRolePayload,
): Promise<AdminRole> => {
  const response = await api.post<RoleResponse>("/admins/roles", payload);
  return response.data.data;
};

export const updateAdminRole = async (
  roleId: string,
  payload: UpdateRolePayload,
): Promise<AdminRole> => {
  const response = await api.put<RoleResponse>(
    `/admins/roles/${roleId}`,
    payload,
  );
  return response.data.data;
};

export const deleteAdminRole = async (roleId: string): Promise<AdminRole> => {
  const response = await api.delete<RoleResponse>(`/admins/roles/${roleId}`);
  return response.data.data;
};

export const createAdminUser = async (
  payload: CreateAdminPayload,
): Promise<AdminItem> => {
  const response = await api.post<AdminResponse>("/admins", payload);
  return response.data.data;
};

export const updateAdminUser = async (
  adminId: string,
  payload: UpdateAdminPayload,
): Promise<AdminItem> => {
  const response = await api.put<AdminResponse>(`/admins/${adminId}`, payload);
  return response.data.data;
};

export const deleteAdminUser = async (adminId: string): Promise<AdminItem> => {
  const response = await api.delete<AdminResponse>(`/admins/${adminId}`);
  return response.data.data;
};
