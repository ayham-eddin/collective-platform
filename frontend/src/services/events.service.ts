import type { EventItem } from "../types/event.types";
import { api } from "./api";

interface EventsResponse {
  success: boolean;
  data: EventItem[];
}

interface EventResponse {
  success: boolean;
  data: EventItem;
}

export const getPublicEvents = async (): Promise<EventItem[]> => {
  const response = await api.get<EventsResponse>("/events/public");
  return response.data.data;
};

export const getPublicEventBySlug = async (
  slug: string,
): Promise<EventItem> => {
  const response = await api.get<EventResponse>(`/events/public/${slug}`);
  return response.data.data;
};

export const getAdminEvents = async (): Promise<EventItem[]> => {
  const response = await api.get<EventsResponse>("/events/admin");
  return response.data.data;
};

export const deleteAdminEvent = async (eventId: string): Promise<EventItem> => {
  const response = await api.delete<EventResponse>(`/events/admin/${eventId}`);
  return response.data.data;
};
