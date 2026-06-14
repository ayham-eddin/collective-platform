import { Link } from "react-router-dom";
import type { EventItem } from "../../types/event.types";

interface EventCardProps {
  event: EventItem;
}

export const EventCard = ({ event }: EventCardProps) => {
  return (
    <article className="overflow-hidden rounded-3xl border border-white/10 bg-[#171720] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40">
      {event.coverImage && (
        <Link to={`/events/${event.slug}`} className="block overflow-hidden">
          <img
            src={event.coverImage.url}
            alt={event.coverImage.alt?.en || event.title.en}
            className="h-64 w-full object-cover transition duration-500 hover:scale-105"
          />
        </Link>
      )}

      <div className="p-6">
        <p className="text-sm font-bold italic text-violet-300">
          {event.category || "Event"}
        </p>

        <h3 className="mt-2 text-3xl font-black tracking-tight">
          <Link
            to={`/events/${event.slug}`}
            className="text-white transition hover:text-violet-300"
          >
            {event.title.en}
          </Link>
        </h3>

        <p className="mt-4 leading-7 text-zinc-400">
          {event.shortDescription.en}
        </p>

        <p className="mt-5 font-semibold text-white">
          {new Date(event.eventDate).toLocaleDateString("en-GB")} ·{" "}
          {event.startTime}
          {event.endTime ? ` - ${event.endTime}` : ""}
        </p>

        <p className="mt-1 text-zinc-400">{event.location.en}</p>

        {event.ticketUrl && (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-500"
          >
            Buy tickets
          </a>
        )}
      </div>
    </article>
  );
};
