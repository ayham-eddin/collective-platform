import { useEffect, useState } from "react";
import { EventCard } from "../../components/EventCard/EventCard";
import { getPublicEvents } from "../../services/events.service";
import type { EventItem } from "../../types/event.types";

export const EventsPage = () => {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadEvents = async () => {
      try {
        const data = await getPublicEvents();
        setEvents(data);
      } catch {
        setErrorMessage("Could not load events");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvents();
  }, []);

  return (
    <main>
      <section className="mx-auto max-w-7xl px-6 pb-10 pt-20">
        <p className="font-bold text-violet-300">Events</p>

        <h1 className="mt-4 text-5xl font-black tracking-tight md:text-7xl">
          All Events
        </h1>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        {isLoading && <p className="text-zinc-400">Loading events...</p>}

        {errorMessage && <p className="text-red-400">{errorMessage}</p>}

        {!isLoading && !errorMessage && events.length === 0 && (
          <p className="text-zinc-400">No published events yet.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
};
