import type { PermissionAction, PermissionModule } from "../types/admin.types";

interface PermissionRole {
  isSuperAdmin: boolean;
  permissions: {
    module: PermissionModule;
    actions: PermissionAction[];
  }[];
}

interface PermissionAdmin {
  role: PermissionRole;
}

export const hasPermission = (
  admin: PermissionAdmin | null,
  moduleName: PermissionModule,
  action: PermissionAction,
) => {
  if (!admin) {
    return false;
  }

  if (admin.role.isSuperAdmin) {
    return true;
  }

  const permission = admin.role.permissions.find(
    (item) => item.module === moduleName,
  );

  return permission?.actions.includes(action) || false;
};
