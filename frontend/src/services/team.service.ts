import type {
  CreateTeamMemberPayload,
  TeamMemberItem,
  UpdateTeamMemberPayload,
} from "../types/team.types";
import { api } from "./api";

interface TeamListResponse {
  success: boolean;
  data: TeamMemberItem[];
}

interface TeamMemberResponse {
  success: boolean;
  data: TeamMemberItem;
}

export const getPublicTeamMembers = async (): Promise<TeamMemberItem[]> => {
  const response = await api.get<TeamListResponse>("/team/public");
  return response.data.data;
};

export const getAdminTeamMembers = async (): Promise<TeamMemberItem[]> => {
  const response = await api.get<TeamListResponse>("/team/admin");
  return response.data.data;
};

export const createAdminTeamMember = async (
  payload: CreateTeamMemberPayload,
): Promise<TeamMemberItem> => {
  const response = await api.post<TeamMemberResponse>("/team/admin", payload);
  return response.data.data;
};

export const updateAdminTeamMember = async (
  memberId: string,
  payload: UpdateTeamMemberPayload,
): Promise<TeamMemberItem> => {
  const response = await api.put<TeamMemberResponse>(
    `/team/admin/${memberId}`,
    payload,
  );

  return response.data.data;
};

export const deleteAdminTeamMember = async (
  memberId: string,
): Promise<TeamMemberItem> => {
  const response = await api.delete<TeamMemberResponse>(
    `/team/admin/${memberId}`,
  );

  return response.data.data;
};
