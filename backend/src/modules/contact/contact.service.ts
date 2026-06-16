import {
  ContactMessage,
  ContactMessageDocument,
} from "../../database/models/ContactMessage";

type ContactMessageInput = Partial<ContactMessageDocument>;

export const createContactMessage = async (data: ContactMessageInput) => {
  return ContactMessage.create({
    fullName: data.fullName,
    email: data.email,
    subject: data.subject,
    message: data.message,
    status: "unread",
  });
};

export const getAdminContactMessages = async () => {
  return ContactMessage.find({ isDeleted: false }).sort({ createdAt: -1 });
};

export const updateContactMessage = async (
  id: string,
  data: ContactMessageInput,
) => {
  const message = await ContactMessage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!message) {
    throw new Error("Contact message not found");
  }

  return message;
};

export const softDeleteContactMessage = async (id: string) => {
  const message = await ContactMessage.findOneAndUpdate(
    { _id: id, isDeleted: false },
    { isDeleted: true },
    { new: true },
  );

  if (!message) {
    throw new Error("Contact message not found");
  }

  return message;
};
