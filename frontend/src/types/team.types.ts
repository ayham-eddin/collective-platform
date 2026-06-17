export interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

export interface TeamMemberImage {
  url: string;
  publicId: string;
}

export interface TeamMemberItem {
  _id: string;
  fullName: string;
  role: LocalizedText;
  biography?: LocalizedText;
  image?: TeamMemberImage;
  email?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTeamMemberPayload {
  fullName: string;
  role: LocalizedText;
  biography?: LocalizedText;
  image?: TeamMemberImage;
  email?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
}

export type UpdateTeamMemberPayload = Partial<CreateTeamMemberPayload>;
