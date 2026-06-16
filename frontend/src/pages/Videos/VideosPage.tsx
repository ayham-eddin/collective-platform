import { useEffect, useState } from "react";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicVideos } from "../../services/videos.service";
import type { VideoItem } from "../../types/video.types";

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
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadVideos = async () => {
      try {
        const data = await getPublicVideos();
        setVideos(data);
      } catch {
        setErrorMessage("Could not load videos");
      } finally {
        setIsLoading(false);
      }
    };

    void loadVideos();
  }, []);

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
              video.description[language] || video.description.de;

            return (
              <article key={video._id}>
                <h3 className="mb-6 text-center text-3xl font-black">
                  {title}
                </h3>

                {video.type === "youtube" && video.youtubeUrl && (
                  <div className="overflow-hidden rounded-[2rem] bg-black shadow-2xl shadow-black/25">
                    <iframe
                      src={video.youtubeUrl.replace("watch?v=", "embed/")}
                      title={title}
                      className="aspect-video w-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                )}

                {video.type === "upload" && video.videoFile?.url && (
                  <div className="overflow-hidden rounded-[2rem] bg-black shadow-2xl shadow-black/25">
                    <video
                      src={video.videoFile.url}
                      controls
                      className="aspect-video w-full"
                      poster={video.thumbnail?.url}
                    />
                  </div>
                )}

                <p className="mt-4 text-center text-zinc-600">{description}</p>
              </article>
            );
          })}
        </div>
      </section>
    </main>
  );
};
