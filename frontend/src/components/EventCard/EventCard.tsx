import { CalendarDays, MapPin } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "../../contexts/useLanguage";
import type { EventItem, LocalizedText } from "../../types/event.types";

interface EventCardProps {
  event: EventItem;
  variant?: "overlay" | "default";
}

const localeMap = {
  de: "de-DE",
  en: "en-GB",
  ar: "ar",
};

const cardText = {
  event: {
    de: "Event",
    en: "Event",
    ar: "فعالية",
  },
  readMore: {
    de: "Mehr erfahren",
    en: "Read more",
    ar: "اقرأ المزيد",
  },
  tickets: {
    de: "Tickets",
    en: "Tickets",
    ar: "التذاكر",
  },
};

export const EventCard = ({ event, variant = "overlay" }: EventCardProps) => {
  const { language } = useLanguage();

  const eventDate = new Date(event.eventDate).toLocaleDateString(
    localeMap[language],
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
    },
  );

  const eventTitle = getLocalizedText(
    event.title,
    language,
    cardText.event[language],
  );

  const eventShortDescription = getLocalizedText(
    event.shortDescription,
    language,
    "",
  );

  const eventLocation = getLocalizedText(event.location, language, "");

  if (variant === "default") {
    return (
      <article className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-[#171720] shadow-2xl shadow-black/20 transition duration-300 hover:-translate-y-1 hover:border-violet-400/40 sm:rounded-[2rem]">
        {event.coverImage && (
          <Link to={`/events/${event.slug}`} className="block overflow-hidden">
            <img
              src={event.coverImage.url}
              alt={getLocalizedText(event.coverImage.alt, language, eventTitle)}
              className="h-56 w-full object-cover transition duration-700 hover:scale-105 sm:h-64 lg:h-72"
            />
          </Link>
        )}

        <div className="p-5 sm:p-7">
          <p className="text-sm font-bold italic text-violet-300">
            {event.category || cardText.event[language]}
          </p>

          <h3 className="mt-2 break-words text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
            <Link
              to={`/events/${event.slug}`}
              className="transition hover:text-violet-300"
            >
              {eventTitle}
            </Link>
          </h3>

          {eventShortDescription && (
            <p className="mt-4 line-clamp-3 break-words text-sm leading-7 text-zinc-300 sm:text-base">
              {eventShortDescription}
            </p>
          )}

          <EventMeta
            eventDate={eventDate}
            eventLocation={eventLocation}
            startTime={event.startTime}
            endTime={event.endTime}
          />

          <EventActions event={event} />
        </div>
      </article>
    );
  }

  return (
    <article className="group relative min-h-[420px] overflow-hidden rounded-[1.5rem] bg-zinc-900 shadow-2xl shadow-black/30 sm:min-h-[450px] sm:rounded-[2rem]">
      {event.coverImage && (
        <img
          src={event.coverImage.url}
          alt={getLocalizedText(event.coverImage.alt, language, eventTitle)}
          className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
        />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black via-black/75 to-black/20 transition duration-500 group-hover:from-black group-hover:via-black/80" />

      <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full bg-violet-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white shadow-lg shadow-violet-950/30 sm:left-6 sm:top-6 sm:px-5 sm:py-3 sm:text-sm">
        <span className="line-clamp-1 break-words">
          {event.category || cardText.event[language]}
        </span>
      </div>

      <div className="relative flex min-h-[420px] flex-col justify-end p-5 sm:min-h-[450px] sm:p-7">
        <div className="mb-5 grid gap-2 text-sm font-semibold leading-6 text-zinc-100">
          <p className="flex items-start gap-2">
            <CalendarDays
              size={17}
              className="mt-0.5 shrink-0 text-violet-300"
            />
            <span>{eventDate}</span>
          </p>

          {eventLocation && (
            <p className="flex items-start gap-2">
              <MapPin size={17} className="mt-0.5 shrink-0 text-violet-300" />
              <span className="break-words">{eventLocation}</span>
            </p>
          )}
        </div>

        <h3 className="break-words text-3xl font-black leading-tight tracking-tight text-white">
          {eventTitle}
        </h3>

        {eventShortDescription && (
          <p className="mt-3 line-clamp-3 max-w-md break-words text-base leading-7 text-zinc-200">
            {eventShortDescription}
          </p>
        )}

        <EventActions event={event} />
      </div>
    </article>
  );
};

interface EventMetaProps {
  eventDate: string;
  eventLocation: string;
  startTime: string;
  endTime?: string;
}

const EventMeta = ({
  eventDate,
  eventLocation,
  startTime,
  endTime,
}: EventMetaProps) => {
  return (
    <div className="mt-6 grid gap-3 text-sm font-semibold leading-6 text-zinc-300">
      <p className="flex items-start gap-2">
        <CalendarDays size={18} className="mt-0.5 shrink-0 text-violet-300" />
        <span>
          {eventDate} · {startTime}
          {endTime ? ` - ${endTime}` : ""}
        </span>
      </p>

      {eventLocation && (
        <p className="flex items-start gap-2">
          <MapPin size={18} className="mt-0.5 shrink-0 text-violet-300" />
          <span className="break-words">{eventLocation}</span>
        </p>
      )}
    </div>
  );
};

interface EventActionsProps {
  event: EventItem;
}

const EventActions = ({ event }: EventActionsProps) => {
  const { language } = useLanguage();

  return (
    <div className="mt-6 grid grid-cols-1 gap-3 min-[420px]:grid-cols-2">
      <Link to={`/events/${event.slug}`} className="btn btn-primary">
        {cardText.readMore[language]}
      </Link>

      {event.ticketUrl && (
        <a
          href={event.ticketUrl}
          target="_blank"
          rel="noreferrer"
          className="btn btn-secondary-dark"
        >
          {cardText.tickets[language]}
        </a>
      )}
    </div>
  );
};

const getLocalizedText = (
  value: LocalizedText | undefined,
  language: keyof LocalizedText,
  fallback: string,
) => {
  return value?.[language] || value?.de || fallback;
};
