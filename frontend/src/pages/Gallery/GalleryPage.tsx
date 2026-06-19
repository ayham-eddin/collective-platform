import { useEffect, useMemo, useState, type FormEvent } from "react";
import { GalleryLightbox } from "../../components/GalleryLightbox/GalleryLightbox";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicGalleryImages } from "../../services/gallery.service";
import type {
  GalleryImageItem,
  LocalizedText,
} from "../../types/gallery.types";

const fallbackHeroImage =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const pageText = {
  heroEyebrow: {
    de: "Unsere Story",
    en: "Our Story",
    ar: "قصتنا",
  },
  heroTitle: {
    de: "Galerie",
    en: "Gallery",
    ar: "المعرض",
  },
  sectionEyebrow: {
    de: "Glückliche Momente",
    en: "Happy Moments",
    ar: "لحظات سعيدة",
  },
  sectionTitle: {
    de: "Wir lieben es, besondere Momente zu teilen",
    en: "We love sharing special moments",
    ar: "نحب مشاركة اللحظات المميزة",
  },
  sectionDescription: {
    de: "Hier finden Sie einige Bilder von Veranstaltungen, die wir organisiert haben.",
    en: "Here you can find some photos from events we organized.",
    ar: "هنا تجد بعض الصور من الفعاليات التي قمنا بتنظيمها.",
  },
  searchPlaceholder: {
    de: "Bilder suchen...",
    en: "Search images...",
    ar: "ابحث في الصور...",
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
    de: "Galerie wird geladen...",
    en: "Loading gallery...",
    ar: "جاري تحميل المعرض...",
  },
  empty: {
    de: "Noch keine Bilder in der Galerie.",
    en: "No gallery images available.",
    ar: "لا توجد صور في المعرض حالياً.",
  },
  category: {
    de: "Galerie",
    en: "Gallery",
    ar: "المعرض",
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
};

export const GalleryPage = () => {
  const { language } = useLanguage();
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [heroImages, setHeroImages] = useState<GalleryImageItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);

  const [lightboxImages, setLightboxImages] = useState<GalleryImageItem[]>([]);
  const [lightboxPage, setLightboxPage] = useState(1);
  const [lightboxTotalPages, setLightboxTotalPages] = useState(1);
  const [lightboxTotalItems, setLightboxTotalItems] = useState(0);
  const [isLightboxLoadingMore, setIsLightboxLoadingMore] = useState(false);

  const [page, setPage] = useState(1);
  const [limit] = useState(6);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const loadGalleryImages = async (targetPage: number) => {
    const response = await getPublicGalleryImages({
      page: targetPage,
      limit,
      search,
    });

    setImages(response.data);
    setTotalPages(response.pagination.totalPages || 1);
    setTotalItems(response.pagination.totalItems);
  };

  useEffect(() => {
    const loadInitialHeroImages = async () => {
      try {
        const response = await getPublicGalleryImages({
          page: 1,
          limit: 6,
          search: "",
        });

        setHeroImages(response.data);
      } catch {
        setHeroImages([]);
      }
    };

    void loadInitialHeroImages();
  }, []);

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);
      setErrorMessage("");

      try {
        await loadGalleryImages(page);
      } catch {
        setErrorMessage("Could not load gallery images");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, search]);

  const heroImage = useMemo(() => {
    return (
      heroImages.find((image) => image.isFeatured) ||
      heroImages[0] ||
      images.find((image) => image.isFeatured) ||
      images[0]
    );
  }, [heroImages, images]);

  const handleApplySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
    setSelectedIndex(null);
    setLightboxImages([]);
    setLightboxPage(1);
    setLightboxTotalPages(1);
    setLightboxTotalItems(0);
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
    setSelectedIndex(null);
    setLightboxImages([]);
    setLightboxPage(1);
    setLightboxTotalPages(1);
    setLightboxTotalItems(0);
  };

  const handleOpenLightbox = (index: number) => {
    const pageOffset = (page - 1) * limit;

    setLightboxImages(images);
    setLightboxPage(page);
    setLightboxTotalPages(totalPages);
    setLightboxTotalItems(totalItems);
    setSelectedIndex(pageOffset + index);
  };

  const loadMoreLightboxImages = async () => {
    if (isLightboxLoadingMore || lightboxPage >= lightboxTotalPages) {
      return;
    }

    const nextPage = lightboxPage + 1;

    setIsLightboxLoadingMore(true);

    try {
      const response = await getPublicGalleryImages({
        page: nextPage,
        limit,
        search,
      });

      setLightboxImages((currentImages) => [
        ...currentImages,
        ...response.data,
      ]);
      setLightboxPage(response.pagination.page);
      setLightboxTotalPages(response.pagination.totalPages || 1);
      setLightboxTotalItems(response.pagination.totalItems);
    } finally {
      setIsLightboxLoadingMore(false);
    }
  };

  const lightboxStartOffset = (page - 1) * limit;
  const lightboxCurrentIndex =
    selectedIndex !== null ? selectedIndex - lightboxStartOffset : 0;

  return (
    <main className="bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[460px] overflow-hidden bg-black text-white">
        <img
          src={heroImage?.image.url || fallbackHeroImage}
          alt={getLocalizedText(
            heroImage?.title,
            language,
            "Schu Fi Ma Fi Gallery",
          )}
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

      <section className="mx-auto max-w-7xl px-6 py-24">
        <div className="max-w-4xl">
          <p className="text-xl font-bold italic text-violet-400">
            {pageText.sectionEyebrow[language]}
          </p>

          <h2 className="mt-5 text-5xl font-black leading-tight tracking-tight md:text-7xl">
            {pageText.sectionTitle[language]}
          </h2>

          <p className="mt-8 text-lg leading-8 text-zinc-700">
            {pageText.sectionDescription[language]}
          </p>
        </div>

        <form
          onSubmit={handleApplySearch}
          className="mt-12 flex flex-wrap gap-3 rounded-[2rem] bg-white p-4 shadow-xl shadow-black/5"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={pageText.searchPlaceholder[language]}
            className="min-w-[240px] flex-1 rounded-2xl border border-zinc-200 bg-zinc-50 px-5 py-4 font-semibold outline-none transition focus:border-violet-400 focus:bg-white"
          />

          <button type="submit" className="btn btn-primary">
            {pageText.searchButton[language]}
          </button>

          {search && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="rounded-2xl border border-zinc-200 px-7 py-4 text-sm font-black uppercase tracking-wide text-zinc-700 transition hover:border-violet-400 hover:text-violet-600"
            >
              {pageText.clearButton[language]}
            </button>
          )}
        </form>

        {isLoading && (
          <p className="mt-12 text-center text-zinc-500">
            {pageText.loading[language]}
          </p>
        )}

        {errorMessage && (
          <p className="mt-12 text-center text-red-500">{errorMessage}</p>
        )}

        {!isLoading && !errorMessage && images.length === 0 && (
          <p className="mt-12 text-center text-zinc-500">
            {pageText.empty[language]}
          </p>
        )}

        <div className="mt-14 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((item, index) => (
            <button
              key={item._id}
              type="button"
              onClick={() => handleOpenLightbox(index)}
              className="group relative min-h-[360px] overflow-hidden rounded-[2rem] bg-zinc-900 text-left shadow-2xl shadow-black/20"
            >
              <img
                src={item.image.url}
                alt={getLocalizedText(
                  item.title,
                  language,
                  pageText.category[language],
                )}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              <div className="absolute left-6 top-6 rounded-md bg-violet-600 px-5 py-3 text-sm font-black text-white">
                {pageText.category[language]}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-7">
                <h3 className="text-3xl font-black tracking-tight text-white">
                  {getLocalizedText(
                    item.title,
                    language,
                    pageText.category[language],
                  )}
                </h3>

                {item.description && (
                  <p className="mt-3 max-w-sm text-zinc-300">
                    {getLocalizedText(item.description, language, "")}
                  </p>
                )}
              </div>
            </button>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex flex-wrap items-center justify-center gap-4">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-full border border-zinc-300 px-6 py-3 text-sm font-black text-zinc-700 transition hover:border-violet-500 hover:text-violet-600 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {pageText.previous[language]}
            </button>

            <span className="text-sm font-black text-zinc-500">
              {pageText.page[language]} {page} {pageText.of[language]}{" "}
              {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className=""
            >
              {pageText.next[language]}
            </button>
          </div>
        )}
      </section>

      {selectedIndex !== null && (
        <GalleryLightbox
          images={lightboxImages}
          currentIndex={lightboxCurrentIndex}
          totalItems={lightboxTotalItems || totalItems}
          isLoadingMore={isLightboxLoadingMore}
          hasMoreImages={lightboxPage < lightboxTotalPages}
          onLoadMore={loadMoreLightboxImages}
          onClose={() => setSelectedIndex(null)}
        />
      )}
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
