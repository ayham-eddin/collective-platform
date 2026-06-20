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
  heroEyebrow: { de: "Unsere Story", en: "Our Story", ar: "قصتنا" },
  heroTitle: { de: "Galerie", en: "Gallery", ar: "المعرض" },
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
  searchButton: { de: "Suchen", en: "Search", ar: "بحث" },
  clearButton: { de: "Zurücksetzen", en: "Clear", ar: "مسح" },
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
  category: { de: "Galerie", en: "Gallery", ar: "المعرض" },
  previous: { de: "Zurück", en: "Previous", ar: "السابق" },
  next: { de: "Weiter", en: "Next", ar: "التالي" },
  page: { de: "Seite", en: "Page", ar: "الصفحة" },
  of: { de: "von", en: "of", ar: "من" },
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

  const resetLightbox = () => {
    setSelectedIndex(null);
    setLightboxImages([]);
    setLightboxPage(1);
    setLightboxTotalPages(1);
    setLightboxTotalItems(0);
  };

  const handleApplySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
    resetLightbox();
  };

  const handleClearSearch = () => {
    setSearchInput("");
    setSearch("");
    setPage(1);
    resetLightbox();
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
    <main className="overflow-hidden bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[520px] overflow-hidden bg-black text-white sm:min-h-[580px] lg:min-h-[640px]">
        <img
          src={heroImage?.image.url || fallbackHeroImage}
          alt={getLocalizedText(
            heroImage?.title,
            language,
            "Schu Fi Ma Fi Gallery",
          )}
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

      <section className="mx-auto max-w-7xl px-5 py-16 sm:px-6 sm:py-20 lg:py-24">
        <div className="max-w-4xl">
          <p className="text-base font-bold italic text-violet-500 sm:text-lg">
            {pageText.sectionEyebrow[language]}
          </p>

          <h2 className="section-title mt-5">
            {pageText.sectionTitle[language]}
          </h2>

          <p className="mt-6 text-base leading-8 text-zinc-700 sm:text-lg">
            {pageText.sectionDescription[language]}
          </p>
        </div>

        <form
          onSubmit={handleApplySearch}
          className="mt-10 grid gap-3 rounded-[1.5rem] bg-white p-4 shadow-xl shadow-black/5 sm:rounded-[2rem] md:grid-cols-[1fr_auto_auto]"
        >
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder={pageText.searchPlaceholder[language]}
            className="min-h-12 w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 font-semibold text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:bg-white sm:px-5 sm:py-4"
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

        <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {images.map((item, index) => (
            <button
              key={item._id}
              type="button"
              onClick={() => handleOpenLightbox(index)}
              className="group relative min-h-[320px] overflow-hidden rounded-[1.5rem] bg-zinc-900 text-left shadow-2xl shadow-black/20 sm:min-h-[360px] sm:rounded-[2rem]"
            >
              <img
                src={item.image.url}
                alt={getLocalizedText(
                  item.title,
                  language,
                  pageText.category[language],
                )}
                className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/55 to-transparent" />

              <div className="absolute left-4 top-4 max-w-[calc(100%-2rem)] rounded-full bg-violet-600 px-4 py-2 text-xs font-black uppercase tracking-wide text-white sm:left-6 sm:top-6 sm:px-5 sm:py-3 sm:text-sm">
                {pageText.category[language]}
              </div>

              <div className="absolute bottom-0 left-0 right-0 p-5 sm:p-7">
                <h3 className="break-words text-2xl font-black leading-tight tracking-tight text-white sm:text-3xl">
                  {getLocalizedText(
                    item.title,
                    language,
                    pageText.category[language],
                  )}
                </h3>

                {item.description && (
                  <p className="mt-3 line-clamp-2 max-w-sm break-words text-sm leading-7 text-zinc-200 sm:text-base">
                    {getLocalizedText(item.description, language, "")}
                  </p>
                )}
              </div>
            </button>
          ))}
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
