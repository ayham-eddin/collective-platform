import { Request, Response } from "express";
import {
  createContactMessage,
  getAdminContactMessages,
  softDeleteContactMessage,
  updateContactMessage,
} from "./contact.service";

export const createContactMessageController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const message = await createContactMessage(request.body);

  response.status(201).json({
    success: true,
    message: "Contact message sent successfully",
    data: message,
  });
};

export const getAdminContactMessagesController = async (
  request: Request,
  response: Response,
): Promise<void> => {
  const messages = await getAdminContactMessages();

  response.status(200).json({
    success: true,
    data: messages,
  });
};

export const updateContactMessageController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const message = await updateContactMessage(request.params.id, request.body);

  response.status(200).json({
    success: true,
    message: "Contact message updated successfully",
    data: message,
  });
};

export const deleteContactMessageController = async (
  request: Request<{ id: string }>,
  response: Response,
): Promise<void> => {
  const message = await softDeleteContactMessage(request.params.id);

  response.status(200).json({
    success: true,
    message: "Contact message deleted successfully",
    data: message,
  });
};
