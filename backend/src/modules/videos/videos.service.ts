import { Video, VideoDocument, VideoStatus } from "../../database/models/Video";
import { deleteFromCloudinary } from "../uploads/uploads.service";

type VideoInput = Partial<VideoDocument>;

type VideoQuery = {
  isDeleted: boolean;
  status?: VideoStatus;
  type?: "youtube" | "uploaded";
  $or?: Array<Record<string, { $regex: string; $options: string }>>;
};

interface GetVideosOptions {
  page: number;
  limit: number;
  status?: VideoStatus | "all";
  type?: "youtube" | "uploaded" | "all";
  search?: string;
}

export const createVideo = async (data: VideoInput) => {
  return Video.create(data);
};

const buildVideoQuery = ({
  status = "all",
  type = "all",
  search = "",
}: Pick<GetVideosOptions, "status" | "type" | "search">): VideoQuery => {
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

  return query;
};

const getPaginatedVideos = async ({
  page,
  limit,
  status = "all",
  type = "all",
  search = "",
}: GetVideosOptions) => {
  const query = buildVideoQuery({ status, type, search });

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

export const getAdminVideos = async (options: GetVideosOptions) => {
  return getPaginatedVideos(options);
};

export const getPublicVideos = async ({
  page,
  limit,
  type = "all",
  search = "",
}: Omit<GetVideosOptions, "status">) => {
  return getPaginatedVideos({
    page,
    limit,
    status: "published",
    type,
    search,
  });
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
  const video = await Video.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!video) {
    throw new Error("Video not found");
  }

  await Promise.all([
    deleteFromCloudinary(video.thumbnail?.publicId, "image"),
    deleteFromCloudinary(video.videoFile?.publicId, "video"),
  ]);

  video.isDeleted = true;
  await video.save();

  return video;
};
