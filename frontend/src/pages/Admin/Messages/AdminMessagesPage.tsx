import { Archive, MailOpen, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import {
  deleteAdminContactMessage,
  getAdminContactMessages,
  updateAdminContactMessage,
} from "../../../services/contact.service";
import type {
  ContactMessageItem,
  ContactMessageStatus,
} from "../../../types/contact.types";

export const AdminMessagesPage = () => {
  const [messages, setMessages] = useState<ContactMessageItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadMessages = async () => {
      try {
        const data = await getAdminContactMessages();
        setMessages(data);
      } catch {
        setErrorMessage("Could not load contact messages.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadMessages();
  }, []);

  const handleUpdateStatus = async (
    messageId: string,
    status: ContactMessageStatus,
  ) => {
    setMessageText("");
    setErrorMessage("");

    try {
      const updatedMessage = await updateAdminContactMessage(messageId, {
        status,
      });

      setMessages((currentMessages) =>
        currentMessages.map((message) =>
          message._id === updatedMessage._id ? updatedMessage : message,
        ),
      );

      setMessageText("Message status updated.");
    } catch {
      setErrorMessage("Could not update message status.");
    }
  };

  const handleDeleteMessage = async (messageId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this message?",
    );

    if (!confirmed) {
      return;
    }

    setMessageText("");
    setErrorMessage("");

    try {
      await deleteAdminContactMessage(messageId);

      setMessages((currentMessages) =>
        currentMessages.filter((message) => message._id !== messageId),
      );

      setMessageText("Message deleted successfully.");
    } catch {
      setErrorMessage("Could not delete message.");
    }
  };

  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Messages
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">
        Contact Messages
      </h1>

      <p className="mt-4 text-zinc-400">
        Read, archive and delete contact form messages from here.
      </p>

      {messageText && (
        <p className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
          {messageText}
        </p>
      )}

      {errorMessage && (
        <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          {errorMessage}
        </p>
      )}

      {isLoading && <p className="mt-10 text-zinc-400">Loading messages...</p>}

      {!isLoading && messages.length === 0 && (
        <p className="mt-10 text-zinc-400">No contact messages yet.</p>
      )}

      <div className="mt-10 grid gap-6">
        {messages.map((message) => (
          <article
            key={message._id}
            className="rounded-3xl border border-white/10 bg-white/[0.03] p-6"
          >
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-3">
                  <span className={getStatusClassName(message.status)}>
                    {message.status}
                  </span>

                  <span className="text-sm text-zinc-500">
                    {new Date(message.createdAt).toLocaleString("de-DE")}
                  </span>
                </div>

                <h2 className="mt-4 text-2xl font-black">{message.subject}</h2>

                <p className="mt-2 text-zinc-400">
                  From: {message.fullName} · {message.email}
                </p>
              </div>

              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => void handleUpdateStatus(message._id, "read")}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                >
                  <MailOpen size={16} />
                  Mark read
                </button>

                <button
                  type="button"
                  onClick={() =>
                    void handleUpdateStatus(message._id, "archived")
                  }
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-300"
                >
                  <Archive size={16} />
                  Archive
                </button>

                <button
                  type="button"
                  onClick={() => void handleDeleteMessage(message._id)}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-red-400 hover:text-red-300"
                >
                  <Trash2 size={16} />
                  Delete
                </button>
              </div>
            </div>

            <p className="mt-6 whitespace-pre-line rounded-2xl bg-black/30 p-5 leading-8 text-zinc-300">
              {message.message}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
};

const getStatusClassName = (status: ContactMessageStatus) => {
  if (status === "unread") {
    return "rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black uppercase text-violet-300";
  }

  if (status === "read") {
    return "rounded-full bg-emerald-500/20 px-3 py-1 text-xs font-black uppercase text-emerald-300";
  }

  return "rounded-full bg-zinc-500/20 px-3 py-1 text-xs font-black uppercase text-zinc-300";
};
