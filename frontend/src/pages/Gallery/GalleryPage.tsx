import { useEffect, useMemo, useState } from "react";
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
};

export const GalleryPage = () => {
  const { language } = useLanguage();
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadGalleryImages = async () => {
      try {
        const data = await getPublicGalleryImages();
        setImages(data);
      } catch {
        setErrorMessage("Could not load gallery images");
      } finally {
        setIsLoading(false);
      }
    };

    void loadGalleryImages();
  }, []);

  const heroImage = useMemo(() => {
    return images.find((image) => image.isFeatured) || images[0];
  }, [images]);

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
              onClick={() => setSelectedIndex(index)}
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
      </section>

      {selectedIndex !== null && (
        <GalleryLightbox
          images={images}
          currentIndex={selectedIndex}
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
