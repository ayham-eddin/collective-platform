import type {
  ContactMessageItem,
  CreateContactMessagePayload,
  UpdateContactMessagePayload,
} from "../types/contact.types";
import { api } from "./api";

interface ContactMessageResponse {
  success: boolean;
  data: ContactMessageItem;
}

interface ContactMessagesResponse {
  success: boolean;
  data: ContactMessageItem[];
}

export const createContactMessage = async (
  payload: CreateContactMessagePayload,
): Promise<ContactMessageItem> => {
  const response = await api.post<ContactMessageResponse>(
    "/contact/public",
    payload,
  );

  return response.data.data;
};

export const getAdminContactMessages = async (): Promise<
  ContactMessageItem[]
> => {
  const response = await api.get<ContactMessagesResponse>("/contact/admin");
  return response.data.data;
};

export const updateAdminContactMessage = async (
  messageId: string,
  payload: UpdateContactMessagePayload,
): Promise<ContactMessageItem> => {
  const response = await api.put<ContactMessageResponse>(
    `/contact/admin/${messageId}`,
    payload,
  );

  return response.data.data;
};

export const deleteAdminContactMessage = async (
  messageId: string,
): Promise<ContactMessageItem> => {
  const response = await api.delete<ContactMessageResponse>(
    `/contact/admin/${messageId}`,
  );

  return response.data.data;
};
