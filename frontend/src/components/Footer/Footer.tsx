import { Mail, MapPin, Music2, Play } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import logoFallback from "../../assets/logo-white.png";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicSiteSettings } from "../../services/settings.service";
import type { SiteSettingsItem } from "../../types/settings.types";

const footerText = {
  quickLinks: {
    de: "Schneller Link",
    en: "Quick Links",
    ar: "روابط سريعة",
  },
  contact: {
    de: "Kontakt Uns",
    en: "Contact us",
    ar: "تواصل معنا",
  },
  socialMedia: {
    de: "Soziale Medien",
    en: "Social Media",
    ar: "وسائل التواصل",
  },
  noSocialLinks: {
    de: "Noch keine Social-Media-Links hinzugefügt.",
    en: "No social links added yet.",
    ar: "لم تتم إضافة روابط تواصل بعد.",
  },
  developedBy: {
    de: "Developed by Ayham",
    en: "Developed by Ayham",
    ar: "تم التطوير بواسطة Ayham",
  },
  home: {
    de: "Home",
    en: "Home",
    ar: "الرئيسية",
  },
  events: {
    de: "Events",
    en: "Events",
    ar: "الفعاليات",
  },
  about: {
    de: "Über uns",
    en: "About us",
    ar: "من نحن",
  },
  gallery: {
    de: "Galerie",
    en: "Gallery",
    ar: "المعرض",
  },
  videos: {
    de: "Events Videos",
    en: "Event Videos",
    ar: "فيديوهات الفعاليات",
  },
  contactLink: {
    de: "Kontakt",
    en: "Contact",
    ar: "تواصل معنا",
  },
};

export const Footer = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPublicSiteSettings();
        setSettings(data);
      } catch {
        setSettings(null);
      }
    };

    void loadSettings();
  }, []);

  const logoUrl = settings?.logo?.url || logoFallback;
  const siteName = settings?.siteName[language] || "Schu Fi Ma Fi Collective";
  const siteDescription =
    settings?.siteDescription[language] ||
    "Seit 2018 ist SFMF Kollektiv ein konsequenter Kulturanbieter für die syrische Gemeinde in NRW.";
  const contactEmail =
    settings?.contactEmail || "contact@schufimafi-collective.com";

  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-[#08080c] text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-16 md:grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1fr] lg:py-20">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img
              src={logoUrl}
              alt={siteName}
              className="h-32 w-48 object-contain sm:h-40 sm:w-56"
            />
          </Link>

          <p className="mt-6 max-w-sm font-semibold leading-8 text-zinc-500">
            {siteDescription}
          </p>
        </div>

        <div>
          <h3 className="text-xl font-black">
            {footerText.quickLinks[language]}
          </h3>

          <div className="mt-6 grid gap-4 text-zinc-500">
            <Link to="/" className="transition hover:text-white">
              {footerText.home[language]}
            </Link>
            <Link to="/events" className="transition hover:text-white">
              {footerText.events[language]}
            </Link>
            <Link to="/about" className="transition hover:text-white">
              {footerText.about[language]}
            </Link>
            <Link to="/gallery" className="transition hover:text-white">
              {footerText.gallery[language]}
            </Link>
            <Link to="/videos" className="transition hover:text-white">
              {footerText.videos[language]}
            </Link>
            <Link to="/contact" className="transition hover:text-white">
              {footerText.contactLink[language]}
            </Link>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black">{footerText.contact[language]}</h3>

          <div className="mt-6 grid gap-4 text-zinc-500">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-3 break-all transition hover:text-white"
            >
              <Mail size={20} />
              {contactEmail}
            </a>

            {settings?.contactPhone && (
              <a
                href={`tel:${settings.contactPhone}`}
                className="transition hover:text-white"
              >
                {settings.contactPhone}
              </a>
            )}

            <p className="flex items-center gap-3">
              <MapPin size={22} />
              Düsseldorf
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black">
            {footerText.socialMedia[language]}
          </h3>

          <div className="mt-6 flex flex-wrap gap-3">
            {settings?.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
                aria-label="Facebook"
              >
                f
              </a>
            )}

            {settings?.instagramUrl && (
              <a
                href={settings.instagramUrl}
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
                aria-label="Instagram"
              >
                ◎
              </a>
            )}

            {settings?.youtubeUrl && (
              <a
                href={settings.youtubeUrl}
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
                aria-label="YouTube"
              >
                <Play size={18} />
              </a>
            )}

            {settings?.tiktokUrl && (
              <a
                href={settings.tiktokUrl}
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
                aria-label="TikTok"
              >
                <Music2 size={18} />
              </a>
            )}

            {!settings?.facebookUrl &&
              !settings?.instagramUrl &&
              !settings?.youtubeUrl &&
              !settings?.tiktokUrl && (
                <p className="text-zinc-500">
                  {footerText.noSocialLinks[language]}
                </p>
              )}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/10 px-6 py-8 text-center text-sm font-bold text-zinc-500">
        {footerText.developedBy[language]} © {new Date().getFullYear()}{" "}
        {siteName}
      </div>
    </footer>
  );
};

const socialLinkClass =
  "grid h-12 w-12 place-items-center rounded-full border border-white/15 text-lg font-black text-zinc-400 transition hover:border-violet-400 hover:bg-violet-500 hover:text-white";
