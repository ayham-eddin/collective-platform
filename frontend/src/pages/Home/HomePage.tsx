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
        const [eventsResponse, contentData] = await Promise.all([
          getPublicEvents({
            page: 1,
            limit: 6,
            search: "",
          }),
          getPublicHomeContent(),
        ]);

        setEvents(eventsResponse.data);
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
    <main className="overflow-hidden bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[620px] overflow-hidden bg-black text-white sm:min-h-[700px] lg:min-h-[760px]">
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

          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/70 to-black/30" />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/20" />
        </div>

        <div className="relative mx-auto flex min-h-[620px] max-w-7xl items-center px-5 py-20 sm:min-h-[700px] sm:px-6 lg:min-h-[760px] lg:py-24">
          <div className="max-w-3xl">
            <p className="break-words text-sm font-black uppercase tracking-[0.28em] text-violet-300 sm:text-base lg:text-lg lg:tracking-[0.35em]">
              {getLocalizedText(
                homeContent?.heroBadge,
                language,
                "Schu Fi Ma Fi Kollektiv",
              )}
            </p>

            <h1 className="mt-6 max-w-[95vw] break-words text-[3rem] font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              {getLocalizedText(
                homeContent?.heroTitle,
                language,
                "Kultur, Musik und Events in NRW.",
              )}
            </h1>

            <p className="mt-7 max-w-2xl text-base leading-8 text-zinc-200 sm:text-lg lg:text-xl lg:leading-9">
              {getLocalizedText(
                homeContent?.heroSubtitle,
                language,
                "Ein syrisches kulturelles Kollektiv, das seit 2018 in Nordrhein-Westfalen aktiv ist.",
              )}
            </p>

            <div className="mt-9 flex gap-3">
              <Link
                to={homeContent?.primaryButton.url || "/events"}
                className="btn btn-primary"
              >
                {getLocalizedText(
                  homeContent?.primaryButton.label,
                  language,
                  "Events ansehen",
                )}
              </Link>

              <Link
                to={homeContent?.secondaryButton.url || "/about"}
                className="btn btn-secondary-dark"
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
        <p className="mx-auto max-w-7xl px-5 pt-8 text-red-500 sm:px-6">
          {errorMessage}
        </p>
      )}

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-center">
          <p className="text-base font-bold italic text-violet-500 sm:text-lg">
            {pageText.upcomingEyebrow[language]}
          </p>

          <h2 className="mt-4 break-words text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
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
          <div className="mt-12 grid items-center gap-10 lg:mt-16 lg:grid-cols-[1.08fr_0.92fr] lg:gap-12">
            <div className="relative overflow-hidden rounded-[1.5rem] bg-zinc-900 shadow-2xl shadow-black/25 sm:rounded-[2rem]">
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
                  className="h-[320px] w-full object-cover sm:h-[420px] lg:h-[560px]"
                />
              )}
            </div>

            <div>
              <p className="text-base font-bold italic text-violet-500 sm:text-xl">
                {featuredEvent.category || pageText.eventFallback[language]}
              </p>

              <h3 className="mt-4 break-words text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                {getLocalizedText(
                  featuredEvent.title,
                  language,
                  pageText.eventFallback[language],
                )}
              </h3>

              <div className="mt-7 grid gap-3 sm:flex sm:flex-wrap">
                <div className="inline-flex items-center gap-3 rounded-2xl bg-violet-200 px-5 py-4 text-sm font-semibold text-zinc-900 sm:text-base">
                  <CalendarDays size={20} />
                  {featuredDate}
                </div>

                <div className="inline-flex items-center gap-3 rounded-2xl bg-violet-200 px-5 py-4 text-sm font-semibold text-zinc-900 sm:text-base">
                  <Clock size={20} />
                  {featuredEvent.startTime}
                  {featuredEvent.endTime ? ` - ${featuredEvent.endTime}` : ""}
                </div>
              </div>

              <p className="mt-7 break-words text-base leading-8 text-zinc-800 sm:text-lg lg:text-xl lg:leading-9">
                {getLocalizedText(featuredEvent.description, language, "")}
              </p>

              {featuredEvent.lineup.length > 0 && (
                <div className="mt-6 break-words text-base leading-8 text-zinc-800 sm:text-lg">
                  <p className="font-black">{pageText.lineup[language]}</p>
                  {featuredEvent.lineup.map((artist) => (
                    <p key={artist}>– {artist}</p>
                  ))}
                </div>
              )}

              <div className="mt-9 grid gap-4 rounded-[1.5rem] bg-violet-600 px-5 py-5 text-white sm:flex sm:items-center sm:justify-between sm:px-7 sm:py-6">
                <div className="flex items-start gap-3 break-words font-black">
                  <MapPin size={22} className="mt-0.5 shrink-0" />
                  {getLocalizedText(featuredEvent.location, language, "")}
                </div>

                {featuredEvent.ticketUrl && (
                  <a
                    href={featuredEvent.ticketUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary-light"
                  >
                    {pageText.buyTickets[language]}
                  </a>
                )}
              </div>
            </div>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-center">
          <p className="text-base font-bold italic text-violet-500 sm:text-lg">
            {pageText.pastEyebrow[language]}
          </p>

          <h2 className="mt-4 break-words text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
            {pageText.pastTitle[language]}
          </h2>

          <div className="mx-auto mt-6 h-1 w-24 rounded-full bg-violet-500" />
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:mt-16 lg:grid-cols-3">
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
        <div className="min-h-[320px] bg-[radial-gradient(circle_at_center,#312e81,#0b0b10)] sm:min-h-[420px] lg:min-h-[520px]" />

        <div className="flex items-center px-5 py-16 sm:px-6 sm:py-20 lg:px-20">
          <div className="max-w-2xl">
            <p className="text-base font-bold italic text-violet-500 sm:text-xl">
              {getLocalizedText(
                homeContent?.aboutEyebrow,
                language,
                "Zusammenarbeit beginnen",
              )}
            </p>

            <h2 className="mt-5 break-words text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
              {getLocalizedText(
                homeContent?.aboutTitle,
                language,
                "Sind Sie bereit, Ihr bestes Event mit uns zu veranstalten?",
              )}
            </h2>

            <p className="mt-7 text-base leading-8 text-zinc-800 sm:text-lg">
              {getLocalizedText(
                homeContent?.aboutText,
                language,
                "Sie suchen ein Team, das Veranstaltungen mit Kultur, Community und Erfahrung organisiert?",
              )}
            </p>

            <Link
              to={homeContent?.aboutButton.url || "/events"}
              className="btn btn-primary mt-9"
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
