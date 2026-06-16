import { Request, Response } from "express";
import {
  createAdmin,
  createRole,
  deleteAdmin,
  deleteRole,
  getAdmins,
  getRoles,
  updateAdmin,
  updateRole,
} from "./admin.service";

export const getAdminsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const admins = await getAdmins();

  response.status(200).json({
    success: true,
    data: admins,
  });
};

export const getRolesController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const roles = await getRoles();

  response.status(200).json({
    success: true,
    data: roles,
  });
};

export const createRoleController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const { name, permissions } = request.body as {
    name?: string;
    permissions?: [];
  };

  if (!name) {
    response.status(400).json({
      success: false,
      message: "Role name is required",
    });
    return;
  }

  const role = await createRole({
    name,
    permissions: permissions || [],
  });

  response.status(201).json({
    success: true,
    message: "Role created successfully",
    data: role,
  });
};

export const updateRoleController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const role = await updateRole(request.params.id, request.body);

  response.status(200).json({
    success: true,
    message: "Role updated successfully",
    data: role,
  });
};

export const deleteRoleController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const role = await deleteRole(request.params.id);

  response.status(200).json({
    success: true,
    message: "Role deleted successfully",
    data: role,
  });
};

export const createAdminController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const { email, password, fullName, roleId } = request.body as {
    email?: string;
    password?: string;
    fullName?: string;
    roleId?: string;
  };

  if (!email || !password || !fullName || !roleId) {
    response.status(400).json({
      success: false,
      message: "Email, password, full name and role are required",
    });
    return;
  }

  const admin = await createAdmin({
    email,
    password,
    fullName,
    roleId,
  });

  response.status(201).json({
    success: true,
    message: "Admin created successfully",
    data: admin,
  });
};

export const updateAdminController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const admin = await updateAdmin(request.params.id, request.body);

  response.status(200).json({
    success: true,
    message: "Admin updated successfully",
    data: admin,
  });
};

export const deleteAdminController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const admin = await deleteAdmin(request.params.id);

  response.status(200).json({
    success: true,
    message: "Admin deleted successfully",
    data: admin,
  });
};
