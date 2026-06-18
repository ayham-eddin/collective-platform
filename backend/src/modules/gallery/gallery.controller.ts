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
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 12);
  const status = String(request.query.status || "all") as
    | "draft"
    | "published"
    | "archived"
    | "all";
  const search = String(request.query.search || "");

  const result = await getAdminGalleryImages({
    page,
    limit,
    status,
    search,
  });

  response.status(200).json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
};

export const getPublicGalleryImagesController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 6);
  const search = String(request.query.search || "");

  const result = await getPublicGalleryImages({
    page,
    limit,
    search,
  });

  response.status(200).json({
    success: true,
    data: result.items,
    pagination: result.pagination,
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
