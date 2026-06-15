import {
  SiteSettings,
  SiteSettingsDocument,
} from "../../database/models/SiteSettings";

type SiteSettingsInput = Partial<SiteSettingsDocument>;

const defaultSiteSettings = {
  siteName: {
    de: "Schu Fi Ma Fi Collective",
    en: "Schu Fi Ma Fi Collective",
    ar: "شو في ما في",
  },
  siteDescription: {
    de: "Syrisches Kulturkollektiv für Events, Musik und Community in NRW.",
    en: "Syrian cultural collective for events, music and community in NRW.",
    ar: "تجمع ثقافي سوري للفعاليات والموسيقى والمجتمع في NRW.",
  },
  contactEmail: "contact@schufimafi-collective.com",
  contactPhone: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
};

export const getSiteSettings = async () => {
  const existingSettings = await SiteSettings.findOne();

  if (existingSettings) {
    return existingSettings;
  }

  return SiteSettings.create(defaultSiteSettings);
};

export const updateSiteSettings = async (data: SiteSettingsInput) => {
  const existingSettings = await getSiteSettings();

  const updatedSettings = await SiteSettings.findByIdAndUpdate(
    existingSettings._id,
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedSettings) {
    throw new Error("Site settings not found");
  }

  return updatedSettings;
};
