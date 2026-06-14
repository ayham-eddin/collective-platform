import { useEffect, useState } from "react";
import { EventCard } from "../../components/EventCard/EventCard";
import { getPublicEvents } from "../../services/events.service";
import type { EventItem } from "../../types/event.types";

export const HomePage = () => {
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
      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="font-bold text-violet-300">Schu Fi Ma Fi Kollektiv</p>

        <h1 className="mt-4 max-w-5xl text-5xl font-black leading-none tracking-tight md:text-8xl">
          Schu Fi Ma Fi Kollektiv
        </h1>

        <p className="mt-6 max-w-3xl text-xl leading-8 text-zinc-400">
          ist ein syrisches kulturelle Kollektiv, das seit 2018 in
          Nordrhein-Westfalen aktiv ist und ein buntes Kulturprogramm in der
          Kulturszene in NRW für alle im Schwerpunkt das syrische Publikum
          gestaltet und präsentiert.
        </p>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-24">
        <h2 className="mb-8 text-4xl font-black tracking-tight">
          Featured Events
        </h2>

        {isLoading && <p className="text-zinc-400">Loading events...</p>}

        {errorMessage && <p className="text-red-400">{errorMessage}</p>}

        {!isLoading && !errorMessage && events.length === 0 && (
          <p className="text-zinc-400">No published events yet.</p>
        )}

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {events.slice(0, 3).map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </div>
      </section>
    </main>
  );
};
