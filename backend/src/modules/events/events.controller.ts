import { Request, Response } from "express";
import {
  createEvent,
  getAdminEvents,
  getEventBySlug,
  getPublicEvents,
  softDeleteEvent,
  updateEvent,
} from "./events.service";

export const createEventController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const event = await createEvent(request.body);

  response.status(201).json({
    success: true,
    message: "Event created successfully",
    data: event,
  });
};

export const getAdminEventsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const events = await getAdminEvents();

  response.status(200).json({
    success: true,
    data: events,
  });
};

export const getPublicEventsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const events = await getPublicEvents();

  response.status(200).json({
    success: true,
    data: events,
  });
};

export const getEventBySlugController = async (
  request: Request<{ slug: string }>,
  response: Response,
): Promise<void> => {
  const event = await getEventBySlug(request.params.slug);

  response.status(200).json({
    success: true,
    data: event,
  });
};

export const updateEventController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const event = await updateEvent(request.params.id, request.body);

  response.status(200).json({
    success: true,
    message: "Event updated successfully",
    data: event,
  });
};

export const deleteEventController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const event = await softDeleteEvent(request.params.id);

  response.status(200).json({
    success: true,
    message: "Event deleted successfully",
    data: event,
  });
};
