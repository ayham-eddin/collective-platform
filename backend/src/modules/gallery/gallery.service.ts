import {
  GalleryImage,
  GalleryImageDocument,
} from "../../database/models/GalleryImage";

type GalleryImageInput = Partial<GalleryImageDocument>;

interface ReorderGalleryInput {
  items: {
    id: string;
    sortOrder: number;
  }[];
}

export const createGalleryImage = async (data: GalleryImageInput) => {
  const lastImage = await GalleryImage.findOne({ isDeleted: false }).sort({
    sortOrder: -1,
  });

  const nextSortOrder = lastImage ? lastImage.sortOrder + 1 : 1;

  return GalleryImage.create({
    ...data,
    sortOrder: data.sortOrder ?? nextSortOrder,
  });
};

export const getAdminGalleryImages = async () => {
  return GalleryImage.find({ isDeleted: false })
    .populate("relatedEvent")
    .sort({ sortOrder: 1, createdAt: -1 });
};

export const getPublicGalleryImages = async () => {
  return GalleryImage.find({
    isDeleted: false,
    status: "published",
  })
    .populate("relatedEvent")
    .sort({ sortOrder: 1, createdAt: -1 });
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

export const reorderGalleryImages = async ({ items }: ReorderGalleryInput) => {
  await Promise.all(
    items.map((item) =>
      GalleryImage.findOneAndUpdate(
        { _id: item.id, isDeleted: false },
        { sortOrder: item.sortOrder },
        { new: true },
      ),
    ),
  );

  return getAdminGalleryImages();
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
