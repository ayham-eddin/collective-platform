export interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

export interface TeamMemberItem {
  _id: string;
  fullName: string;
  role: LocalizedText;
  biography?: LocalizedText;
  image?: {
    url: string;
    publicId: string;
  };
  email?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  linkedinUrl?: string;
  sortOrder: number;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
}
