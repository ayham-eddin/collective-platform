import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EventCard } from "../../components/EventCard/EventCard";
import { getPublicEvents } from "../../services/events.service";
import type { EventItem } from "../../types/event.types";

const heroImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

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

  const featuredEvent = useMemo(() => {
    return events.find((event) => event.isFeatured) || events[0];
  }, [events]);

  const pastEvents = useMemo(() => {
    return events.filter((event) => event._id !== featuredEvent?._id);
  }, [events, featuredEvent]);

  const featuredDate = featuredEvent
    ? new Date(featuredEvent.eventDate).toLocaleDateString("de-DE", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      })
    : "";

  return (
    <main className="bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[760px] overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt="Schu Fi Ma Fi Kollektiv event atmosphere"
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>

        <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-lg font-black uppercase tracking-[0.35em] text-violet-300">
              Schu Fi Ma Fi Kollektiv
            </p>

            <h1 className="mt-6 text-6xl font-black leading-none tracking-tight md:text-8xl">
              Kultur, Musik und Events in NRW.
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-200">
              Ein syrisches kulturelles Kollektiv, das seit 2018 in
              Nordrhein-Westfalen aktiv ist und ein buntes Kulturprogramm für
              Community, Kunst und Begegnung gestaltet.
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to="/events"
                className="rounded-full bg-violet-500 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-400"
              >
                Events ansehen
              </Link>

              <a
                href="#about-preview"
                className="rounded-full border border-white/30 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
              >
                Über uns
              </a>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-lg font-bold italic text-violet-400">
            Kommende Events
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
            Kommende Events
          </h2>

          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-violet-500" />
        </div>

        {isLoading && (
          <p className="mt-12 text-center text-zinc-500">Loading events...</p>
        )}

        {errorMessage && (
          <p className="mt-12 text-center text-red-500">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && !featuredEvent && (
          <p className="mt-12 text-center text-zinc-500">
            No published events yet.
          </p>
        )}

        {featuredEvent && (
          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl shadow-black/25">
              {featuredEvent.coverImage && (
                <img
                  src={featuredEvent.coverImage.url}
                  alt={
                    featuredEvent.coverImage.alt?.de || featuredEvent.title.de
                  }
                  className="h-[560px] w-full object-cover"
                />
              )}

              <button
                type="button"
                className="absolute left-6 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-3xl text-white backdrop-blur transition hover:bg-black"
                aria-label="Previous image"
              >
                ‹
              </button>

              <button
                type="button"
                className="absolute right-6 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-black/40 text-3xl text-white backdrop-blur transition hover:bg-black"
                aria-label="Next image"
              >
                ›
              </button>

              <div className="absolute bottom-6 left-0 right-0 flex justify-center gap-2">
                {[0, 1, 2, 3, 4].map((dot) => (
                  <span
                    key={dot}
                    className={`h-2.5 w-2.5 rounded-full ${
                      dot === 0 ? "bg-black" : "bg-white/50"
                    }`}
                  />
                ))}
              </div>
            </div>

            <div>
              <p className="text-xl font-bold italic text-violet-400">
                {featuredEvent.category || "Event"}
              </p>

              <h3 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
                {featuredEvent.title.de}
              </h3>

              <div className="mt-8 flex flex-wrap gap-4">
                <div className="inline-flex items-center gap-3 bg-violet-200 px-5 py-4 font-semibold text-zinc-900">
                  <CalendarDays size={20} />
                  {featuredDate}
                </div>

                <div className="inline-flex items-center gap-3 bg-violet-200 px-5 py-4 font-semibold text-zinc-900">
                  <Clock size={20} />
                  {featuredEvent.startTime}
                  {featuredEvent.endTime ? ` - ${featuredEvent.endTime}` : ""}
                </div>
              </div>

              <p className="mt-8 text-xl leading-9 text-zinc-800">
                {featuredEvent.description.de}
              </p>

              {featuredEvent.lineup.length > 0 && (
                <div className="mt-6 text-xl leading-9 text-zinc-800">
                  <p className="font-black">———— LINEUP ————</p>
                  {featuredEvent.lineup.map((artist) => (
                    <p key={artist}>– {artist}</p>
                  ))}
                </div>
              )}

              <div className="mt-10 flex items-center justify-between gap-4 bg-violet-500 px-7 py-6 text-white">
                <div className="flex items-center gap-3 font-black">
                  <MapPin size={22} />
                  {featuredEvent.location.de}
                </div>

                {featuredEvent.ticketUrl && (
                  <a
                    href={featuredEvent.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/25 px-7 py-4 text-sm font-black uppercase tracking-wide transition hover:bg-white hover:text-violet-700"
                  >
                    Tickets kaufen
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-lg font-bold italic text-violet-400">
            Vergangene Events
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
            Frühere Veranstaltungen, die wir organisiert haben
          </h2>

          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-violet-500" />
        </div>

        <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {(pastEvents.length > 0 ? pastEvents : events)
            .slice(0, 6)
            .map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
        </div>
      </section>

      <section
        id="about-preview"
        className="grid bg-[#dfe3f7] text-[#252530] lg:grid-cols-2"
      >
        <div className="min-h-[520px] bg-[radial-gradient(circle_at_center,#312e81,#0b0b10)]" />

        <div className="flex items-center px-6 py-20 lg:px-20">
          <div className="max-w-2xl">
            <p className="text-xl font-bold italic text-violet-400">
              Zusammenarbeit beginnen
            </p>

            <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight md:text-6xl">
              Sind Sie bereit, Ihr bestes Event mit uns zu veranstalten?
            </h2>

            <p className="mt-8 text-lg leading-8 text-zinc-800">
              Sie suchen ein Team, das Veranstaltungen mit Kultur, Community und
              Erfahrung organisiert? Wir entwickeln Programme, Events und
              Begegnungen mit Leidenschaft.
            </p>

            <Link
              to="/events"
              className="mt-10 inline-flex rounded-full bg-violet-400 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500"
            >
              Unsere Events
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};
