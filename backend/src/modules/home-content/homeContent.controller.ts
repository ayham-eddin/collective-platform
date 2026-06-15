import { Request, Response } from "express";
import { getHomeContent, updateHomeContent } from "./homeContent.service";

export const getPublicHomeContentController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const content = await getHomeContent();

  response.status(200).json({
    success: true,
    data: content,
  });
};

export const getAdminHomeContentController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const content = await getHomeContent();

  response.status(200).json({
    success: true,
    data: content,
  });
};

export const updateHomeContentController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const content = await updateHomeContent(request.body);

  response.status(200).json({
    success: true,
    message: "Home content updated successfully",
    data: content,
  });
};
