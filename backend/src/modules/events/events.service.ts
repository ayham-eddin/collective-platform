import { Event, EventDocument } from "../../database/models/Event";

type EventInput = Partial<EventDocument>;

export const createEvent = async (data: EventInput) => {
  return Event.create(data);
};

export const getAdminEvents = async () => {
  return Event.find({ isDeleted: false }).sort({ eventDate: -1 });
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

export const getPublicEvents = async () => {
  return Event.find({
    isDeleted: false,
    status: "published",
  }).sort({ eventDate: -1 });
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
  const event = await Event.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!event) {
    throw new Error("Event not found");
  }

  return event;
};
