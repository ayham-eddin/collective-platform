import type { TeamMemberItem } from "../types/team.types";
import { api } from "./api";

interface TeamResponse {
  success: boolean;
  data: TeamMemberItem[];
}

export const getPublicTeamMembers = async (): Promise<TeamMemberItem[]> => {
  const response = await api.get<TeamResponse>("/team/public");
  return response.data.data;
};
