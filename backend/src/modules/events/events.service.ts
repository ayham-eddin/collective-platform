import { Event, EventDocument, EventStatus } from "../../database/models/Event";
import { deleteFromCloudinary } from "../uploads/uploads.service";

type EventInput = Partial<EventDocument>;

type EventQuery = {
  isDeleted: boolean;
  status?: EventStatus;
  isFeatured?: boolean;
  $or?: Array<Record<string, string | { $regex: string; $options: string }>>;
};

interface GetEventsOptions {
  page: number;
  limit: number;
  status?: EventStatus | "all";
  featured?: "all" | "true" | "false";
  search?: string;
}

export const createEvent = async (data: EventInput) => {
  return Event.create(data);
};

export const getAdminEvents = async ({
  page,
  limit,
  status = "all",
  featured = "all",
  search = "",
}: GetEventsOptions) => {
  const query: EventQuery = {
    isDeleted: false,
  };

  if (status !== "all") {
    query.status = status;
  }

  if (featured !== "all") {
    query.isFeatured = featured === "true";
  }

  if (search.trim()) {
    query.$or = [
      { "title.de": { $regex: search, $options: "i" } },
      { "title.en": { $regex: search, $options: "i" } },
      { "title.ar": { $regex: search, $options: "i" } },
      { "shortDescription.de": { $regex: search, $options: "i" } },
      { "shortDescription.en": { $regex: search, $options: "i" } },
      { "shortDescription.ar": { $regex: search, $options: "i" } },
      { "description.de": { $regex: search, $options: "i" } },
      { "description.en": { $regex: search, $options: "i" } },
      { "description.ar": { $regex: search, $options: "i" } },
      { "location.de": { $regex: search, $options: "i" } },
      { "location.en": { $regex: search, $options: "i" } },
      { "location.ar": { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { lineup: { $regex: search, $options: "i" } },
    ];
  }

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [events, totalItems] = await Promise.all([
    Event.find(query).sort({ eventDate: -1 }).skip(skip).limit(safeLimit),
    Event.countDocuments(query),
  ]);

  return {
    items: events,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
};

export const getAdminEventById = async (id: string) => {
  const event = await Event.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

export const getPublicEvents = async ({
  page,
  limit,
  search = "",
}: {
  page: number;
  limit: number;
  search?: string;
}) => {
  const query: EventQuery = {
    isDeleted: false,
    status: "published",
  };

  if (search.trim()) {
    query.$or = [
      { "title.de": { $regex: search, $options: "i" } },
      { "title.en": { $regex: search, $options: "i" } },
      { "title.ar": { $regex: search, $options: "i" } },
      { "shortDescription.de": { $regex: search, $options: "i" } },
      { "shortDescription.en": { $regex: search, $options: "i" } },
      { "shortDescription.ar": { $regex: search, $options: "i" } },
      { "description.de": { $regex: search, $options: "i" } },
      { "description.en": { $regex: search, $options: "i" } },
      { "description.ar": { $regex: search, $options: "i" } },
      { "location.de": { $regex: search, $options: "i" } },
      { "location.en": { $regex: search, $options: "i" } },
      { "location.ar": { $regex: search, $options: "i" } },
      { category: { $regex: search, $options: "i" } },
      { lineup: { $regex: search, $options: "i" } },
    ];
  }

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [events, totalItems] = await Promise.all([
    Event.find(query).sort({ eventDate: -1 }).skip(skip).limit(safeLimit),
    Event.countDocuments(query),
  ]);

  return {
    items: events,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
};

export const getEventBySlug = async (slug: string) => {
  const event = await Event.findOne({
    slug,
    isDeleted: false,
  });

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

export const updateEvent = async (id: string, data: EventInput) => {
  const event = await Event.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};

export const softDeleteEvent = async (id: string) => {
  const event = await Event.findOne({
    _id: id,
    isDeleted: false,
  });

  if (!event) {
    throw new Error("Event not found");
  }

  await Promise.all([
    deleteFromCloudinary(event.coverImage?.publicId, "image"),
    ...event.galleryImages.map((image) =>
      deleteFromCloudinary(image.publicId, "image"),
    ),
  ]);

  event.isDeleted = true;
  await event.save();

  return event;
};
