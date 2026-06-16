import {
  CalendarDays,
  Clock,
  Copy,
  ExternalLink,
  MapPin,
  Ticket,
  Video,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicEventBySlug } from "../../services/events.service";
import type { EventItem, LocalizedText } from "../../types/event.types";

const getYoutubeEmbedUrl = (youtubeUrl: string) => {
  if (youtubeUrl.includes("watch?v=")) {
    return youtubeUrl.replace("watch?v=", "embed/");
  }

  if (youtubeUrl.includes("youtu.be/")) {
    return youtubeUrl.replace("youtu.be/", "www.youtube.com/embed/");
  }

  return youtubeUrl;
};

const localeMap = {
  de: "de-DE",
  en: "en-GB",
  ar: "ar",
};

const pageText = {
  loading: {
    de: "Event wird geladen...",
    en: "Loading event...",
    ar: "جاري تحميل الفعالية...",
  },
  notFound: {
    de: "Event nicht gefunden",
    en: "Event not found",
    ar: "لم يتم العثور على الفعالية",
  },
  backToEvents: {
    de: "← Zurück zu Events",
    en: "← Back to events",
    ar: "→ العودة إلى الفعاليات",
  },
  eventFallback: {
    de: "Event",
    en: "Event",
    ar: "فعالية",
  },
  lineup: {
    de: "Lineup",
    en: "Lineup",
    ar: "البرنامج",
  },
  videos: {
    de: "Videos",
    en: "Videos",
    ar: "فيديوهات",
  },
  eventDetails: {
    de: "Event Details",
    en: "Event Details",
    ar: "تفاصيل الفعالية",
  },
  date: {
    de: "Datum",
    en: "Date",
    ar: "التاريخ",
  },
  time: {
    de: "Uhrzeit",
    en: "Time",
    ar: "الوقت",
  },
  location: {
    de: "Ort",
    en: "Location",
    ar: "المكان",
  },
  copyAddress: {
    de: "Adresse kopieren",
    en: "Copy address",
    ar: "نسخ العنوان",
  },
  addressCopied: {
    de: "Adresse kopiert",
    en: "Address copied",
    ar: "تم نسخ العنوان",
  },
  copyFailed: {
    de: "Kopieren fehlgeschlagen",
    en: "Copy failed",
    ar: "فشل النسخ",
  },
  openMaps: {
    de: "Google Maps öffnen",
    en: "Open Google Maps",
    ar: "فتح Google Maps",
  },
  buyTickets: {
    de: "Tickets kaufen",
    en: "Buy tickets",
    ar: "شراء التذاكر",
  },
};

