import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { getStoredAdmin } from "../../../services/auth.service";
import {
  deleteAdminEvent,
  getAdminEvents,
} from "../../../services/events.service";
import type { EventItem, EventStatus } from "../../../types/event.types";
import { hasPermission } from "../../../utils/permissions";

export const AdminEventsPage = () => {
  const admin = getStoredAdmin();

  const canCreateEvent = hasPermission(admin, "events", "create");
  const canUpdateEvent = hasPermission(admin, "events", "update");
  const canDeleteEvent = hasPermission(admin, "events", "delete");

  const [events, setEvents] = useState<EventItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [statusFilter, setStatusFilter] = useState<EventStatus | "all">("all");
  const [featuredFilter, setFeaturedFilter] = useState<
    "all" | "true" | "false"
  >("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  const loadEvents = async (targetPage: number) => {
    const response = await getAdminEvents({
      page: targetPage,
      limit,
      status: statusFilter,
      featured: featuredFilter,
      search,
    });

    setEvents(response.data);
    setTotalPages(response.pagination.totalPages || 1);
    setTotalItems(response.pagination.totalItems);
  };

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await loadEvents(page);
      } catch {
        setErrorMessage("Could not load admin events.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter, featuredFilter, search]);

  const handleDelete = async (eventId: string) => {
    if (!canDeleteEvent) {
      setErrorMessage("You do not have permission to delete events.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) {
      return;
    }

    setDeleteMessage("");
    setErrorMessage("");

    try {
      await deleteAdminEvent(eventId);
      await loadEvents(page);
      setDeleteMessage("Event deleted successfully.");
    } catch {
      setErrorMessage("Could not delete event.");
    }
  };

  const handleApplySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusFilterChange = (value: EventStatus | "all") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleFeaturedFilterChange = (value: "all" | "true" | "false") => {
    setFeaturedFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Events
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Manage Events
          </h1>

          <p className="mt-4 text-zinc-400">
            Create, edit, publish, filter and delete events from here.
          </p>
        </div>

        {canCreateEvent ? (
          <Link
            to="/admin/events/create"
            className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500"
          >
            <Plus size={18} />
            Add Event
          </Link>
        ) : (
          <button
            type="button"
            disabled
            title="You do not have permission to create events"
            className="inline-flex cursor-not-allowed items-center gap-2 rounded-full bg-zinc-700 px-5 py-3 text-sm font-black uppercase tracking-wide text-zinc-400 opacity-60"
          >
            <Plus size={18} />
            Add Event
          </button>
        )}
      </div>

      {errorMessage && (
        <p className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          {errorMessage}
        </p>
      )}

      {deleteMessage && (
        <p className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
          {deleteMessage}
        </p>
      )}

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black">Events List</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Total results: {totalItems}
            </p>
          </div>

          <form onSubmit={handleApplySearch} className="flex gap-3">
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search events..."
              className={inputClassName}
            />

            <button
              type="submit"
              className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-500"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-3">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-300">Status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusFilterChange(
                  event.target.value as EventStatus | "all",
                )
              }
              className={inputClassName}
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-300">Featured</span>
            <select
              value={featuredFilter}
              onChange={(event) =>
                handleFeaturedFilterChange(
                  event.target.value as "all" | "true" | "false",
                )
              }
              className={inputClassName}
            >
              <option value="all">All events</option>
              <option value="true">Featured only</option>
              <option value="false">Not featured</option>
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
              <option value={5}>5 events</option>
              <option value={10}>10 events</option>
              <option value={20}>20 events</option>
            </select>
          </label>
        </div>

        {isLoading && <p className="mt-10 text-zinc-400">Loading events...</p>}

        {!isLoading && !errorMessage && events.length === 0 && (
          <p className="mt-10 text-zinc-400">No events found.</p>
        )}

        {!isLoading && events.length > 0 && (
          <div className="mt-10 overflow-hidden rounded-3xl border border-white/10">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <thead className="bg-white/[0.04] text-left text-sm text-zinc-400">
                  <tr>
                    <th className="px-6 py-4">Event</th>
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Category</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Featured</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {events.map((event) => (
                    <tr
                      key={event._id}
                      className="transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-5">
                        <div className="flex items-center gap-4">
                          {event.coverImage && (
                            <img
                              src={event.coverImage.url}
                              alt={event.title.de}
                              className="h-16 w-24 rounded-2xl object-cover"
                            />
                          )}

                          <div>
                            <p className="font-black text-white">
                              {event.title.de}
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                              /events/{event.slug}
                            </p>
                          </div>
                        </div>
                      </td>

                      <td className="px-6 py-5 text-zinc-300">
                        {new Date(event.eventDate).toLocaleDateString("de-DE")}
                      </td>

                      <td className="px-6 py-5 text-zinc-300">
                        {event.category || "—"}
                      </td>

                      <td className="px-6 py-5">
                        <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-zinc-300">
                          {event.status}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <span className="text-zinc-300">
                          {event.isFeatured ? "Yes" : "No"}
                        </span>
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {canUpdateEvent ? (
                            <Link
                              to={`/admin/events/${event._id}/edit`}
                              className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                              aria-label="Edit event"
                            >
                              <Edit size={17} />
                            </Link>
                          ) : (
                            <button
                              type="button"
                              disabled
                              title="You do not have permission to edit events"
                              className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-full border border-white/10 text-zinc-600 opacity-50"
                              aria-label="Edit event disabled"
                            >
                              <Edit size={17} />
                            </button>
                          )}

                          <button
                            type="button"
                            onClick={() => void handleDelete(event._id)}
                            disabled={!canDeleteEvent}
                            title={
                              canDeleteEvent
                                ? undefined
                                : "You do not have permission to delete events"
                            }
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:text-zinc-600 disabled:opacity-50"
                            aria-label="Delete event"
                          >
                            <Trash2 size={17} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-bold text-zinc-400">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
