export interface LocalizedText {
  de: string;
  en: string;
  ar: string;
}

export interface EventImage {
  url: string;
  publicId: string;
  alt?: LocalizedText;
}

export interface EventVideo {
  youtubeUrl: string;
  title: LocalizedText;
  description?: LocalizedText;
}

export interface EventItem {
  _id: string;
  title: LocalizedText;
  slug: string;
  shortDescription: LocalizedText;
  description: LocalizedText;
  coverImage?: EventImage;
  galleryImages: EventImage[];
  videos: EventVideo[];
  eventDate: string;
  startTime: string;
  endTime?: string;
  location: LocalizedText;
  googleMapsUrl?: string;
  ticketUrl?: string;
  lineup: string[];
  category?: string;
  status: "draft" | "published" | "archived";
  isFeatured: boolean;
}
