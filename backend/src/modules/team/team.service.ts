import {
  TeamMember,
  TeamMemberDocument,
} from "../../database/models/TeamMember";

type TeamMemberInput = Partial<TeamMemberDocument>;

export const createTeamMember = async (data: TeamMemberInput) => {
  return TeamMember.create(data);
};

export const getPublicTeamMembers = async () => {
  return TeamMember.find({
    isDeleted: false,
  }).sort({
    sortOrder: 1,
    createdAt: -1,
  });
};

export const getAdminTeamMembers = async () => {
  return TeamMember.find({
    isDeleted: false,
  }).sort({
    sortOrder: 1,
    createdAt: -1,
  });
};

export const updateTeamMember = async (id: string, data: TeamMemberInput) => {
  const member = await TeamMember.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!member) {
    throw new Error("Team member not found");
  }

  return member;
};

export const deleteTeamMember = async (id: string) => {
  const member = await TeamMember.findOneAndUpdate(
    {
      _id: id,
      isDeleted: false,
    },
    {
      isDeleted: true,
    },
    {
      new: true,
    },
  );

  if (!member) {
    throw new Error("Team member not found");
  }

  return member;
};
