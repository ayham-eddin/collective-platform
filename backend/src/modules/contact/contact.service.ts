import {
  ContactMessage,
  ContactMessageDocument,
  ContactMessageStatus,
} from "../../database/models/ContactMessage";

type ContactMessageInput = Partial<ContactMessageDocument>;

type ContactMessageQuery = {
  isDeleted: boolean;
  status?: ContactMessageStatus;
  $or?: Array<Record<string, { $regex: string; $options: string }>>;
};

interface GetAdminContactMessagesOptions {
  page: number;
  limit: number;
  status?: ContactMessageStatus | "all";
  search?: string;
}

export const createContactMessage = async (data: ContactMessageInput) => {
  return ContactMessage.create({
    fullName: data.fullName,
    email: data.email,
    subject: data.subject,
    message: data.message,
    status: "unread",
  });
};

export const getAdminContactMessages = async ({
  page,
  limit,
  status = "all",
  search = "",
}: GetAdminContactMessagesOptions) => {
  const query: ContactMessageQuery = {
    isDeleted: false,
  };

  if (status !== "all") {
    query.status = status;
  }

  if (search.trim()) {
    query.$or = [
      { fullName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
      { subject: { $regex: search, $options: "i" } },
      { message: { $regex: search, $options: "i" } },
    ];
  }

  const safePage = Math.max(page, 1);
  const safeLimit = Math.min(Math.max(limit, 1), 50);
  const skip = (safePage - 1) * safeLimit;

  const [messages, totalItems] = await Promise.all([
    ContactMessage.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(safeLimit),
    ContactMessage.countDocuments(query),
  ]);

  return {
    items: messages,
    pagination: {
      page: safePage,
      limit: safeLimit,
      totalItems,
      totalPages: Math.ceil(totalItems / safeLimit),
    },
  };
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
