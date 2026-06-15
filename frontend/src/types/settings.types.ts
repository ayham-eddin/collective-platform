export interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

export interface ImageFile {
  url: string;
  publicId: string;
}

export interface SiteSettingsItem {
  _id: string;
  siteName: LocalizedText;
  siteDescription: LocalizedText;
  logo?: ImageFile;
  favicon?: ImageFile;
  contactEmail: string;
  contactPhone?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
}

export type UpdateSiteSettingsPayload = Omit<SiteSettingsItem, "_id">;
