import { Request, Response } from "express";
import {
  createVideo,
  getAdminVideos,
  getPublicVideos,
  getVideoById,
  softDeleteVideo,
  updateVideo,
} from "./videos.service";

export const createVideoController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const video = await createVideo(request.body);

  response.status(201).json({
    success: true,
    message: "Video created successfully",
    data: video,
  });
};

export const getAdminVideosController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 10);
  const status = String(request.query.status || "all") as
    | "draft"
    | "published"
    | "archived"
    | "all";
  const type = String(request.query.type || "all") as
    | "youtube"
    | "uploaded"
    | "all";
  const search = String(request.query.search || "");

  const result = await getAdminVideos({
    page,
    limit,
    status,
    type,
    search,
  });

  response.status(200).json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
};

export const getPublicVideosController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const videos = await getPublicVideos();

  response.status(200).json({
    success: true,
    data: videos,
  });
};

export const getVideoByIdController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const video = await getVideoById(request.params.id);

  response.status(200).json({
    success: true,
    data: video,
  });
};

export const updateVideoController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const video = await updateVideo(request.params.id, request.body);

  response.status(200).json({
    success: true,
    message: "Video updated successfully",
    data: video,
  });
};

export const deleteVideoController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const video = await softDeleteVideo(request.params.id);

  response.status(200).json({
    success: true,
    message: "Video deleted successfully",
    data: video,
  });
};
