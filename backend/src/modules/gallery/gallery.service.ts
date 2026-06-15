import {
  GalleryImage,
  GalleryImageDocument,
} from "../../database/models/GalleryImage";

type GalleryImageInput = Partial<GalleryImageDocument>;

export const createGalleryImage = async (data: GalleryImageInput) => {
  return GalleryImage.create(data);
};

export const getAdminGalleryImages = async () => {
  return GalleryImage.find({ isDeleted: false })
    .populate("relatedEvent")
    .sort({ createdAt: -1 });
};

export const getPublicGalleryImages = async () => {
  return GalleryImage.find({
    isDeleted: false,
    status: "published",
  })
    .populate("relatedEvent")
    .sort({ createdAt: -1 });
};

export const getGalleryImageById = async (id: string) => {
  const image = await GalleryImage.findOne({
    _id: id,
    isDeleted: false,
  }).populate("relatedEvent");

  if (!image) {
    throw new Error("Gallery image not found");
  }

  return image;
};

export const updateGalleryImage = async (
  id: string,
  data: GalleryImageInput,
) => {
  const image = await GalleryImage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!image) {
    throw new Error("Gallery image not found");
  }

  return image;
};

export const softDeleteGalleryImage = async (id: string) => {
  const image = await GalleryImage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!image) {
    throw new Error("Gallery image not found");
  }

  return image;
};
