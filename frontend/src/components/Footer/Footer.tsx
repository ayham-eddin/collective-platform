import { Mail, MapPin, Phone } from "lucide-react";
import { FaFacebookF, FaInstagram, FaYoutube, FaTiktok } from "react-icons/fa";
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
    <footer className="border-t border-white/10 bg-[#08080c] text-white">
      <div className="mx-auto grid max-w-7xl gap-10 px-5 py-14 sm:px-6 sm:py-16 md:grid-cols-2 lg:grid-cols-[1.35fr_1fr_1fr_1fr] lg:gap-12 lg:py-20">
        <div>
          <Link to="/" className="inline-flex items-center">
            <img
              src={logoUrl}
              alt={siteName}
              className="h-24 w-40 object-contain sm:h-32 sm:w-48 lg:h-36 lg:w-56"
            />
          </Link>

          <p className="mt-5 max-w-sm break-words text-sm font-semibold leading-7 text-zinc-400 sm:text-base sm:leading-8">
            {siteDescription}
          </p>
        </div>

        <FooterColumn title={footerText.quickLinks[language]}>
          <FooterLink to="/">{footerText.home[language]}</FooterLink>
          <FooterLink to="/events">{footerText.events[language]}</FooterLink>
          <FooterLink to="/about">{footerText.about[language]}</FooterLink>
          <FooterLink to="/gallery">{footerText.gallery[language]}</FooterLink>
          <FooterLink to="/videos">{footerText.videos[language]}</FooterLink>
          <FooterLink to="/contact">
            {footerText.contactLink[language]}
          </FooterLink>
        </FooterColumn>

        <FooterColumn title={footerText.contact[language]}>
          <a
            href={`mailto:${contactEmail}`}
            className="flex items-start gap-3 break-all text-sm transition hover:text-white mt-3"
          >
            <Mail size={20} className="mt-1 shrink-0 text-violet-300" />
            <span>{contactEmail}</span>
          </a>

          {settings?.contactPhone && (
            <a
              href={`tel:${settings.contactPhone}`}
              className="flex items-start  gap-3 break-all text-sm transition hover:text-white mt-3"
            >
              <Phone size={22} className="mt-1 shrink-0 text-violet-300" />
              {settings.contactPhone}
            </a>
          )}

          <p className="flex items-start gap-3 break-all text-sm transition hover:text-white mt-3">
            <MapPin size={22} className="mt-1 shrink-0 text-violet-300" />
            <span>Düsseldorf</span>
          </p>
        </FooterColumn>

        <FooterColumn title={footerText.socialMedia[language]}>
          <div className="flex flex-wrap gap-3">
            {settings?.facebookUrl && (
              <a
                href={settings.facebookUrl}
                target="_blank"
                rel="noreferrer"
                className={socialLinkClass}
                aria-label="Facebook"
              >
                <FaFacebookF />
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
                <FaInstagram />
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
                <FaYoutube size={18} />
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
                <FaTiktok size={18} />
              </a>
            )}

            {!settings?.facebookUrl &&
              !settings?.instagramUrl &&
              !settings?.youtubeUrl &&
              !settings?.tiktokUrl && (
                <p className="text-sm leading-7 text-zinc-400">
                  {footerText.noSocialLinks[language]}
                </p>
              )}
          </div>
        </FooterColumn>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/10 px-5 py-7 text-center text-sm font-bold leading-6 text-zinc-500 sm:px-6">
        {footerText.developedBy[language]} © {new Date().getFullYear()}{" "}
        {siteName}
      </div>
    </footer>
  );
};

interface FooterColumnProps {
  title: string;
  children: React.ReactNode;
}

const FooterColumn = ({ title, children }: FooterColumnProps) => {
  return (
    <div>
      <h3 className="text-lg font-black sm:text-xl">{title}</h3>
      <div className="mt-5 grid gap-3 text-sm font-semibold leading-7 sm:mt-6 sm:text-base">
        {children}
      </div>
    </div>
  );
};

interface FooterLinkProps {
  to: string;
  children: React.ReactNode;
}

const FooterLink = ({ to, children }: FooterLinkProps) => {
  return (
    <Link to={to} className="text-zinc-400 transition hover:text-white">
      {children}
    </Link>
  );
};

const socialLinkClass =
  "grid h-11 w-11 place-items-center rounded-full border border-white/15 text-lg font-black text-zinc-300 transition hover:border-violet-400 hover:bg-violet-500 hover:text-white sm:h-12 sm:w-12";
