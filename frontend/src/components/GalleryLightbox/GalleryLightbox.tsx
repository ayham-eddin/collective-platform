import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/useLanguage";
import type {
  GalleryImageItem,
  LocalizedText,
} from "../../types/gallery.types";

interface GalleryLightboxProps {
  images: GalleryImageItem[];
  currentIndex: number;
  onClose: () => void;
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
  imageFallback: {
    de: "Galeriebild",
    en: "Gallery image",
    ar: "صورة من المعرض",
  },
};

export const GalleryLightbox = ({
  images,
  currentIndex,
  onClose,
}: GalleryLightboxProps) => {
  const { language } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(currentIndex);

  const showPreviousImage = () => {
    setActiveIndex((index) => (index === 0 ? images.length - 1 : index - 1));
  };

  const showNextImage = () => {
    setActiveIndex((index) => (index === images.length - 1 ? 0 : index + 1));
  };

  useEffect(() => {
    const handleKeyboardNavigation = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((index) =>
          index === images.length - 1 ? 0 : index + 1,
        );
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((index) =>
          index === 0 ? images.length - 1 : index - 1,
        );
      }
    };

    window.addEventListener("keydown", handleKeyboardNavigation);

    return () => {
      window.removeEventListener("keydown", handleKeyboardNavigation);
    };
  }, [images.length, onClose]);

  const activeImage = images[activeIndex];

  if (!activeImage) {
    return null;
  }

  const activeTitle = getLocalizedText(
    activeImage.title,
    language,
    lightboxText.imageFallback[language],
  );

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/95 px-4 py-6 text-white"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute right-5 top-5 z-20 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
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
              showPreviousImage();
            }}
            className="absolute left-5 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={lightboxText.previous[language]}
          >
            <ChevronLeft size={28} />
          </button>

          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              showNextImage();
            }}
            className="absolute right-5 top-1/2 z-20 grid h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"
            aria-label={lightboxText.next[language]}
          >
            <ChevronRight size={28} />
          </button>
        </>
      )}

      <div
        className="mx-auto flex h-full max-w-6xl flex-col items-center justify-center gap-6"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={activeImage.image.url}
          alt={activeTitle}
          className="max-h-[72vh] max-w-full rounded-3xl object-contain shadow-2xl shadow-black"
        />

        <div className="max-w-3xl text-center">
          <p className="text-sm font-bold text-violet-300">
            {activeIndex + 1} / {images.length}
          </p>

          <h2 className="mt-3 text-3xl font-black">{activeTitle}</h2>

          {activeImage.description && (
            <p className="mt-3 text-zinc-300">
              {getLocalizedText(activeImage.description, language, "")}
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
