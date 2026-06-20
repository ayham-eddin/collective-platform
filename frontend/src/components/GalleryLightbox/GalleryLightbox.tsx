import { ChevronLeft, ChevronRight, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/useLanguage";
import type {
  GalleryImageItem,
  LocalizedText,
} from "../../types/gallery.types";

interface GalleryLightboxProps {
  images: GalleryImageItem[];
  currentIndex: number;
  totalItems: number;
  isLoadingMore: boolean;
  hasMoreImages: boolean;
  onClose: () => void;
  onLoadMore: () => Promise<void>;
}

const lightboxText = {
  close: {
    de: "Galerie schließen",
    en: "Close gallery",
    ar: "إغلاق المعرض",
  },
  previous: {
    de: "Vorheriges Bild",
    en: "Previous image",
    ar: "الصورة السابقة",
  },
  next: {
    de: "Nächstes Bild",
    en: "Next image",
    ar: "الصورة التالية",
  },
  loadingMore: {
    de: "Weitere Bilder werden geladen...",
    en: "Loading more images...",
    ar: "جاري تحميل المزيد من الصور...",
  },
  imageFallback: {
    de: "Galeriebild",
    en: "Gallery image",
    ar: "صورة من المعرض",
  },
};

export const GalleryLightbox = ({
  images,
  currentIndex,
  totalItems,
  isLoadingMore,
  hasMoreImages,
  onClose,
  onLoadMore,
}: GalleryLightboxProps) => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const activeImage = images[activeIndex];

  const goToPreviousImage = () => {
    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const goToNextImage = () => {
    setActiveIndex((index) => {
      const isLastLoadedImage = index === images.length - 1;

      if (isLastLoadedImage && !hasMoreImages) {
        return 0;
      }

      if (isLastLoadedImage && hasMoreImages) {
        void onLoadMore();
        return index + 1;
      }

      return index + 1;
    });
  };

  useEffect(() => {
    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
        return;
      }

      if (event.key === "ArrowRight" && !isLoadingMore) {
        goToNextImage();
        return;
      }

      if (event.key === "ArrowLeft") {
        goToPreviousImage();
      }
    };

    window.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [images.length, hasMoreImages, isLoadingMore, onClose]);

  if (!activeImage) {
    return (
      <div
        className="fixed inset-0 z-[100] grid place-items-center bg-black/95 px-4 py-6 text-white"
        role="dialog"
        aria-modal="true"
      >
        <Loader2 size={32} className="animate-spin text-violet-300" />
      </div>
    );
  }

  const activeTitle = getLocalizedText(
    activeImage.title,
    language,
    lightboxText.imageFallback[language],
  );

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto bg-black/95 px-4 py-6 text-white"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed right-4 top-4 z-30 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:right-5 sm:top-5"
        aria-label={lightboxText.close[language]}
      >
        <X size={24} />
      </button>

      {images.length > 1 && (
        <>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToPreviousImage();
            }}
            className="fixed bottom-6 left-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 sm:left-5 sm:top-1/2 sm:-translate-y-1/2"
            aria-label={lightboxText.previous[language]}
          >
            <ChevronLeft size={28} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              goToNextImage();
            }}
            disabled={isLoadingMore}
            className="fixed bottom-6 right-4 z-30 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white backdrop-blur transition hover:bg-white/20 disabled:cursor-wait disabled:opacity-60 sm:right-5 sm:top-1/2 sm:-translate-y-1/2"
            aria-label={lightboxText.next[language]}
          >
            {isLoadingMore ? (
              <Loader2 size={24} className="animate-spin" />
            ) : (
              <ChevronRight size={28} />
            )}
          </button>
        </>
      )}

      <div
        className="mx-auto flex min-h-full max-w-6xl flex-col items-center justify-center gap-5 py-14 sm:gap-6"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={activeImage.image.url}
          alt={activeTitle}
          className="max-h-[68vh] max-w-full rounded-[1.5rem] object-contain shadow-2xl shadow-black sm:max-h-[72vh] sm:rounded-3xl"
        />

        <div className="max-w-3xl px-3 text-center">
          <p className="text-sm font-bold text-violet-300">
            {Math.min(activeIndex + 1, totalItems)} / {totalItems}
          </p>

          <h2 className="mt-3 break-words text-2xl font-black leading-tight sm:text-3xl">
            {activeTitle}
          </h2>

          {activeImage.description && (
            <p className="mt-3 break-words text-sm leading-7 text-zinc-300 sm:text-base">
              {getLocalizedText(activeImage.description, language, "")}
            </p>
          )}

          {isLoadingMore && (
            <p className="mt-4 text-sm font-bold text-zinc-400">
              {lightboxText.loadingMore[language]}
            </p>
          )}
        </div>
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
