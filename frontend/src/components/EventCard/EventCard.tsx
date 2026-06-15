import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import type { EventItem } from "../../types/event.types";

interface EventCardProps {
  event: EventItem;
  variant?: "overlay" | "default";
}

export const EventCard = ({ event, variant = "overlay" }: EventCardProps) => {
  const eventDate = new Date(event.eventDate).toLocaleDateString("de-DE", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });

  if (variant === "default") {
    return (
      <article className="overflow-hidden rounded-[2rem] border border-white/10 bg-[#171720] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40">
        {event.coverImage && (
          <Link to={`/events/${event.slug}`} className="block overflow-hidden">
            <img
              src={event.coverImage.url}
              alt={event.coverImage.alt?.de || event.title.de}
              className="h-72 w-full object-cover transition duration-700 hover:scale-105"
            />
          </Link>
        )}

        <div className="p-7">
          <p className="text-sm font-bold italic text-violet-300">
            {event.category || "Event"}
          </p>

          <h3 className="mt-2 text-3xl font-black tracking-tight">
            <Link
              to={`/events/${event.slug}`}
              className="text-white transition hover:text-violet-300"
            >
              {event.title.de}
            </Link>
          </h3>

          <p className="mt-4 line-clamp-3 leading-7 text-zinc-400">
            {event.shortDescription.de}
          </p>

          <div className="mt-6 grid gap-3 text-sm font-semibold text-zinc-300">
            <p className="flex items-center gap-2">
              <CalendarDays size={18} className="text-violet-300" />
              {eventDate} · {event.startTime}
              {event.endTime ? ` - ${event.endTime}` : ""}
            </p>

            <p className="flex items-center gap-2">
              <MapPin size={18} className="text-violet-300" />
              {event.location.de}
            </p>
          </div>

          <div className="mt-7 flex flex-wrap gap-3">
            <Link
              to={`/events/${event.slug}`}
              className="rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-500"
            >
              Mehr erfahren
            </Link>

            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-full border border-white/15 px-5 py-3 text-sm font-black text-white transition hover:border-white hover:bg-white hover:text-black"
              >
                Tickets
              </a>
            )}
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="group relative min-h-[430px] overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl shadow-black/30">
      {event.coverImage && (
        <img
          src={event.coverImage.url}
          alt={event.coverImage.alt?.de || event.title.de}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-black/10 transition duration-500 group-hover:from-black/95" />

      <div className="absolute left-6 top-6 rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white shadow-lg shadow-violet-950/30">
        {event.category || "Event"}
      </div>

      <div className="relative flex min-h-[430px] flex-col justify-end p-7">
        <div className="mb-5 grid gap-2 text-sm font-semibold text-zinc-200">
          <p className="flex items-center gap-2">
            <CalendarDays size={17} className="text-violet-300" />
            {eventDate}
          </p>

          <p className="flex items-center gap-2">
            <MapPin size={17} className="text-violet-300" />
            {event.location.de}
          </p>
        </div>

        <h3 className="text-3xl font-black tracking-tight text-white">
          {event.title.de}
        </h3>

        <p className="mt-3 line-clamp-2 max-w-md leading-7 text-zinc-200">
          {event.shortDescription.de}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <Link
            to={`/events/${event.slug}`}
            className="rounded-full bg-white px-6 py-3 text-sm font-black text-black transition hover:bg-violet-200"
          >
            Mehr erfahren
          </Link>

          {event.ticketUrl && (
            <a
              href={event.ticketUrl}
              target="_blank"
              rel="noreferrer"
              className="rounded-full border border-white/30 px-6 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
            >
              Tickets
            </a>
          )}
        </div>
      </div>
    </article>
  );
};
