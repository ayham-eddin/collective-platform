import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { TeamCarousel } from "../../components/TeamCarousel/TeamCarousel";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicTeamMembers } from "../../services/team.service";
import type { TeamMemberItem } from "../../types/team.types";

const aboutHeroImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const teamImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781436366/collective-platform/events/dfunilrfat4wnccfw5eh.jpg";

const storyImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const pageText = {
  breadcrumbHome: {
    de: "Home",
    en: "Home",
    ar: "الرئيسية",
  },
  breadcrumbAbout: {
    de: "Über uns",
    en: "About us",
    ar: "من نحن",
  },
  heroTitle: {
    de: "Über Uns",
    en: "About Us",
    ar: "من نحن",
  },
  historyEyebrow: {
    de: "Unsere wertvolle Geschichte",
    en: "Our valuable story",
    ar: "قصتنا المميزة",
  },
  historyTitle: {
    de: "Solides Team arbeitet für Schufimafi Collective",
    en: "A strong team works for Schufimafi Collective",
    ar: "فريق قوي يعمل من أجل شو في ما في",
  },
  historyTextOne: {
    de: "Schu Fi Ma Fi ist ein syrisches kulturelles Kollektiv, das seit 2018 in der Kulturszene in Deutschland aktiv ist. Wir streben eine offene und gesunde Gesellschaft an, die auf Augenhöhe miteinander kommuniziert und sich austauscht.\n\nWir investieren in jedes Event.",
    en: "Schu Fi Ma Fi is a Syrian cultural collective that has been active in the cultural scene in Germany since 2018. We aim for an open and healthy society that communicates and exchanges ideas on equal footing.\n\nWe invest in every event.",
    ar: "شو في ما في هو تجمع ثقافي سوري نشط في المشهد الثقافي في ألمانيا منذ عام 2018. نسعى إلى مجتمع منفتح وصحي يتواصل ويتبادل الأفكار باحترام وعلى قدم المساواة.\n\nنستثمر في كل فعالية.",
  },
  historyTextTwo: {
    de: "Wir geben uns die größte Mühe, jede Veranstaltung zu einem Erfolg zu machen und tun alles, was nötig ist. Wir sind die perfekte Wahl für Sie, wenn Sie Leute mit großer Erfahrung brauchen, um Ihre Veranstaltung zu managen.",
    en: "We do our very best to make every event a success and do everything needed. We are the perfect choice when you need people with strong experience to manage your event.",
    ar: "نبذل أقصى جهدنا لجعل كل فعالية ناجحة ونقوم بكل ما يلزم. نحن الخيار المناسب عندما تحتاج إلى أشخاص لديهم خبرة قوية لإدارة فعاليتك.",
  },
  eventsButton: {
    de: "Unsere Events",
    en: "Our Events",
    ar: "فعالياتنا",
  },
  storyEyebrow: {
    de: "Unsere Story",
    en: "Our Story",
    ar: "قصتنا",
  },
  storyTitle: {
    de: "Wir lieben es, glückliche Momente zu teilen",
    en: "We love sharing happy moments",
    ar: "نحب مشاركة اللحظات السعيدة",
  },
  storyDescription: {
    de: "Hier finden Sie einige Bilder von Veranstaltungen, die wir organisiert haben.",
    en: "Here you can find some photos from events we organized.",
    ar: "هنا تجد بعض الصور من الفعاليات التي قمنا بتنظيمها.",
  },
  teamEyebrow: {
    de: "Unser Team",
    en: "Our Team",
    ar: "فريقنا",
  },
  teamTitle: {
    de: "Menschen hinter dem Kollektiv",
    en: "People behind the collective",
    ar: "الأشخاص وراء التجمع",
  },
  teamDescription: {
    de: "Lernen Sie das Team kennen, das unsere Veranstaltungen, Ideen und kulturellen Momente möglich macht.",
    en: "Meet the team that makes our events, ideas and cultural moments possible.",
    ar: "تعرّف على الفريق الذي يجعل فعالياتنا وأفكارنا ولحظاتنا الثقافية ممكنة.",
  },
  loadingTeam: {
    de: "Teammitglieder werden geladen...",
    en: "Loading team members...",
    ar: "جاري تحميل أعضاء الفريق...",
  },
  noTeam: {
    de: "Noch keine Teammitglieder verfügbar.",
    en: "No team members available.",
    ar: "لا يوجد أعضاء فريق حالياً.",
  },
  featuredLabel: {
    de: "Featured",
    en: "Featured",
    ar: "مميز",
  },
};

