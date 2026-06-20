export type TeamFormState = {
  fullName: string;
  roleDe: string;
  roleEn: string;
  roleAr: string;
  biographyDe: string;
  biographyEn: string;
  biographyAr: string;
  email: string;
  instagramUrl: string;
  facebookUrl: string;
  linkedinUrl: string;
  sortOrder: string;
  isFeatured: boolean;
};

export const initialTeamFormState: TeamFormState = {
  fullName: "",
  roleDe: "",
  roleEn: "",
  roleAr: "",
  biographyDe: "",
  biographyEn: "",
  biographyAr: "",
  email: "",
  instagramUrl: "",
  facebookUrl: "",
  linkedinUrl: "",
  sortOrder: "0",
  isFeatured: false,
};
