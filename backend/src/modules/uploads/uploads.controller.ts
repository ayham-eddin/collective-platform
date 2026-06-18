import { Request, Response } from "express";
import { uploadBufferToCloudinary } from "./uploads.service";

export const uploadSingleImageController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  if (!request.file) {
    response.status(400).json({
      success: false,
      message: "No file uploaded",
    });
    return;
  }

  const folder = request.body.folder || "collective-platform/general";

  const uploadedImage = await uploadBufferToCloudinary(
    request.file.buffer,
    folder,
    "image",
  );

  response.status(201).json({
    success: true,
    message: "Image uploaded successfully",
    data: uploadedImage,
  });
};

export const uploadSingleVideoController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  if (!request.file) {
    response.status(400).json({
      success: false,
      message: "No video uploaded",
    });
    return;
  }

  const folder = request.body.folder || "collective-platform/videos";

  const uploadedVideo = await uploadBufferToCloudinary(
    request.file.buffer,
    folder,
    "video",
  );

  response.status(201).json({
    success: true,
    message: "Video uploaded successfully",
    data: uploadedVideo,
  });
};

export const uploadMultipleImagesController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const files = request.files as Express.Multer.File[] | undefined;

  if (!files || files.length === 0) {
    response.status(400).json({
      success: false,
      message: "No files uploaded",
    });
    return;
  }

  const folder = request.body.folder || "collective-platform/gallery";

  const uploadedImages = await Promise.all(
    files.map((file) => uploadBufferToCloudinary(file.buffer, folder, "image")),
  );

  response.status(201).json({
    success: true,
    message: "Images uploaded successfully",
    data: uploadedImages,
  });
};
