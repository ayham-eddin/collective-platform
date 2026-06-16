import { CalendarDays, Clock, MapPin } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { EventCard } from "../../components/EventCard/EventCard";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicEvents } from "../../services/events.service";
import { getPublicHomeContent } from "../../services/homeContent.service";
import type { EventItem } from "../../types/event.types";
import type {
  HomeContentItem,
  LocalizedText,
} from "../../types/homeContent.types";

const fallbackHeroImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const localeMap = {
  de: "de-DE",
  en: "en-GB",
  ar: "ar",
};

const pageText = {
  upcomingEyebrow: {
    de: "Kommende Events",
    en: "Upcoming Events",
    ar: "الفعاليات القادمة",
  },
  upcomingTitle: {
    de: "Kommende Events",
    en: "Upcoming Events",
    ar: "الفعاليات القادمة",
  },
  loadingEvents: {
    de: "Events werden geladen...",
    en: "Loading events...",
    ar: "جاري تحميل الفعاليات...",
  },
  noEvents: {
    de: "Noch keine veröffentlichten Events.",
    en: "No published events yet.",
    ar: "لا توجد فعاليات منشورة بعد.",
  },
  eventFallback: {
    de: "Event",
    en: "Event",
    ar: "فعالية",
  },
  lineup: {
    de: "LINEUP",
    en: "LINEUP",
    ar: "البرنامج",
  },
  buyTickets: {
    de: "Tickets kaufen",
    en: "Buy tickets",
    ar: "شراء التذاكر",
  },
  pastEyebrow: {
    de: "Vergangene Events",
    en: "Past Events",
    ar: "فعاليات سابقة",
  },
  pastTitle: {
    de: "Frühere Veranstaltungen, die wir organisiert haben",
    en: "Previous events we organized",
    ar: "فعاليات سابقة قمنا بتنظيمها",
  },
};

