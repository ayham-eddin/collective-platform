import { useEffect, useMemo, useState } from "react";
import { EventCard } from "../../components/EventCard/EventCard";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicEvents } from "../../services/events.service";
import type { EventItem, LocalizedText } from "../../types/event.types";

const fallbackHeroImage =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const pageText = {
  heroEyebrow: {
    de: "Events",
    en: "Events",
    ar: "الفعاليات",
  },
  heroTitle: {
    de: "Veranstaltungen & kulturelle Momente",
    en: "Events & cultural moments",
    ar: "فعاليات ولحظات ثقافية",
  },
  heroSubtitle: {
    de: "Entdecke kommende Events, Konzerte, Festivals und Community Treffen von Schu Fi Ma Fi.",
    en: "Discover upcoming events, concerts, festivals and community gatherings by Schu Fi Ma Fi.",
    ar: "اكتشف الفعاليات القادمة والحفلات والمهرجانات ولقاءات المجتمع من شو في ما في.",
  },
  featuredEyebrow: {
    de: "Featured Events",
    en: "Featured Events",
    ar: "فعاليات مميزة",
  },
  featuredTitle: {
    de: "Aktuelle Highlights",
    en: "Current Highlights",
    ar: "أبرز الفعاليات الحالية",
  },
  featuredDescription: {
    de: "Hier findest du die wichtigsten veröffentlichten Veranstaltungen.",
    en: "Here you can find the most important published events.",
    ar: "هنا تجد أهم الفعاليات المنشورة.",
  },
  loading: {
    de: "Events werden geladen...",
    en: "Loading events...",
    ar: "جاري تحميل الفعاليات...",
  },
  noEvents: {
    de: "Noch keine veröffentlichten Events.",
    en: "No published events yet.",
    ar: "لا توجد فعاليات منشورة بعد.",
  },
  noFeatured: {
    de: "Noch keine Featured Events.",
    en: "No featured events yet.",
    ar: "لا توجد فعاليات مميزة بعد.",
  },
  showPrevious: {
    de: "Vergangene Events anzeigen",
    en: "Show previous events",
    ar: "عرض الفعاليات السابقة",
  },
  hidePrevious: {
    de: "Vergangene Events ausblenden",
    en: "Hide previous events",
    ar: "إخفاء الفعاليات السابقة",
  },
  previousEyebrow: {
    de: "Previous Events",
    en: "Previous Events",
    ar: "فعاليات سابقة",
  },
  previousTitle: {
    de: "Vergangene Events",
    en: "Past Events",
    ar: "فعاليات سابقة",
  },
};

export const EventsPage = () => {
  const { language } = useLanguage();
  const [events, setEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPreviousEvents, setShowPreviousEvents] = useState(false);

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

  const featuredEvents = useMemo(() => {
    return events.filter((event) => event.isFeatured);
  }, [events]);

  const previousEvents = useMemo(() => {
    return events.filter((event) => !event.isFeatured);
  }, [events]);

  const heroEvent = featuredEvents[0] || events[0];

  return (
    <main className="bg-[#0b0b10] text-white">
      <section className="relative min-h-[460px] overflow-hidden bg-black">
        <img
          src={heroEvent?.coverImage?.url || fallbackHeroImage}
          alt={getLocalizedText(
            heroEvent?.title,
            language,
            "Schu Fi Ma Fi Events",
          )}
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/65 to-black/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-transparent to-black/30" />

        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-end px-6 py-20">
          <div className="max-w-4xl">
            <p className="text-lg font-black uppercase tracking-[0.35em] text-violet-300">
              {pageText.heroEyebrow[language]}
            </p>

            <h1 className="mt-5 text-6xl font-black leading-none tracking-tight md:text-8xl">
              {pageText.heroTitle[language]}
            </h1>

            <p className="mt-6 max-w-2xl text-xl leading-8 text-zinc-300">
              {pageText.heroSubtitle[language]}
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
                {pageText.featuredEyebrow[language]}
              </p>

              <h2 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
                {pageText.featuredTitle[language]}
              </h2>
            </div>

            <p className="max-w-xl text-zinc-400">
              {pageText.featuredDescription[language]}
            </p>
          </div>

          {isLoading && (
            <p className="text-zinc-400">{pageText.loading[language]}</p>
          )}

          {errorMessage && <p className="text-red-400">{errorMessage}</p>}

          {!isLoading && !errorMessage && events.length === 0 && (
            <p className="text-zinc-400">{pageText.noEvents[language]}</p>
          )}

          {!isLoading && !errorMessage && featuredEvents.length === 0 && (
            <p className="text-zinc-400">{pageText.noFeatured[language]}</p>
          )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {previousEvents.length > 0 && (
            <div className="mt-16 text-center">
              <button
                type="button"
                onClick={() =>
                  setShowPreviousEvents((currentValue) => !currentValue)
                }
                className="rounded-full border border-white/15 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:border-violet-300 hover:text-violet-300"
              >
                {showPreviousEvents
                  ? pageText.hidePrevious[language]
                  : pageText.showPrevious[language]}
              </button>
            </div>
          )}

          {showPreviousEvents && previousEvents.length > 0 && (
            <section className="mt-20 border-t border-white/10 pt-16">
              <div className="mb-12">
                <p className="text-lg font-bold italic text-violet-300">
                  {pageText.previousEyebrow[language]}
                </p>

                <h2 className="mt-3 text-5xl font-black tracking-tight md:text-6xl">
                  {pageText.previousTitle[language]}
                </h2>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {previousEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </section>
          )}
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
