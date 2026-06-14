import { Video, VideoDocument } from "../../database/models/Video";

type VideoInput = Partial<VideoDocument>;

export const createVideo = async (data: VideoInput) => {
  return Video.create(data);
};

export const getAdminVideos = async () => {
  return Video.find({ isDeleted: false })
    .populate("relatedEvent")
    .sort({ createdAt: -1 });
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
