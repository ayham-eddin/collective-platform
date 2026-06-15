import { Request, Response } from "express";
import {
  createGalleryImage,
  getAdminGalleryImages,
  getGalleryImageById,
  getPublicGalleryImages,
  reorderGalleryImages,
  softDeleteGalleryImage,
  updateGalleryImage,
} from "./gallery.service";

export const createGalleryImageController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const image = await createGalleryImage(request.body);

  response.status(201).json({
    success: true,
    message: "Gallery image created successfully",
    data: image,
  });
};

export const getAdminGalleryImagesController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const images = await getAdminGalleryImages();

  response.status(200).json({
    success: true,
    data: images,
  });
};

export const getPublicGalleryImagesController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const images = await getPublicGalleryImages();

  response.status(200).json({
    success: true,
    data: images,
  });
};

export const getGalleryImageByIdController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const image = await getGalleryImageById(request.params.id);

  response.status(200).json({
    success: true,
    data: image,
  });
};

export const updateGalleryImageController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const image = await updateGalleryImage(request.params.id, request.body);

  response.status(200).json({
    success: true,
    message: "Gallery image updated successfully",
    data: image,
  });
};

export const reorderGalleryImagesController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const images = await reorderGalleryImages(request.body);

  response.status(200).json({
    success: true,
    message: "Gallery images reordered successfully",
    data: images,
  });
};

export const deleteGalleryImageController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const image = await softDeleteGalleryImage(request.params.id);

  response.status(200).json({
    success: true,
    message: "Gallery image deleted successfully",
    data: image,
  });
};
