import {
  SiteSettings,
  SiteSettingsDocument,
} from "../../database/models/SiteSettings";
import { deleteFromCloudinary } from "../uploads/uploads.service";

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

const deleteReplacedImage = async (
  oldPublicId: string | undefined,
  newPublicId: string | undefined,
) => {
  if (oldPublicId && newPublicId && oldPublicId !== newPublicId) {
    await deleteFromCloudinary(oldPublicId, "image");
  }
};

export const getSiteSettings = async () => {
  const existingSettings = await SiteSettings.findOne();

  if (existingSettings) return existingSettings;

  return SiteSettings.create(defaultSiteSettings);
};

export const updateSiteSettings = async (data: SiteSettingsInput) => {
  const existingSettings = await getSiteSettings();

  await Promise.all([
    deleteReplacedImage(existingSettings.logo?.publicId, data.logo?.publicId),
    deleteReplacedImage(
      existingSettings.favicon?.publicId,
      data.favicon?.publicId,
    ),
  ]);

  const updatedSettings = await SiteSettings.findByIdAndUpdate(
    existingSettings._id,
    data,
    {
      returnDocument: "after",
      runValidators: true,
    },
  );

  if (!updatedSettings) throw new Error("Site settings not found");

  return updatedSettings;
};
