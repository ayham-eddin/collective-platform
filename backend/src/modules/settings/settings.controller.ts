import { Request, Response } from "express";
import { getSiteSettings, updateSiteSettings } from "./settings.service";

export const getPublicSiteSettingsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const settings = await getSiteSettings();

  response.status(200).json({
    success: true,
    data: settings,
  });
};

export const getAdminSiteSettingsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const settings = await getSiteSettings();

  response.status(200).json({
    success: true,
    data: settings,
  });
};

export const updateSiteSettingsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const settings = await updateSiteSettings(request.body);

  response.status(200).json({
    success: true,
    message: "Site settings updated successfully",
    data: settings,
  });
};
