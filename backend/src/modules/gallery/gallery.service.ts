import {
  GalleryImage,
  GalleryImageDocument,
  GalleryImageStatus,
} from "../../database/models/GalleryImage";
import { deleteFromCloudinary } from "../uploads/uploads.service";

type GalleryImageInput = Partial<GalleryImageDocument>;

type GalleryQuery = {
  isDeleted: boolean;
  status?: GalleryImageStatus;
  $or?: Array<Record<string, { $regex: string; $options: string }>>;
};

interface ReorderGalleryInput {
  items: {
    id: string;
    sortOrder: number;
  }[];
}

interface GetAdminGalleryImagesOptions {
  page: number;
  limit: number;
  status?: GalleryImageStatus | "all";
  search?: string;
}

interface GetPublicGalleryImagesOptions {
  page: number;
  limit: number;
  search?: string;
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

export const getAdminGalleryImages = async ({
  page,
  limit,
  status = "all",
  search = "",
}: GetAdminGalleryImagesOptions) => {
  const query: GalleryQuery = {
    isDeleted: false,
  };

  if (status !== "all") {
    query.status = status;
  }

  if (search.trim()) {
    query.$or = [
      { "title.de": { $regex: search, $options: "i" } },
      { "title.en": { $regex: search, $options: "i" } },
      { "title.ar": { $regex: search, $options: "i" } },
      { "description.de": { $regex: search, $options: "i" } },
      { "description.en": { $regex: search, $options: "i" } },
      { "description.ar": { $regex: search, $options: "i" } },
    ];
  }

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [images, totalItems] = await Promise.all([
    GalleryImage.find(query)
      .populate("relatedEvent")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    GalleryImage.countDocuments(query),
  ]);

  return {
    items: images,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
};

export const getAllAdminGalleryImages = async () => {
  return GalleryImage.find({ isDeleted: false })
    .populate("relatedEvent")
    .sort({ sortOrder: 1, createdAt: -1 });
};

export const getPublicGalleryImages = async ({
  page,
  limit,
  search = "",
}: GetPublicGalleryImagesOptions) => {
  const query: GalleryQuery = {
    isDeleted: false,
    status: "published",
  };

  if (search.trim()) {
    query.$or = [
      { "title.de": { $regex: search, $options: "i" } },
      { "title.en": { $regex: search, $options: "i" } },
      { "title.ar": { $regex: search, $options: "i" } },
      { "description.de": { $regex: search, $options: "i" } },
      { "description.en": { $regex: search, $options: "i" } },
      { "description.ar": { $regex: search, $options: "i" } },
    ];
  }

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [images, totalItems] = await Promise.all([
    GalleryImage.find(query)
      .populate("relatedEvent")
      .sort({ sortOrder: 1, createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    GalleryImage.countDocuments(query),
  ]);

  return {
    items: images,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
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

  return getAllAdminGalleryImages();
};

export const softDeleteGalleryImage = async (id: string) => {
  const image = await GalleryImage.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!image) {
    throw new Error("Gallery image not found");
  }

  await deleteFromCloudinary(image.image?.publicId, "image");

  image.isDeleted = true;
  await image.save();

  return image;
};
