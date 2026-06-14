const videos = [
  {
    title: "Share3 Festival",
    subtitle: "The Synaptik live @ Share3 Festival",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Interview: Yassin Al-Haj Saleh",
    subtitle: "Schu Fi Ma Fi Interview",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
  {
    title: "Live Performance",
    subtitle: "Moments from our cultural events",
    embedUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
  },
];

export const VideosPage = () => {
  return (
    <main className="bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[460px] overflow-hidden bg-black text-white">
        <img
          src="https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png"
          alt="Schu Fi Ma Fi videos"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        <div className="relative mx-auto flex min-h-[460px] max-w-7xl items-end px-6 py-20">
          <div>
            <p className="text-lg font-bold text-violet-300">Events Videos</p>
            <h1 className="mt-4 text-6xl font-black tracking-tight md:text-8xl">
              Events Videos
            </h1>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-24">
        <div className="text-center">
          <p className="text-xl font-bold italic text-violet-400">
            Videos ansehen
          </p>

          <h2 className="mt-5 text-5xl font-black tracking-tight md:text-6xl">
            Videos von unseren Veranstaltungen
          </h2>

          <p className="mx-auto mt-6 max-w-3xl text-lg leading-8 text-zinc-700">
            Sehen Sie sich Videos von einigen unserer Veranstaltungen,
            Interviews und Live-Momenten an.
          </p>
        </div>

        <div className="mt-16 grid gap-12">
          {videos.map((video) => (
            <article key={video.title}>
              <h3 className="mb-6 text-center text-3xl font-black">
                {video.title}
              </h3>

              <div className="overflow-hidden rounded-[2rem] bg-black shadow-2xl shadow-black/25">
                <iframe
                  src={video.embedUrl}
                  title={video.title}
                  className="aspect-video w-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>

              <p className="mt-4 text-center text-zinc-600">{video.subtitle}</p>
            </article>
          ))}
        </div>
      </section>
    </main>
  );
};
