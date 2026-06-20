import { Archive, MailOpen, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
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
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<
    ContactMessageStatus | "all"
  >("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [messageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadMessages = async (targetPage: number) => {
    const response = await getAdminContactMessages({
      page: targetPage,
      limit,
      status: statusFilter,
      search,
    });

    setMessages(response.data);
    setTotalPages(response.pagination.totalPages || 1);
    setTotalItems(response.pagination.totalItems);
  };

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await loadMessages(page);
      } catch {
        setErrorMessage("Could not load contact messages.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter, search]);

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

    if (!confirmed) return;

    setMessageText("");
    setErrorMessage("");

    try {
      await deleteAdminContactMessage(messageId);
      await loadMessages(page);
      setMessageText("Message deleted successfully.");
    } catch {
      setErrorMessage("Could not delete message.");
    }
  };

  const handleApplySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusFilterChange = (value: ContactMessageStatus | "all") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-300 sm:text-sm">
        Messages
      </p>

      <h1 className="mt-4 break-words text-3xl font-black tracking-tight sm:text-4xl">
        Contact Messages
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
        Read, filter, archive and delete contact form messages from here.
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

      <div className="mt-10 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-5 sm:rounded-3xl sm:p-6">
        <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-end">
          <div>
            <h2 className="text-xl font-black sm:text-2xl">Messages List</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Total results: {totalItems}
            </p>
          </div>

          <form onSubmit={handleApplySearch} className="grid gap-3 sm:flex">
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search messages..."
              className={inputClassName}
            />

            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-300">Status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusFilterChange(
                  event.target.value as ContactMessageStatus | "all",
                )
              }
              className={inputClassName}
            >
              <option value="all">All statuses</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-300">Per page</span>
            <select
              value={limit}
              onChange={(event) =>
                handleLimitChange(Number(event.target.value))
              }
              className={inputClassName}
            >
              <option value={5}>5 messages</option>
              <option value={10}>10 messages</option>
              <option value={20}>20 messages</option>
            </select>
          </label>
        </div>

        {isLoading && (
          <p className="mt-10 text-zinc-400">Loading messages...</p>
        )}

        {!isLoading && messages.length === 0 && (
          <p className="mt-10 text-zinc-400">No contact messages found.</p>
        )}

        <div className="mt-10 grid gap-5 sm:gap-6">
          {messages.map((message) => (
            <article
              key={message._id}
              className="rounded-[1.5rem] border border-white/10 bg-black/30 p-5 sm:rounded-3xl sm:p-6"
            >
              <div className="grid gap-5 xl:grid-cols-[1fr_auto] xl:items-start">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className={getStatusClassName(message.status)}>
                      {message.status}
                    </span>

                    <span className="text-sm text-zinc-500">
                      {new Date(message.createdAt).toLocaleString("de-DE")}
                    </span>
                  </div>

                  <h2 className="mt-4 break-words text-xl font-black sm:text-2xl">
                    {message.subject}
                  </h2>

                  <p className="mt-2 break-words text-sm leading-6 text-zinc-400 sm:text-base">
                    From: {message.fullName} · {message.email}
                  </p>
                </div>

                <div className="grid gap-2 sm:flex sm:flex-wrap xl:justify-end">
                  <button
                    type="button"
                    onClick={() => void handleUpdateStatus(message._id, "read")}
                    disabled={message.status === "read"}
                    className="btn btn-secondary-dark btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <MailOpen size={16} />
                    Mark read
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      void handleUpdateStatus(message._id, "archived")
                    }
                    disabled={message.status === "archived"}
                    className="btn btn-secondary-dark btn-sm disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Archive size={16} />
                    Archive
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDeleteMessage(message._id)}
                    className="btn btn-danger btn-sm"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>

              <p className="mt-6 whitespace-pre-line break-words rounded-2xl bg-black/30 p-4 text-sm leading-7 text-zinc-300 sm:p-5 sm:text-base sm:leading-8">
                {message.message}
              </p>
            </article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="btn btn-secondary-dark btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="inline-flex min-h-10 items-center justify-center rounded-full bg-white/5 px-5 py-2 text-sm font-black text-zinc-400">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="btn btn-secondary-dark btn-sm disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
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

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
