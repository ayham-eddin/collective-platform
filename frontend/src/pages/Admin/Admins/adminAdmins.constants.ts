import type {
  AdminFormState,
  PermissionAction,
  PermissionModule,
  RoleFormState,
} from "./adminAdmins.types";

export const permissionModules: PermissionModule[] = [
  "events",
  "gallery",
  "videos",
  "team",
  "pages",
  "home-content",
  "settings",
  "contact",
  "admins",
];

export const permissionActions: PermissionAction[] = [
  "read",
  "create",
  "update",
  "delete",
  "publish",
];

export const initialFormState: AdminFormState = {
  fullName: "",
  email: "",
  password: "",
  roleId: "",
};

export const initialRoleFormState: RoleFormState = {
  name: "",
  permissions: permissionModules.map((moduleName) => ({
    module: moduleName,
    actions: [],
  })),
};

export const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