export const EventDetailsPage = () => {
  const { language } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const [event, setEvent] = useState<EventItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [copyMessage, setCopyMessage] = useState("");

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

  const handleCopyAddress = async () => {
    if (!event) {
      return;
    }

    try {
      await navigator.clipboard.writeText(
        getLocalizedText(event.location, language, ""),
      );
      setCopyMessage(pageText.addressCopied[language]);
      window.setTimeout(() => setCopyMessage(""), 1800);
    } catch {
      setCopyMessage(pageText.copyFailed[language]);
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen bg-[#0b0b10] px-6 py-20 text-zinc-400">
        {pageText.loading[language]}
      </main>
    );
  }

  if (errorMessage || !event) {
    return (
      <main className="min-h-screen bg-[#0b0b10] px-6 py-20">
        <p className="text-red-400">
          {errorMessage || pageText.notFound[language]}
        </p>

        <Link to="/events" className="mt-6 inline-block text-violet-300">
          {pageText.backToEvents[language]}
        </Link>
      </main>
    );
  }

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
    pageText.eventFallback[language],
  );

  return (
    <main className="bg-[#0b0b10] text-white">
      <section
        className="relative min-h-[640px] overflow-hidden bg-cover bg-center"
        style={{
          backgroundImage: event.coverImage
            ? `url(${event.coverImage.url})`
            : "linear-gradient(to bottom, #18181b, #0b0b10)",
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-black/20 to-black/30" />

        <div className="relative mx-auto flex min-h-[640px] max-w-7xl items-end px-6 py-20">
          <div className="max-w-5xl">
            <Link
              to="/events"
              className="mb-8 inline-flex rounded-full border border-white/20 px-5 py-3 text-sm font-black text-white transition hover:bg-white hover:text-black"
            >
              {pageText.backToEvents[language]}
            </Link>

            <p className="text-lg font-black uppercase tracking-[0.35em] text-violet-300">
              {event.category || pageText.eventFallback[language]}
            </p>

            <h1 className="mt-5 text-6xl font-black leading-none tracking-tight md:text-8xl">
              {eventTitle}
            </h1>

            <p className="mt-8 max-w-3xl text-xl leading-9 text-zinc-200">
              {getLocalizedText(event.shortDescription, language, "")}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-20 lg:grid-cols-[1fr_380px]">
        <div>
          <p className="text-xl leading-9 text-zinc-300">
            {getLocalizedText(event.description, language, "")}
          </p>

          {event.lineup.length > 0 && (
            <div className="mt-14">
              <h2 className="text-4xl font-black tracking-tight">
                {pageText.lineup[language]}
              </h2>

              <div className="mt-6 flex flex-wrap gap-3">
                {event.lineup.map((artist) => (
                  <span
                    key={artist}
                    className="rounded-full border border-white/10 bg-white/[0.04] px-5 py-3 text-sm font-bold text-zinc-200"
                  >
                    {artist}
                  </span>
                ))}
              </div>
            </div>
          )}

          {event.videos.length > 0 && (
            <div className="mt-16">
              <div className="flex items-center gap-3">
                <Video className="text-violet-300" size={26} />
                <h2 className="text-4xl font-black tracking-tight">
                  {pageText.videos[language]}
                </h2>
              </div>

              <div className="mt-8 grid gap-8">
                {event.videos.map((video) => (
                  <article
                    key={video.youtubeUrl}
                    className="overflow-hidden rounded-[2rem] border border-white/10 bg-white/[0.03]"
                  >
                    <iframe
                      src={getYoutubeEmbedUrl(video.youtubeUrl)}
                      title={getLocalizedText(video.title, language, "Video")}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />

                    <div className="p-6">
                      <h3 className="text-2xl font-black">
                        {getLocalizedText(video.title, language, "Video")}
                      </h3>

                      {video.description && (
                        <p className="mt-2 text-zinc-400">
                          {getLocalizedText(video.description, language, "")}
                        </p>
                      )}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          )}
        </div>

        <aside className="h-fit rounded-[2rem] border border-white/10 bg-white/[0.04] p-6 shadow-2xl shadow-black/20 lg:sticky lg:top-28">
          <h2 className="text-2xl font-black">
            {pageText.eventDetails[language]}
          </h2>

          <div className="mt-6 grid gap-4">
            <DetailRow
              icon={<CalendarDays size={20} />}
              label={pageText.date[language]}
              value={eventDate}
            />

            <DetailRow
              icon={<Clock size={20} />}
              label={pageText.time[language]}
              value={`${event.startTime}${event.endTime ? ` - ${event.endTime}` : ""}`}
            />

            <DetailRow
              icon={<MapPin size={20} />}
              label={pageText.location[language]}
              value={getLocalizedText(event.location, language, "")}
            />
          </div>

          <div className="mt-7 grid gap-3">
            <button
              type="button"
              onClick={() => void handleCopyAddress()}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-4 text-sm font-black text-white transition hover:border-violet-300 hover:text-violet-300"
            >
              <Copy size={18} />
              {pageText.copyAddress[language]}
            </button>

            {copyMessage && (
              <p className="text-center text-sm font-bold text-violet-300">
                {copyMessage}
              </p>
            )}

            {event.googleMapsUrl && (
              <a
                href={event.googleMapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-5 py-4 text-sm font-black text-white transition hover:border-violet-300 hover:text-violet-300"
              >
                <ExternalLink size={18} />
                {pageText.openMaps[language]}
              </a>
            )}

            {event.ticketUrl && (
              <a
                href={event.ticketUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-full bg-violet-600 px-5 py-4 text-sm font-black text-white transition hover:bg-violet-500"
              >
                <Ticket size={18} />
                {pageText.buyTickets[language]}
              </a>
            )}
          </div>
        </aside>
      </section>
    </main>
  );
};

interface DetailRowProps {
  icon: React.ReactNode;
  label: string;
  value: string;
}

const DetailRow = ({ icon, label, value }: DetailRowProps) => {
  return (
    <div className="flex gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
      <div className="mt-1 text-violet-300">{icon}</div>

      <div>
        <p className="text-sm font-bold text-zinc-500">{label}</p>
        <p className="mt-1 font-bold text-zinc-100">{value}</p>
      </div>
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
