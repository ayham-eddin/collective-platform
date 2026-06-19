import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicVideos } from "../../services/videos.service";
import type { VideoItem, VideoType } from "../../types/video.types";

const heroImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const pageText = {
  heroEyebrow: {
    de: "Events Videos",
    en: "Event Videos",
    ar: "فيديوهات الفعاليات",
  },
  heroTitle: {
    de: "Events Videos",
    en: "Event Videos",
    ar: "فيديوهات الفعاليات",
  },
  sectionEyebrow: {
    de: "Videos ansehen",
    en: "Watch videos",
    ar: "شاهد الفيديوهات",
  },
  sectionTitle: {
    de: "Videos von unseren Veranstaltungen",
    en: "Videos from our events",
    ar: "فيديوهات من فعالياتنا",
  },
  searchPlaceholder: {
    de: "Videos suchen...",
    en: "Search videos...",
    ar: "ابحث في الفيديوهات...",
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
  typeLabel: {
    de: "Video-Typ",
    en: "Video type",
    ar: "نوع الفيديو",
  },
  allTypes: {
    de: "Alle Videos",
    en: "All videos",
    ar: "كل الفيديوهات",
  },
  youtubeOnly: {
    de: "YouTube",
    en: "YouTube",
    ar: "يوتيوب",
  },
  uploadedOnly: {
    de: "Uploaded",
    en: "Uploaded",
    ar: "مرفوعة",
  },
  perPage: {
    de: "Videos pro Seite",
    en: "Videos per page",
    ar: "عدد الفيديوهات",
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
  loading: {
    de: "Videos werden geladen...",
    en: "Loading videos...",
    ar: "جاري تحميل الفيديوهات...",
  },
  empty: {
    de: "Noch keine Videos verfügbar.",
    en: "No videos available.",
    ar: "لا توجد فيديوهات حالياً.",
  },
};

export const VideosPage = () => {
  const { language } = useLanguage();
  const [videos, setVideos] = useState<VideoItem[]>([]);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [typeFilter, setTypeFilter] = useState<VideoType | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadVideos = async (targetPage: number) => {
    const response = await getPublicVideos({
      page: targetPage,
      limit,
      type: typeFilter,
      search,
    });

    setVideos(response.data);
    setTotalPages(response.pagination.totalPages || 1);
    setTotalItems(response.pagination.totalItems);
  };

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await loadVideos(page);
      } catch {
        setErrorMessage("Could not load videos");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, typeFilter, search]);

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

  const handleTypeFilterChange = (value: VideoType | "all") => {
    setTypeFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <main className="bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[460px] overflow-hidden bg-black text-white">
        <img
          src={heroImageUrl}
          alt="Schu Fi Ma Fi videos"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-end px-6 py-20">
          <div>
            <p className="text-lg font-bold text-violet-300">
              {pageText.heroEyebrow[language]}
            </p>

            <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
              {pageText.heroTitle[language]}
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-xl font-bold italic text-violet-400">
            {pageText.sectionEyebrow[language]}
          </p>

          <h2 className="mt-5 text-5xl font-black tracking-tight md:text-6xl">
            {pageText.sectionTitle[language]}
          </h2>

          <p className="mt-4 text-sm font-bold text-zinc-500">
            {totalItems} videos
          </p>
        </div>

        <div className="mt-12 rounded-[2rem] bg-white p-5 shadow-xl shadow-black/5">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <form onSubmit={handleApplySearch} className="flex gap-3">
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={pageText.searchPlaceholder[language]}
                className="min-w-0 flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 font-semibold outline-none transition focus:border-violet-400 focus:bg-white"
              />

              <button
                type="submit"
                className="rounded-2xl bg-violet-600 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500"
              >
                {pageText.searchButton[language]}
              </button>

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="rounded-2xl border border-zinc-200 px-6 py-4 text-sm font-black uppercase tracking-wide text-zinc-700 transition hover:border-violet-400 hover:text-violet-600"
                >
                  {pageText.clearButton[language]}
                </button>
              )}
            </form>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-500">
                {pageText.typeLabel[language]}
              </span>

              <select
                value={typeFilter}
                onChange={(event) =>
                  handleTypeFilterChange(
                    event.target.value as VideoType | "all",
                  )
                }
                className={selectClassName}
              >
                <option value="all">{pageText.allTypes[language]}</option>
                <option value="youtube">
                  {pageText.youtubeOnly[language]}
                </option>
                <option value="uploaded">
                  {pageText.uploadedOnly[language]}
                </option>
              </select>
            </label>

            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-500">
                {pageText.perPage[language]}
              </span>

              <select
                value={limit}
                onChange={(event) =>
                  handleLimitChange(Number(event.target.value))
                }
                className={selectClassName}
              >
                <option value={3}>3 Videos</option>
                <option value={6}>6 Videos</option>
                <option value={9}>9 Videos</option>
                <option value={12}>12 Videos</option>
              </select>
            </label>
          </div>
        </div>

        {isLoading && (
          <p className="mt-12 text-center text-zinc-500">
            {pageText.loading[language]}
          </p>
        )}

        {errorMessage && (
          <p className="mt-12 text-center text-red-500">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && videos.length === 0 && (
          <p className="mt-12 text-center text-zinc-500">
            {pageText.empty[language]}
          </p>
        )}

        <div className="mt-16 grid gap-12">
          {videos.map((video) => {
            const title = video.title[language] || video.title.de;
            const description =
              video.description?.[language] || video.description?.de || "";

            return (
              <article
                key={video._id}
                className="rounded-[2rem] bg-white p-5 shadow-2xl shadow-black/10"
              >
                <h3 className="mb-6 text-center text-3xl font-black">
                  {title}
                </h3>

                {video.type === "youtube" && video.youtubeUrl && (
                  <div className="overflow-hidden rounded-[1.5rem] bg-black shadow-2xl shadow-black/25">
                    <iframe
                      src={getYoutubeEmbedUrl(video.youtubeUrl)}
                      title={title}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                {video.type === "uploaded" && video.videoFile?.url && (
                  <div className="overflow-hidden rounded-[1.5rem] bg-black shadow-2xl shadow-black/25">
                    <video
                      src={video.videoFile.url}
                      controls
                      className="aspect-video w-full"
                      poster={video.thumbnail?.url}
                    />
                  </div>
                )}

                {description && (
                  <p className="mt-4 text-center text-zinc-600">
                    {description}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex flex-col gap-5 rounded-[2rem] border border-zinc-200 bg-white p-5 shadow-xl shadow-black/5 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center justify-center gap-3 md:justify-start">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-black text-zinc-700 transition hover:border-violet-500 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {pageText.previous[language]}
              </button>

              <span className="rounded-full bg-zinc-100 px-5 py-3 text-sm font-black text-zinc-500">
                {pageText.page[language]} {page} {pageText.of[language]}{" "}
                {totalPages}
              </span>

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-black text-zinc-700 transition hover:border-violet-500 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
              >
                {pageText.next[language]}
              </button>
            </div>
          </div>
        )}
      </section>
    </main>
  );
};

const getYoutubeEmbedUrl = (youtubeUrl: string) => {
  if (youtubeUrl.includes("watch?v=")) {
    return youtubeUrl.replace("watch?v=", "embed/");
  }

  if (youtubeUrl.includes("youtu.be/")) {
    return youtubeUrl.replace("youtu.be/", "www.youtube.com/embed/");
  }

  return youtubeUrl;
};

const selectClassName =
  "rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 font-semibold text-zinc-800 outline-none transition focus:border-violet-400 focus:bg-white";
