import { Link } from "react-router-dom";

const aboutHeroImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const teamImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781436366/collective-platform/events/dfunilrfat4wnccfw5eh.jpg";

const storyImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const teamMembers = [
  {
    name: "Wesam Hero",
    role: "Projektleiter",
    image:
      "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781436366/collective-platform/events/dfunilrfat4wnccfw5eh.jpg",
  },
  {
    name: "Heba",
    role: "Mitglieder",
    image:
      "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png",
  },
  {
    name: "Sara Mukdad",
    role: "Mitglieder",
    image:
      "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781436366/collective-platform/events/dfunilrfat4wnccfw5eh.jpg",
  },
  {
    name: "Samer Al",
    role: "Mitglieder",
    image:
      "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png",
  },
];

export const AboutPage = () => {
  return (
    <main className="bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[560px] overflow-hidden bg-black text-white">
        <img
          src={aboutHeroImageUrl}
          alt="Schu Fi Ma Fi Kollektiv live event"
          className="absolute inset-0 h-full w-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/10" />

        <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-end px-6 py-20">
          <div>
            <div className="mb-6 flex items-center gap-3 text-lg font-bold text-white/85">
              <Link to="/" className="transition hover:text-violet-300">
                Home
              </Link>
              <span>›</span>
              <span>Über uns</span>
            </div>

            <h1 className="text-6xl font-black tracking-tight md:text-8xl">
              Über Uns
            </h1>

            <div className="mt-10 h-px w-full max-w-5xl border-t border-dashed border-white/50" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xl font-bold italic text-violet-400">
            Unsere wertvolle Geschichte
          </p>

          <h2 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            Solides Team arbeitet für Schufimafi Collective
          </h2>

          <div className="mt-10 grid gap-8 text-lg leading-8 text-zinc-800 md:grid-cols-2">
            <p>
              Schu Fi Ma Fi ist ein syrisches kulturelles Kollektiv, das seit
              2018 in der Kulturszene in Deutschland aktiv ist. Wir streben eine
              offene und gesunde Gesellschaft an, die auf Augenhöhe miteinander
              kommuniziert und sich austauscht.
              <br />
              <br />
              Wir investieren in jedes Event.
            </p>

            <p>
              Wir geben uns die größte Mühe, jede Veranstaltung zu einem Erfolg
              zu machen und tun alles, was nötig ist. Wir sind die perfekte Wahl
              für Sie, wenn Sie Leute mit großer Erfahrung brauchen, um Ihre
              Veranstaltung zu managen.
            </p>
          </div>

          <Link
            to="/events"
            className="mt-10 inline-flex rounded-full bg-violet-400 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500"
          >
            Unsere Events
          </Link>
        </div>

        <div className="overflow-hidden rounded-[2rem] shadow-2xl shadow-black/20">
          <img
            src={teamImageUrl}
            alt="Schu Fi Ma Fi team"
            className="h-full min-h-[520px] w-full object-cover"
          />
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-24">
        <p className="text-xl font-bold italic text-violet-400">Unsere Story</p>

        <h2 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
          Wir lieben es, glückliche Momente zu teilen
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-700">
          Hier finden Sie einige Bilder von Veranstaltungen, die wir organisiert
          haben.
        </p>

        <div className="mt-10 overflow-hidden rounded-[2rem] shadow-2xl shadow-black/20">
          <img
            src={storyImageUrl}
            alt="Schu Fi Ma Fi event story"
            className="h-[620px] w-full object-cover"
          />
        </div>
      </section>

      <section className="bg-[#08080c] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="text-center">
            <p className="text-xl font-bold italic text-violet-300">
              Unser Team
            </p>

            <h2 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
              Solide Teamarbeit
            </h2>
          </div>

          <div className="mt-16 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {teamMembers.map((member) => (
              <article
                key={member.name}
                className="group relative min-h-[420px] overflow-hidden rounded-[2rem] bg-zinc-900"
              >
                <img
                  src={member.image}
                  alt={member.name}
                  className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

                <div className="absolute bottom-0 left-0 right-0 p-7">
                  <p className="text-lg font-bold italic text-violet-300">
                    {member.role}
                  </p>

                  <h3 className="mt-2 text-3xl font-black tracking-tight">
                    {member.name}
                  </h3>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};
