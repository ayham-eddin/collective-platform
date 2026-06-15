import { Request, Response } from "express";
import {
  createTeamMember,
  deleteTeamMember,
  getAdminTeamMembers,
  getPublicTeamMembers,
  updateTeamMember,
} from "./team.service";

export const createTeamMemberController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const member = await createTeamMember(request.body);

  response.status(201).json({
    success: true,
    data: member,
  });
};

export const getPublicTeamMembersController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const members = await getPublicTeamMembers();

  response.status(200).json({
    success: true,
    data: members,
  });
};

export const getAdminTeamMembersController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const members = await getAdminTeamMembers();

  response.status(200).json({
    success: true,
    data: members,
  });
};

export const updateTeamMemberController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const member = await updateTeamMember(request.params.id, request.body);

  response.status(200).json({
    success: true,
    data: member,
  });
};

export const deleteTeamMemberController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const member = await deleteTeamMember(request.params.id);

  response.status(200).json({
    success: true,
    data: member,
  });
};