export const HomePage = () => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [homeContent, setHomeContent] = useState<HomeContentItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadHomePageData = async () => {
      try {
        const [eventsData, contentData] = await Promise.all([
          getPublicEvents(),
          getPublicHomeContent(),
        ]);

        setEvents(eventsData);
        setHomeContent(contentData);
      } catch {
        setErrorMessage("Could not load homepage content");
      } finally {
        setIsLoading(false);
      }
    };

    void loadHomePageData();
  }, []);

  const featuredEvent = useMemo(() => {
    return events.find((event) => event.isFeatured) || events[0];
  }, [events]);

  const pastEvents = useMemo(() => {
    return events.filter((event) => event._id !== featuredEvent?._id);
  }, [events, featuredEvent]);

  const featuredDate = featuredEvent
    ? new Date(featuredEvent.eventDate).toLocaleDateString(
        localeMap[language],
        {
          day: "2-digit",
          month: "long",
          year: "numeric",
        },
      )
    : "";

  const heroImageUrl = homeContent?.heroImage?.url || fallbackHeroImageUrl;

  return (
    <main className="bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[760px] overflow-hidden bg-black text-white">
        <div className="absolute inset-0">
          <img
            src={heroImageUrl}
            alt={getLocalizedText(
              homeContent?.heroTitle,
              language,
              "Schu Fi Ma Fi Kollektiv",
            )}
            className="h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/55 to-black/20" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/20" />
        </div>

        <div className="relative mx-auto flex min-h-[760px] max-w-7xl items-center px-6 py-24">
          <div className="max-w-3xl">
            <p className="text-lg font-black uppercase tracking-[0.35em] text-violet-300">
              {getLocalizedText(
                homeContent?.heroBadge,
                language,
                "Schu Fi Ma Fi Kollektiv",
              )}
            </p>

            <h1 className="mt-6 text-6xl font-black leading-none tracking-tight md:text-8xl">
              {getLocalizedText(
                homeContent?.heroTitle,
                language,
                "Kultur, Musik und Events in NRW.",
              )}
            </h1>

            <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-200">
              {getLocalizedText(
                homeContent?.heroSubtitle,
                language,
                "Ein syrisches kulturelles Kollektiv, das seit 2018 in Nordrhein-Westfalen aktiv ist.",
              )}
            </p>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link
                to={homeContent?.primaryButton.url || "/events"}
                className="rounded-full bg-violet-500 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-400"
              >
                {getLocalizedText(
                  homeContent?.primaryButton.label,
                  language,
                  "Events ansehen",
                )}
              </Link>

              <Link
                to={homeContent?.secondaryButton.url || "/about"}
                className="rounded-full border border-white/30 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-white hover:text-black"
              >
                {getLocalizedText(
                  homeContent?.secondaryButton.label,
                  language,
                  "Über uns",
                )}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {errorMessage && (
        <p className="mx-auto max-w-7xl px-6 pt-8 text-red-500">
          {errorMessage}
        </p>
      )}

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="text-lg font-bold italic text-violet-400">
            {pageText.upcomingEyebrow[language]}
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
            {pageText.upcomingTitle[language]}
          </h2>

          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-violet-500" />
        </div>

        {isLoading && (
          <p className="mt-12 text-center text-zinc-500">
            {pageText.loadingEvents[language]}
          </p>
        )}

        {!isLoading && !errorMessage && !featuredEvent && (
          <p className="mt-12 text-center text-zinc-500">
            {pageText.noEvents[language]}
          </p>
        )}

        {featuredEvent && (
          <div className="mt-16 grid items-center gap-12 lg:grid-cols-[1.08fr_0.92fr]">
            <div className="relative overflow-hidden rounded-[2rem] bg-zinc-900 shadow-2xl shadow-black/25">
              {featuredEvent.coverImage && (
                <img
                  src={featuredEvent.coverImage.url}
                  alt={getLocalizedText(
                    featuredEvent.coverImage.alt,
                    language,
                    getLocalizedText(
                      featuredEvent.title,
                      language,
                      pageText.eventFallback[language],
                    ),
                  )}
                  className="h-[560px] w-full object-cover"
                />
              )}
            </div>

            <div>
              <p className="text-xl font-bold italic text-violet-400">
                {featuredEvent.category || pageText.eventFallback[language]}
              </p>

              <h3 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
                {getLocalizedText(
                  featuredEvent.title,
                  language,
                  pageText.eventFallback[language],
                )}
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
                {getLocalizedText(featuredEvent.description, language, "")}
              </p>

              {featuredEvent.lineup.length > 0 && (
                <div className="mt-6 text-xl leading-9 text-zinc-800">
                  <p className="font-black">
                    ———— {pageText.lineup[language]} ————
                  </p>
                  {featuredEvent.lineup.map((artist) => (
                    <p key={artist}>– {artist}</p>
                  ))}
                </div>
              )}

              <div className="mt-10 flex items-center justify-between gap-4 bg-violet-500 px-7 py-6 text-white">
                <div className="flex items-center gap-3 font-black">
                  <MapPin size={22} />
                  {getLocalizedText(featuredEvent.location, language, "")}
                </div>

                {featuredEvent.ticketUrl && (
                  <a
                    href={featuredEvent.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="rounded-full bg-white/25 px-7 py-4 text-sm font-black uppercase tracking-wide transition hover:bg-white hover:text-violet-700"
                  >
                    {pageText.buyTickets[language]}
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
            {pageText.pastEyebrow[language]}
          </p>

          <h2 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
            {pageText.pastTitle[language]}
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
              {getLocalizedText(
                homeContent?.aboutEyebrow,
                language,
                "Zusammenarbeit beginnen",
              )}
            </p>

            <h2 className="mt-6 text-5xl font-black leading-tight tracking-tight md:text-6xl">
              {getLocalizedText(
                homeContent?.aboutTitle,
                language,
                "Sind Sie bereit, Ihr bestes Event mit uns zu veranstalten?",
              )}
            </h2>

            <p className="mt-8 text-lg leading-8 text-zinc-800">
              {getLocalizedText(
                homeContent?.aboutText,
                language,
                "Sie suchen ein Team, das Veranstaltungen mit Kultur, Community und Erfahrung organisiert?",
              )}
            </p>

            <Link
              to={homeContent?.aboutButton.url || "/events"}
              className="mt-10 inline-flex rounded-full bg-violet-400 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500"
            >
              {getLocalizedText(
                homeContent?.aboutButton.label,
                language,
                "Unsere Events",
              )}
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
};

const getLocalizedText = (
  value: LocalizedText | undefined,
  language: keyof LocalizedText,
  fallback: string,
) => {
  return value?.[language] || value?.de || fallback;
};