export const AboutPage = () => {
  const { language } = useLanguage();
  const [teamMembers, setTeamMembers] = useState<TeamMemberItem[]>([]);
  const [isLoadingTeam, setIsLoadingTeam] = useState(true);
  const [teamErrorMessage, setTeamErrorMessage] = useState("");

  useEffect(() => {
    const loadTeamMembers = async () => {
      try {
        const data = await getPublicTeamMembers();
        setTeamMembers(data);
      } catch {
        setTeamErrorMessage("Could not load team members");
      } finally {
        setIsLoadingTeam(false);
      }
    };

    void loadTeamMembers();
  }, []);

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
                {pageText.breadcrumbHome[language]}
              </Link>
              <span>›</span>
              <span>{pageText.breadcrumbAbout[language]}</span>
            </div>

            <h1 className="text-6xl font-black tracking-tight md:text-8xl">
              {pageText.heroTitle[language]}
            </h1>

            <div className="mt-10 h-px w-full max-w-5xl border-t border-dashed border-white/50" />
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-12 px-6 py-24 lg:grid-cols-[1fr_0.9fr]">
        <div>
          <p className="text-xl font-bold italic text-violet-400">
            {pageText.historyEyebrow[language]}
          </p>

          <h2 className="mt-6 max-w-4xl text-5xl font-black leading-tight tracking-tight md:text-6xl">
            {pageText.historyTitle[language]}
          </h2>

          <div className="mt-10 grid gap-8 text-lg leading-8 text-zinc-800 md:grid-cols-2">
            <p className="whitespace-pre-line">
              {pageText.historyTextOne[language]}
            </p>

            <p>{pageText.historyTextTwo[language]}</p>
          </div>

          <Link to="/events" className="mt-10 btn btn-primary">
            {pageText.eventsButton[language]}
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
        <p className="text-xl font-bold italic text-violet-400">
          {pageText.storyEyebrow[language]}
        </p>

        <h2 className="mt-6 text-5xl font-black tracking-tight md:text-7xl">
          {pageText.storyTitle[language]}
        </h2>

        <p className="mt-8 max-w-3xl text-lg leading-8 text-zinc-700">
          {pageText.storyDescription[language]}
        </p>

        <div className="mt-10 overflow-hidden rounded-[2rem] shadow-2xl shadow-black/20">
          <img
            src={storyImageUrl}
            alt="Schu Fi Ma Fi event story"
            className="h-[620px] w-full object-cover"
          />
        </div>
      </section>

      <section className="overflow-hidden bg-[#08080c] py-24 text-white">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xl font-bold italic text-violet-300">
              {pageText.teamEyebrow[language]}
            </p>

            <h2 className="mt-4 text-5xl font-black tracking-tight md:text-6xl">
              {pageText.teamTitle[language]}
            </h2>

            <p className="mt-6 text-lg leading-8 text-zinc-400">
              {pageText.teamDescription[language]}
            </p>
          </div>

          {isLoadingTeam && (
            <p className="mt-12 text-center text-zinc-500">
              {pageText.loadingTeam[language]}
            </p>
          )}

          {teamErrorMessage && (
            <p className="mt-12 text-center text-red-400">{teamErrorMessage}</p>
          )}

          {!isLoadingTeam && !teamErrorMessage && teamMembers.length === 0 && (
            <p className="mt-12 text-center text-zinc-500">
              {pageText.noTeam[language]}
            </p>
          )}

          {!isLoadingTeam && !teamErrorMessage && teamMembers.length > 0 && (
            <TeamCarousel
              members={teamMembers}
              language={language}
              featuredLabel={pageText.featuredLabel[language]}
            />
          )}
        </div>
      </section>
    </main>
  );
};
