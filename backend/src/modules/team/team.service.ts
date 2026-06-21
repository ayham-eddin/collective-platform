import {
  TeamMember,
  TeamMemberDocument,
} from "../../database/models/TeamMember";
import { deleteFromCloudinary } from "../uploads/uploads.service";

type TeamMemberInput = Partial<TeamMemberDocument>;

const deleteReplacedImage = async (
  oldPublicId: string | undefined,
  newPublicId: string | undefined,
) => {
  if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
    await deleteFromCloudinary(oldPublicId, "image");
  }
};

export const createTeamMember = async (data: TeamMemberInput) => {
  return TeamMember.create(data);
};

export const getPublicTeamMembers = async () => {
  return TeamMember.find({ isDeleted: false }).sort({
    sortOrder: 1,
    createdAt: -1,
  });
};

export const getAdminTeamMembers = async () => {
  return TeamMember.find({ isDeleted: false }).sort({
    sortOrder: 1,
    createdAt: -1,
  });
};

export const updateTeamMember = async (id: string, data: TeamMemberInput) => {
  const existingMember = await TeamMember.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!existingMember) throw new Error("Team member not found");

  await deleteReplacedImage(
    existingMember.image?.publicId,
    data.image?.publicId,
  );

  const member = await TeamMember.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!member) throw new Error("Team member not found");

  return member;
};

export const deleteTeamMember = async (id: string) => {
  const member = await TeamMember.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!member) throw new Error("Team member not found");

  await deleteFromCloudinary(member.image?.publicId, "image");

  member.isDeleted = true;
  await member.save();

  return member;
};
