import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { useEffect, useState } from "react";
import type { GalleryImageItem } from "../../types/gallery.types";

interface GalleryLightboxProps {
  images: GalleryImageItem[];
  currentIndex: number;
  onClose: () => void;
}

export const GalleryLightbox = ({
  images,
  currentIndex,
  onClose,
}: GalleryLightboxProps) => {
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
        aria-label="Close gallery"
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
            aria-label="Previous image"
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
            aria-label="Next image"
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
          alt={activeImage.title.de}
          className="max-h-[72vh] max-w-full rounded-3xl object-contain shadow-2xl shadow-black"
        />

        <div className="max-w-3xl text-center">
          <p className="text-sm font-bold text-violet-300">
            {activeIndex + 1} / {images.length}
          </p>

          <h2 className="mt-3 text-3xl font-black">{activeImage.title.de}</h2>

          {activeImage.description?.de && (
            <p className="mt-3 text-zinc-300">{activeImage.description.de}</p>
          )}
        </div>
      </div>
    </div>
  );
};
