import { Edit, Plus, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  deleteAdminEvent,
  getAdminEvents,
} from "../../../services/events.service";
import type { EventItem } from "../../../types/event.types";

export const AdminEventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [deleteMessage, setDeleteMessage] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getAdminEvents();
        setEvents(data);
      } catch {
        setErrorMessage("Could not load admin events.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvents();
  }, []);

  const handleDelete = async (eventId: string) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this event?",
    );

    if (!confirmed) {
      return;
    }

    setDeleteMessage("");

    try {
      await deleteAdminEvent(eventId);
      setEvents((currentEvents) =>
        currentEvents.filter((event) => event._id !== eventId),
      );
      setDeleteMessage("Event deleted successfully.");
    } catch {
      setErrorMessage("Could not delete event.");
    }
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
            Create, edit, publish and delete events from here.
          </p>
        </div>

        <button
          type="button"
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500"
        >
          <Plus size={18} />
          Add Event
        </button>
      </div>

      {isLoading && <p className="mt-10 text-zinc-400">Loading events...</p>}

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
                        <Link
                          to={`/admin/events/${event._id}/edit`}
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                          aria-label="Edit event"
                        >
                          <Edit size={17} />
                        </Link>

                        <button
                          type="button"
                          onClick={() => void handleDelete(event._id)}
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-red-400 hover:text-red-300"
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
    </section>
  );
};
