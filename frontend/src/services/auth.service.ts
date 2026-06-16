import type { Permission } from "../types/admin.types";
import { api } from "./api";

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  success: boolean;
  message: string;
  data: {
    admin: {
      id: string;
      email: string;
      fullName: string;
      role: {
        id: string;
        name: string;
        permissions: Permission[];
        isSuperAdmin: boolean;
      };
    };
    accessToken: string;
    refreshToken: string;
  };
}

export const loginAdmin = async (payload: LoginPayload) => {
  const response = await api.post<LoginResponse>("/auth/login", payload);
  return response.data.data;
};

export const logoutAdmin = () => {
  localStorage.removeItem("adminAccessToken");
  localStorage.removeItem("adminRefreshToken");
  localStorage.removeItem("adminUser");
};

export const saveAdminSession = (data: LoginResponse["data"]) => {
  localStorage.setItem("adminAccessToken", data.accessToken);
  localStorage.setItem("adminRefreshToken", data.refreshToken);
  localStorage.setItem("adminUser", JSON.stringify(data.admin));
};

export const getStoredAdmin = () => {
  const storedAdmin = localStorage.getItem("adminUser");

  if (!storedAdmin) {
    return null;
  }

  return JSON.parse(storedAdmin) as LoginResponse["data"]["admin"];
};

export const isAdminAuthenticated = () => {
  return Boolean(localStorage.getItem("adminAccessToken"));
};
