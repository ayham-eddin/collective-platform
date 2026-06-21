import { Event, EventDocument, EventStatus } from "../../database/models/Event";
import { deleteFromCloudinary } from "../uploads/uploads.service";

type EventInput = Partial<EventDocument>;

type EventQuery = {
  isDeleted: boolean;
  status?: EventStatus;
  isFeatured?: boolean;
  eventDate?: {
    $gte?: Date;
    $lt?: Date;
  };
  $or?: Array<Record<string, string | { $regex: string; $options: string }>>;
};

interface GetEventsOptions {
  page: number;
  limit: number;
  status?: EventStatus | "all";
  featured?: "all" | "true" | "false";
  search?: string;
}

interface GetPublicGroupedEventsOptions {
  page: number;
  limit: number;
  search?: string;
}

const getStartOfToday = () => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return today;
};

const applySearchQuery = (query: EventQuery, search: string) => {
  if (!search.trim()) {
    return;
  }

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
};

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

  applySearchQuery(query, search);

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

  applySearchQuery(query, search);

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

export const getPublicGroupedEvents = async ({
  page,
  limit,
  search = "",
}: GetPublicGroupedEventsOptions) => {
  const today = getStartOfToday();
  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const baseUpcomingQuery: EventQuery = {
    isDeleted: false,
    status: "published",
    eventDate: {
      $gte: today,
    },
  };

  const basePastQuery: EventQuery = {
    isDeleted: false,
    status: "published",
    eventDate: {
      $lt: today,
    },
  };

  applySearchQuery(baseUpcomingQuery, search);
  applySearchQuery(basePastQuery, search);

  const [upcomingEvents, upcomingTotalItems, pastEvents] = await Promise.all([
    Event.find(baseUpcomingQuery)
      .sort({ eventDate: 1, startTime: 1 })
      .skip(skip)
      .limit(safeLimit),
    Event.countDocuments(baseUpcomingQuery),
    Event.find(basePastQuery).sort({ eventDate: -1, startTime: -1 }),
  ]);

  return {
    upcomingEvents,
    pastEvents,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems: upcomingTotalItems,
      totalPages: Math.ceil(upcomingTotalItems / safeLimit),
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
