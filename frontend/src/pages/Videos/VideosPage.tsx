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
  searchButton: { de: "Suchen", en: "Search", ar: "بحث" },
  clearButton: { de: "Zurücksetzen", en: "Clear", ar: "مسح" },
  typeLabel: { de: "Video-Typ", en: "Video type", ar: "نوع الفيديو" },
  allTypes: { de: "Alle Videos", en: "All videos", ar: "كل الفيديوهات" },
  youtubeOnly: { de: "YouTube", en: "YouTube", ar: "يوتيوب" },
  uploadedOnly: { de: "Uploaded", en: "Uploaded", ar: "مرفوعة" },
  perPage: {
    de: "Videos pro Seite",
    en: "Videos per page",
    ar: "عدد الفيديوهات",
  },
  previous: { de: "Zurück", en: "Previous", ar: "السابق" },
  next: { de: "Weiter", en: "Next", ar: "التالي" },
  page: { de: "Seite", en: "Page", ar: "الصفحة" },
  of: { de: "von", en: "of", ar: "من" },
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
    <main className="overflow-hidden bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[520px] overflow-hidden bg-black text-white sm:min-h-[580px] lg:min-h-[640px]">
        <img
          src={heroImageUrl}
          alt="Schu Fi Ma Fi videos"
          className="absolute inset-0 h-full w-full object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/75 to-black/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-black/30" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-5 py-14 sm:min-h-[580px] sm:px-6 sm:py-20 lg:min-h-[640px]">
          <div>
            <p className="text-sm font-black uppercase tracking-[0.28em] text-violet-300 sm:text-base lg:text-lg">
              {pageText.heroEyebrow[language]}
            </p>

            <h1 className="hero-title mt-5">{pageText.heroTitle[language]}</h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="text-center">
          <p className="text-base font-bold italic text-violet-500 sm:text-lg">
            {pageText.sectionEyebrow[language]}
          </p>

          <h2 className="section-title mx-auto mt-5 max-w-4xl">
            {pageText.sectionTitle[language]}
          </h2>

          <p className="mt-4 text-sm font-bold text-zinc-500">
            {totalItems} videos
          </p>
        </div>

        <div className="mt-10 rounded-[1.5rem] bg-white p-4 shadow-xl shadow-black/5 sm:rounded-[2rem] sm:p-5">
          <div className="grid gap-4 lg:grid-cols-[1fr_220px_220px]">
            <form
              onSubmit={handleApplySearch}
              className="grid gap-3 sm:grid-cols-[1fr_auto_auto]"
            >
              <input
                type="search"
                value={searchInput}
                onChange={(event) => setSearchInput(event.target.value)}
                placeholder={pageText.searchPlaceholder[language]}
                className="min-h-12 min-w-0 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-semibold text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:bg-white sm:px-5 sm:py-4"
              />

              <button type="submit" className="btn btn-primary">
                {pageText.searchButton[language]}
              </button>

              {search && (
                <button
                  type="button"
                  onClick={handleClearSearch}
                  className="btn btn-secondary-light"
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

        <div className="mt-12 grid gap-8 lg:mt-16">
          {videos.map((video) => {
            const title = video.title[language] || video.title.de;
            const description =
              video.description?.[language] || video.description?.de || "";

            return (
              <article
                key={video._id}
                className="rounded-[1.5rem] bg-white p-4 shadow-2xl shadow-black/10 sm:rounded-[2rem] sm:p-5"
              >
                <h3 className="mb-5 break-words text-center text-2xl font-black leading-tight sm:text-3xl">
                  {title}
                </h3>

                {video.type === "youtube" && video.youtubeUrl && (
                  <div className="overflow-hidden rounded-[1.25rem] bg-black shadow-2xl shadow-black/25 sm:rounded-[1.5rem]">
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
                  <div className="overflow-hidden rounded-[1.25rem] bg-black shadow-2xl shadow-black/25 sm:rounded-[1.5rem]">
                    <video
                      src={video.videoFile.url}
                      controls
                      className="aspect-video w-full"
                      poster={video.thumbnail?.url}
                    />
                  </div>
                )}

                {description && (
                  <p className="mt-4 break-words text-center text-base leading-7 text-zinc-600">
                    {description}
                  </p>
                )}
              </article>
            );
          })}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 rounded-[1.5rem] border border-zinc-200 bg-white p-4 shadow-xl shadow-black/5 sm:rounded-[2rem] sm:p-5">
            <div className="grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
              <button
                type="button"
                disabled={page === 1}
                onClick={() => setPage((currentPage) => currentPage - 1)}
                className="btn btn-secondary-light"
              >
                {pageText.previous[language]}
              </button>

              <span className="inline-flex min-h-11 items-center justify-center rounded-full bg-zinc-100 px-5 py-3 text-sm font-black text-zinc-600 sm:min-h-12">
                {pageText.page[language]} {page} {pageText.of[language]}{" "}
                {totalPages}
              </span>

              <button
                type="button"
                disabled={page === totalPages}
                onClick={() => setPage((currentPage) => currentPage + 1)}
                className="btn btn-secondary-light"
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
  "min-h-12 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-semibold text-zinc-800 outline-none transition focus:border-violet-400 focus:bg-white sm:px-5 sm:py-4";
