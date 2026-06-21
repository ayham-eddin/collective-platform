import { useEffect, useState, type FormEvent } from "react";
import { EventCard } from "../../components/EventCard/EventCard";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicGroupedEvents } from "../../services/events.service";
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
  upcomingEyebrow: {
    de: "Upcoming Events",
    en: "Upcoming Events",
    ar: "الفعاليات القادمة",
  },
  upcomingTitle: {
    de: "Kommende Events",
    en: "Upcoming Events",
    ar: "الفعاليات القادمة",
  },
  upcomingDescription: {
    de: "Die nächsten veröffentlichten Veranstaltungen werden automatisch nach Datum sortiert.",
    en: "The next published events are automatically sorted by date.",
    ar: "يتم ترتيب الفعاليات القادمة تلقائياً حسب التاريخ الأقرب.",
  },
  searchPlaceholder: {
    de: "Events suchen...",
    en: "Search events...",
    ar: "ابحث عن فعالية...",
  },
  searchButton: {
    de: "Suchen",
    en: "Search",
    ar: "بحث",
  },
  clearButton: {
    de: "Zurücksetzen",
    en: "Clear",
    ar: "مسح",
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
  noUpcoming: {
    de: "Aktuell keine kommenden Events.",
    en: "No upcoming events at the moment.",
    ar: "لا توجد فعاليات قادمة حالياً.",
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
  previous: {
    de: "Zurück",
    en: "Previous",
    ar: "السابق",
  },
  next: {
    de: "Weiter",
    en: "Next",
    ar: "التالي",
  },
  page: {
    de: "Seite",
    en: "Page",
    ar: "الصفحة",
  },
  of: {
    de: "von",
    en: "of",
    ar: "من",
  },
  perPage: {
    de: "Events pro Seite",
    en: "Events per page",
    ar: "عدد الفعاليات",
  },
};

export const EventsPage = () => {
  const { language } = useLanguage();

  const [upcomingEvents, setUpcomingEvents] = useState<EventItem[]>([]);
  const [pastEvents, setPastEvents] = useState<EventItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showPreviousEvents, setShowPreviousEvents] = useState(false);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(3);
  const [totalPages, setTotalPages] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const loadEvents = async (targetPage: number) => {
    const response = await getPublicGroupedEvents({
      page: targetPage,
      limit,
      search,
    });

    setUpcomingEvents(response.data.upcomingEvents);
    setPastEvents(response.data.pastEvents);
    setTotalPages(response.pagination.totalPages || 1);
  };

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await loadEvents(page);
      } catch {
        setErrorMessage("Could not load events");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const heroEvent = upcomingEvents[0] || pastEvents[0];

  const hasAnyEvents = upcomingEvents.length > 0 || pastEvents.length > 0;

  const handleApplySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
  };

  return (
    <main className="overflow-hidden bg-[#0b0b10] text-white">
      <section className="relative min-h-[520px] overflow-hidden bg-black sm:min-h-[580px] lg:min-h-[640px]">
        <img
          src={heroEvent?.coverImage?.url || fallbackHeroImage}
          alt={getLocalizedText(
            heroEvent?.title,
            language,
            "Schu Fi Ma Fi Events",
          )}
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b10] via-black/20 to-black/40" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-5 py-14 sm:min-h-[580px] sm:px-6 sm:py-20 lg:min-h-[640px]">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300 sm:text-base lg:text-lg">
              {pageText.heroEyebrow[language]}
            </p>

            <h1 className="mt-5 max-w-[95vw] break-words text-[3rem] font-black leading-[0.95] tracking-tight sm:text-6xl md:text-7xl lg:text-8xl">
              {pageText.heroTitle[language]}
            </h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-200 sm:text-lg lg:text-xl">
              {pageText.heroSubtitle[language]}
            </p>
          </div>
        </div>
      </section>

      <section className="relative mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="absolute left-0 top-10 h-72 w-72 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-0 top-40 h-72 w-72 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="relative">
          <div className="mb-10 grid gap-5 lg:grid-cols-[1fr_0.8fr] lg:items-end">
            <div>
              <p className="text-base font-bold italic text-violet-300 sm:text-lg">
                {pageText.upcomingEyebrow[language]}
              </p>

              <h2 className="mt-3 break-words text-4xl font-black leading-tight tracking-tight sm:text-5xl md:text-6xl">
                {pageText.upcomingTitle[language]}
              </h2>
            </div>

            <p className="max-w-xl text-base leading-8 text-zinc-400">
              {pageText.upcomingDescription[language]}
            </p>
          </div>

          <form
            onSubmit={handleApplySearch}
            className="mb-12 grid gap-3 rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-4 backdrop-blur sm:rounded-[2rem] md:grid-cols-[1fr_auto_auto]"
          >
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder={pageText.searchPlaceholder[language]}
              className="min-h-12 w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-base font-semibold text-white outline-none transition placeholder:text-zinc-500 focus:border-violet-400 sm:px-5 sm:py-4"
            />

            <button type="submit" className="btn btn-primary">
              {pageText.searchButton[language]}
            </button>

            {search && (
              <button
                type="button"
                onClick={handleClearSearch}
                className="min-h-12 rounded-2xl border border-white/10 px-6 py-3 text-sm font-black uppercase tracking-wide text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 sm:px-7 sm:py-4"
              >
                {pageText.clearButton[language]}
              </button>
            )}
          </form>

          {isLoading && (
            <p className="text-zinc-400">{pageText.loading[language]}</p>
          )}

          {errorMessage && <p className="text-red-400">{errorMessage}</p>}

          {!isLoading && !errorMessage && !hasAnyEvents && (
            <p className="text-zinc-400">{pageText.noEvents[language]}</p>
          )}

          {!isLoading &&
            !errorMessage &&
            hasAnyEvents &&
            upcomingEvents.length === 0 && (
              <p className="text-zinc-400">{pageText.noUpcoming[language]}</p>
            )}

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>

          {totalPages > 1 && (
            <div className="mt-12 rounded-[1.5rem] border border-white/10 bg-white/[0.03] p-4 sm:rounded-[2rem] sm:p-5">
              <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
                <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center lg:justify-start">
                  <button
                    type="button"
                    disabled={page === 1}
                    onClick={() => setPage((currentPage) => currentPage - 1)}
                    className="min-h-12 rounded-full border border-white/15 px-6 py-3 text-sm font-black text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {pageText.previous[language]}
                  </button>

                  <span className="inline-flex min-h-12 items-center justify-center rounded-full bg-white/5 px-5 py-3 text-sm font-black text-zinc-300">
                    {pageText.page[language]} {page} {pageText.of[language]}{" "}
                    {totalPages}
                  </span>

                  <button
                    type="button"
                    disabled={page === totalPages}
                    onClick={() => setPage((currentPage) => currentPage + 1)}
                    className="min-h-12 rounded-full border border-white/15 px-6 py-3 text-sm font-black text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    {pageText.next[language]}
                  </button>
                </div>

                <label className="grid gap-2 lg:min-w-[220px]">
                  <span className="text-sm font-bold text-zinc-400">
                    {pageText.perPage[language]}
                  </span>

                  <select
                    value={limit}
                    onChange={(event) => {
                      setLimit(Number(event.target.value));
                      setPage(1);
                    }}
                    className="min-h-12 rounded-2xl border border-white/10 bg-black/40 px-4 py-3 font-semibold text-white outline-none transition focus:border-violet-400 sm:px-5 sm:py-4"
                  >
                    <option value={3}>3 Events</option>
                    <option value={6}>6 Events</option>
                    <option value={9}>9 Events</option>
                    <option value={24}>24 Events</option>
                  </select>
                </label>
              </div>
            </div>
          )}

          {pastEvents.length > 0 && (
            <div className="mt-14 text-center">
              <button
                type="button"
                onClick={() =>
                  setShowPreviousEvents((currentValue) => !currentValue)
                }
                className="rounded-full border border-white/15 px-6 py-3 text-sm font-black uppercase tracking-wide text-white transition hover:border-violet-300 hover:text-violet-300 sm:px-8 sm:py-4"
              >
                {showPreviousEvents
                  ? pageText.hidePrevious[language]
                  : pageText.showPrevious[language]}
              </button>
            </div>
          )}

          {showPreviousEvents && pastEvents.length > 0 && (
            <section className="mt-16 border-t border-white/10 pt-14">
              <div className="mb-10">
                <p className="text-base font-bold italic text-violet-300 sm:text-lg">
                  {pageText.previousEyebrow[language]}
                </p>

                <h2 className="mt-3 text-4xl font-black tracking-tight sm:text-5xl md:text-6xl">
                  {pageText.previousTitle[language]}
                </h2>
              </div>

              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {pastEvents.map((event) => (
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
