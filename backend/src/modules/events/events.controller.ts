import { Request, Response } from "express";
import {
  createEvent,
  getAdminEventById,
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
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 10);
  const status = String(request.query.status || "all") as
    | "draft"
    | "published"
    | "archived"
    | "all";
  const featured = String(request.query.featured || "all") as
    | "all"
    | "true"
    | "false";
  const search = String(request.query.search || "");

  const result = await getAdminEvents({
    page,
    limit,
    status,
    featured,
    search,
  });

  response.status(200).json({
    success: true,
    data: result.items,
    pagination: result.pagination,
  });
};

export const getAdminEventByIdController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const event = await getAdminEventById(request.params.id);

  response.status(200).json({
    success: true,
    data: event,
  });
};

export const getPublicEventsController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const page = Number(request.query.page || 1);
  const limit = Number(request.query.limit || 50);
  const search = String(request.query.search || "");

  const result = await getPublicEvents({
    page,
    limit,
    search,
  });

  response.status(200).json({
    success: true,
    data: result.items,
    pagination: result.pagination,
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
