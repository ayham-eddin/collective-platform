import { UploadApiResponse } from "cloudinary";
import { cloudinary } from "../../config/cloudinary";

export interface UploadedMedia {
  url: string;
  publicId: string;
}

export const uploadBufferToCloudinary = async (
  fileBuffer: Buffer,
  folder: string,
  resourceType: "image" | "video" = "image",
): Promise<UploadedMedia> => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: resourceType,
      },
      (error, result?: UploadApiResponse) => {
        if (error || !result) {
          reject(error || new Error("Cloudinary upload failed"));
          return;
        }

        resolve({
          url: result.secure_url,
          publicId: result.public_id,
        });
      },
    );

    uploadStream.end(fileBuffer);
  });
};

export const deleteFromCloudinary = async (
  publicId: string | undefined,
  resourceType: "image" | "video" = "image",
): Promise<void> => {
  if (!publicId) {
    return;
  }

  await cloudinary.uploader.destroy(publicId, {
    resource_type: resourceType,
  });
};
