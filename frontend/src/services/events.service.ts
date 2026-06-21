import type { EventItem, EventStatus } from "../types/event.types";
import { api } from "./api";

interface EventsResponse {
  success: boolean;
  data: EventItem[];
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface PublicGroupedEventsResponse {
  success: boolean;
  data: {
    upcomingEvents: EventItem[];
    pastEvents: EventItem[];
  };
  pagination: {
    page: number;
    limit: number;
    totalItems: number;
    totalPages: number;
  };
}

interface EventResponse {
  success: boolean;
  data: EventItem;
}

export interface GetAdminEventsParams {
  page: number;
  limit: number;
  status: EventStatus | "all";
  featured: "all" | "true" | "false";
  search: string;
}

export interface GetPublicEventsParams {
  page: number;
  limit: number;
  search: string;
}

export type UpdateEventPayload = Partial<Omit<EventItem, "_id">>;

export type CreateEventPayload = Omit<EventItem, "_id">;

export const getPublicEvents = async (
  params: GetPublicEventsParams,
): Promise<EventsResponse> => {
  const response = await api.get<EventsResponse>("/events/public", {
    params,
  });

  return response.data;
};

export const getPublicGroupedEvents = async (
  params: GetPublicEventsParams,
): Promise<PublicGroupedEventsResponse> => {
  const response = await api.get<PublicGroupedEventsResponse>(
    "/events/public-grouped",
    {
      params,
    },
  );

  return response.data;
};

export const getPublicEventBySlug = async (
  slug: string,
): Promise<EventItem> => {
  const response = await api.get<EventResponse>(`/events/public/${slug}`);
  return response.data.data;
};

export const getAdminEvents = async (
  params: GetAdminEventsParams,
): Promise<EventsResponse> => {
  const response = await api.get<EventsResponse>("/events/admin", {
    params,
  });

  return response.data;
};

export const getAdminEventById = async (
  eventId: string,
): Promise<EventItem> => {
  const response = await api.get<EventResponse>(`/events/admin/${eventId}`);
  return response.data.data;
};

export const updateAdminEvent = async (
  eventId: string,
  payload: UpdateEventPayload,
): Promise<EventItem> => {
  const response = await api.put<EventResponse>(
    `/events/admin/${eventId}`,
    payload,
  );

  return response.data.data;
};

export const deleteAdminEvent = async (eventId: string): Promise<EventItem> => {
  const response = await api.delete<EventResponse>(`/events/admin/${eventId}`);
  return response.data.data;
};

export const createAdminEvent = async (
  payload: CreateEventPayload,
): Promise<EventItem> => {
  const response = await api.post<EventResponse>("/events/admin", payload);
  return response.data.data;
};
