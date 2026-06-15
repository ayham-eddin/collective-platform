import { useEffect, useMemo, useState } from "react";
import { EventCard } from "../../components/EventCard/EventCard";
import { getPublicEvents } from "../../services/events.service";
import type { EventItem } from "../../types/event.types";

const fallbackHeroImage =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

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

  const heroEvent = useMemo(() => {
    return events.find((event) => event.isFeatured) || events[0];
  }, [events]);

  return (
    <main className="bg-[#0b0b10] text-white">
      <section className="relative min-h-[460px] overflow-hidden bg-black">
        <img
          src={heroEvent?.coverImage?.url || fallbackHeroImage}
          alt={heroEvent?.title.de || "Schu Fi Ma Fi Events"}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-transparent to-black/30" />

        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-end px-6 py-20">
          <div className="max-w-4xl">
            <p className="text-lg font-black uppercase tracking-[0.35em] text-violet-300">
              Events
            </p>

            <h1 className="mt-5 text-6xl font-black leading-none tracking-tight md:text-8xl">
              Veranstaltungen & kulturelle Momente
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
              Entdecke kommende Events, Konzerte, Festivals und Community
              Treffen von Schu Fi Ma Fi.
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-6 py-24">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="relative">
          <div className="mb-12 flex flex-wrap items-end justify-between gap-6">
            <div>
              <p className="text-lg font-bold italic text-violet-300">
                Programm
              </p>

              <h2 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
                Alle Events
              </h2>
            </div>

            <p className="max-w-xl text-zinc-400">
              Hier findest du alle veröffentlichten Veranstaltungen mit Datum,
              Ort, Tickets und weiteren Details.
            </p>
          </div>

          {isLoading && <p className="text-zinc-400">Loading events...</p>}

          {errorMessage && <p className="text-red-400">{errorMessage}</p>}

          {!isLoading && !errorMessage && events.length === 0 && (
            <p className="text-zinc-400">No published events yet.</p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
