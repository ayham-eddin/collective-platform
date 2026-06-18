import { Video, VideoDocument, VideoStatus } from "../../database/models/Video";

type VideoInput = Partial<VideoDocument>;

type VideoQuery = {
  isDeleted: boolean;
  status?: VideoStatus;
  type?: "youtube" | "uploaded";
  $or?: Array<Record<string, { $regex: string; $options: string }>>;
};

interface GetAdminVideosOptions {
  page: number;
  limit: number;
  status?: VideoStatus | "all";
  type?: "youtube" | "uploaded" | "all";
  search?: string;
}

export const createVideo = async (data: VideoInput) => {
  return Video.create(data);
};

export const getAdminVideos = async ({
  page,
  limit,
  status = "all",
  type = "all",
  search = "",
}: GetAdminVideosOptions) => {
  const query: VideoQuery = {
    isDeleted: false,
  };

  if (status !== "all") {
    query.status = status;
  }

  if (type !== "all") {
    query.type = type;
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

  const [videos, totalItems] = await Promise.all([
    Video.find(query)
      .populate("relatedEvent")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    Video.countDocuments(query),
  ]);

  return {
    items: videos,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
};

export const getPublicVideos = async () => {
  return Video.find({
    isDeleted: false,
    status: "published",
  })
    .populate("relatedEvent")
    .sort({ createdAt: -1 });
};

export const getVideoById = async (id: string) => {
  const video = await Video.findOne({
    _id: id,
    isDeleted: false,
  }).populate("relatedEvent");

  if (!video) {
    throw new Error("Video not found");
  }

  return video;
};

export const updateVideo = async (id: string, data: VideoInput) => {
  const video = await Video.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!video) {
    throw new Error("Video not found");
  }

  return video;
};

export const softDeleteVideo = async (id: string) => {
  const video = await Video.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!video) {
    throw new Error("Video not found");
  }

  return video;
};
