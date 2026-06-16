export type ContactMessageStatus = "unread" | "read" | "archived";

export interface ContactMessageItem {
  _id: string;
  fullName: string;
  email: string;
  subject: string;
  message: string;
  status: ContactMessageStatus;
  createdAt: string;
  updatedAt: string;
}

export interface CreateContactMessagePayload {
  fullName: string;
  email: string;
  subject: string;
  message: string;
}

export interface UpdateContactMessagePayload {
  status?: ContactMessageStatus;
}
