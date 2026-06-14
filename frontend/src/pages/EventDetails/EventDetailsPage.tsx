import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getPublicEventBySlug } from "../../services/events.service";
import type { EventItem } from "../../types/event.types";

export const EventDetailsPage = () => {
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadEvent = async () => {
      if (!slug) {
        setErrorMessage("Event slug is missing");
        setIsLoading(false);
        return;
      }

      try {
        const data = await getPublicEventBySlug(slug);
        setEvent(data);
      } catch {
        setErrorMessage("Could not load event");
      } finally {
        setIsLoading(false);
      }
    };

    void loadEvent();
  }, [slug]);

  if (isLoading) {
    return (
      <main className="min-h-screen px-6 py-20 text-zinc-400">
        Loading event...
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="min-h-screen px-6 py-20">
        <p className="text-red-400">{errorMessage || "Event not found"}</p>

        <Link to="/events" className="mt-6 inline-block text-violet-300">
          Back to events
        </Link>
      </main>
    );
  }

  return (
    <main>
      <section
        className="flex min-h-[520px] items-end bg-cover bg-center"
        style={{
          backgroundImage: event.coverImage
            ? `linear-gradient(to bottom, rgba(0,0,0,0.15), #0b0b10), url(${event.coverImage.url})`
            : "linear-gradient(to bottom, #18181b, #0b0b10)",
        }}
      >
        <div className="mx-auto w-full max-w-7xl px-6 py-20">
          <p className="font-extrabold text-violet-300">
            {event.category || "Event"}
          </p>

          <h1 className="mt-4 max-w-5xl text-6xl font-black leading-none tracking-tight md:text-8xl">
            {event.title.en}
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 py-20">
        <p className="text-xl leading-9 text-zinc-300">
          {event.description.en}
        </p>

        <div className="mt-10 grid gap-3 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
          <p>
            <span className="font-bold text-white">Date:</span>{" "}
            <span className="text-zinc-400">
              {new Date(event.eventDate).toLocaleDateString("en-GB")}
            </span>
          </p>

          <p>
            <span className="font-bold text-white">Time:</span>{" "}
            <span className="text-zinc-400">
              {event.startTime}
              {event.endTime ? ` - ${event.endTime}` : ""}
            </span>
          </p>

          <p>
            <span className="font-bold text-white">Location:</span>{" "}
            <span className="text-zinc-400">{event.location.en}</span>
          </p>
        </div>

        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-8 inline-flex rounded-full bg-violet-600 px-6 py-4 font-black text-white transition hover:bg-violet-500"
          >
            Buy tickets
          </a>
        )}

        {event.lineup.length > 0 && (
          <div className="mt-14">
            <h2 className="text-3xl font-black">Lineup</h2>

            <ul className="mt-5 grid gap-2 text-zinc-400">
              {event.lineup.map((artist) => (
                <li key={artist}>{artist}</li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </main>
  );
};
