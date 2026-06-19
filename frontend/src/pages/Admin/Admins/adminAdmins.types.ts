import type {
  Permission,
  PermissionAction,
  PermissionModule,
} from "../../../types/admin.types";

export type AdminFormState = {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
};

export type RoleFormState = {
  name: string;
  permissions: Permission[];
};

export type { Permission, PermissionAction, PermissionModule };
