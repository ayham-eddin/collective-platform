export interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

export interface ImageFile {
  url: string;
  publicId: string;
}

export interface ButtonLink {
  label: LocalizedText;
  url: string;
}

export interface HomeContentItem {
  _id: string;
  heroBadge: LocalizedText;
  heroTitle: LocalizedText;
  heroSubtitle: LocalizedText;
  heroImage?: ImageFile;
  primaryButton: ButtonLink;
  secondaryButton: ButtonLink;
  aboutEyebrow: LocalizedText;
  aboutTitle: LocalizedText;
  aboutText: LocalizedText;
  aboutButton: ButtonLink;
}

export type UpdateHomeContentPayload = Omit<HomeContentItem, "_id">;
