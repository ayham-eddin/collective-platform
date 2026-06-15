import {
  HomeContent,
  HomeContentDocument,
} from "../../database/models/HomeContent";

type HomeContentInput = Partial<HomeContentDocument>;

const defaultHomeContent = {
  heroBadge: {
    de: "Schu Fi Ma Fi Kollektiv",
    en: "Schu Fi Ma Fi Collective",
    ar: "شو في ما في",
  },
  heroTitle: {
    de: "Kultur, Musik und Events in NRW.",
    en: "Culture, music and events in NRW.",
    ar: "ثقافة، موسيقى وفعاليات في NRW.",
  },
  heroSubtitle: {
    de: "Ein syrisches kulturelles Kollektiv, das seit 2018 in Nordrhein-Westfalen aktiv ist und ein buntes Kulturprogramm für Community, Kunst und Begegnung gestaltet.",
    en: "A Syrian cultural collective active in North Rhine-Westphalia since 2018, creating cultural programs for community, art and connection.",
    ar: "تجمع ثقافي سوري نشط في شمال الراين وستفاليا منذ عام 2018، ينظم برامج ثقافية للفن والمجتمع والتواصل.",
  },
  primaryButton: {
    label: {
      de: "Events ansehen",
      en: "View events",
      ar: "عرض الفعاليات",
    },
    url: "/events",
  },
  secondaryButton: {
    label: {
      de: "Über uns",
      en: "About us",
      ar: "من نحن",
    },
    url: "/about",
  },
  aboutEyebrow: {
    de: "Zusammenarbeit beginnen",
    en: "Start collaboration",
    ar: "ابدأ التعاون",
  },
  aboutTitle: {
    de: "Sind Sie bereit, Ihr bestes Event mit uns zu veranstalten?",
    en: "Are you ready to organize your best event with us?",
    ar: "هل أنت مستعد لتنظيم أفضل فعالية معنا؟",
  },
  aboutText: {
    de: "Sie suchen ein Team, das Veranstaltungen mit Kultur, Community und Erfahrung organisiert? Wir entwickeln Programme, Events und Begegnungen mit Leidenschaft.",
    en: "Are you looking for a team that organizes events with culture, community and experience? We create programs, events and encounters with passion.",
    ar: "هل تبحث عن فريق ينظم فعاليات بثقافة وخبرة وروح مجتمعية؟ نحن نصنع البرامج والفعاليات واللقاءات بشغف.",
  },
  aboutButton: {
    label: {
      de: "Unsere Events",
      en: "Our events",
      ar: "فعالياتنا",
    },
    url: "/events",
  },
};

export const getHomeContent = async () => {
  const existingContent = await HomeContent.findOne();

  if (existingContent) {
    return existingContent;
  }

  return HomeContent.create(defaultHomeContent);
};

export const updateHomeContent = async (data: HomeContentInput) => {
  const existingContent = await getHomeContent();

  const updatedContent = await HomeContent.findByIdAndUpdate(
    existingContent._id,
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!updatedContent) {
    throw new Error("Home content not found");
  }

  return updatedContent;
};
