import { Admin } from "../../database/models/Admin";
import {
  Role,
  type Permission,
  type PermissionAction,
  type PermissionModule,
} from "../../database/models/Role";
import { hashPassword } from "../../utils/password";

interface CreateAdminInput {
  email: string;
  password: string;
  fullName: string;
  roleId: string;
}

interface UpdateAdminInput {
  fullName?: string;
  roleId?: string;
  isActive?: boolean;
  password?: string;
}

interface CreateRoleInput {
  name: string;
  permissions: Permission[];
}

interface UpdateRoleInput {
  name?: string;
  permissions?: Permission[];
}

const allowedModules: PermissionModule[] = [
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

const allowedActions: PermissionAction[] = [
  "create",
  "read",
  "update",
  "delete",
  "publish",
];

const normalizePermissions = (permissions: Permission[]) => {
  return permissions
    .filter((permission) => allowedModules.includes(permission.module))
    .map((permission) => ({
      module: permission.module,
      actions: permission.actions.filter((action) =>
        allowedActions.includes(action),
      ),
    }));
};

export const getAdmins = async () => {
  return Admin.find()
    .select("-password")
    .populate("role")
    .sort({ createdAt: -1 });
};

export const getRoles = async () => {
  return Role.find().sort({ isSuperAdmin: -1, name: 1 });
};

export const createRole = async (data: CreateRoleInput) => {
  const existingRole = await Role.findOne({
    name: data.name.trim(),
  });

  if (existingRole) {
    throw new Error("Role with this name already exists");
  }

  return Role.create({
    name: data.name.trim(),
    isSuperAdmin: false,
    permissions: normalizePermissions(data.permissions),
  });
};

export const updateRole = async (roleId: string, data: UpdateRoleInput) => {
  const role = await Role.findById(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  if (role.isSuperAdmin) {
    throw new Error("Super Admin role cannot be edited");
  }

  if (data.name !== undefined) {
    role.name = data.name.trim();
  }

  if (data.permissions !== undefined) {
    role.permissions = normalizePermissions(data.permissions);
  }

  await role.save();

  return role;
};

export const deleteRole = async (roleId: string) => {
  const role = await Role.findById(roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  if (role.isSuperAdmin) {
    throw new Error("Super Admin role cannot be deleted");
  }

  const adminsUsingRole = await Admin.countDocuments({ role: roleId });

  if (adminsUsingRole > 0) {
    throw new Error("Role is assigned to existing admins");
  }

  await role.deleteOne();

  return role;
};

export const createAdmin = async (data: CreateAdminInput) => {
  const existingAdmin = await Admin.findOne({
    email: data.email.toLowerCase(),
  });

  if (existingAdmin) {
    throw new Error("Admin with this email already exists");
  }

  const role = await Role.findById(data.roleId);

  if (!role) {
    throw new Error("Role not found");
  }

  const hashedPassword = await hashPassword(data.password);

  return Admin.create({
    email: data.email.toLowerCase(),
    password: hashedPassword,
    fullName: data.fullName,
    role: data.roleId,
    isActive: true,
  });
};

export const updateAdmin = async (adminId: string, data: UpdateAdminInput) => {
  const updateData: Partial<{
    fullName: string;
    role: string;
    isActive: boolean;
    password: string;
  }> = {};

  if (data.fullName !== undefined) {
    updateData.fullName = data.fullName;
  }

  if (data.roleId !== undefined) {
    const role = await Role.findById(data.roleId);

    if (!role) {
      throw new Error("Role not found");
    }

    updateData.role = data.roleId;
  }

  if (data.isActive !== undefined) {
    updateData.isActive = data.isActive;
  }

  if (data.password) {
    updateData.password = await hashPassword(data.password);
  }

  const admin = await Admin.findByIdAndUpdate(adminId, updateData, {
    returnDocument: "after",
    runValidators: true,
  })
    .select("-password")
    .populate("role");

  if (!admin) {
    throw new Error("Admin not found");
  }

  return admin;
};

export const deleteAdmin = async (adminId: string) => {
  const admin = await Admin.findByIdAndDelete(adminId).select("-password");

  if (!admin) {
    throw new Error("Admin not found");
  }

  return admin;
};
