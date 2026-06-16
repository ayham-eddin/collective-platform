import clsx from "clsx";
import { ChevronDown, Globe2, Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoFallback from "../../assets/logo-white.png";
import type { LanguageCode } from "../../contexts/language.types";
import { useLanguage } from "../../contexts/useLanguage";
import { getPublicSiteSettings } from "../../services/settings.service";
import type { SiteSettingsItem } from "../../types/settings.types";

export const Navbar = () => {
  const { language } = useLanguage();
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

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

  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08080c]/95 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" onClick={closeMenu} className="flex items-center gap-3">
          <img
            src={logoUrl}
            alt={siteName}
            className="h-14 w-32 object-contain sm:w-40"
          />
        </Link>

        <button
          type="button"
          onClick={() => setIsMenuOpen((currentValue) => !currentValue)}
          className="grid h-11 w-11 place-items-center rounded-full border border-white/10 text-white lg:hidden"
          aria-label="Toggle navigation"
        >
          {isMenuOpen ? <X size={22} /> : <Menu size={22} />}
        </button>

        <div className="hidden items-center gap-5 lg:flex">
          <DesktopLinks />
        </div>
      </nav>

      {isMenuOpen && (
        <div className="border-t border-white/10 bg-[#08080c] px-6 py-5 lg:hidden">
          <div className="grid gap-4">
            <MobileLinks onNavigate={closeMenu} />
          </div>
        </div>
      )}
    </header>
  );
};

const DesktopLinks = () => {
  const { language } = useLanguage();

  return (
    <>
      <NavLink to="/" className={navLinkClass}>
        {getNavText("home", language)}
      </NavLink>

      <NavLink to="/events" className={navLinkClass}>
        {getNavText("events", language)}
      </NavLink>

      <NavLink to="/about" className={navLinkClass}>
        {getNavText("about", language)}
      </NavLink>

      <NavLink to="/videos" className={navLinkClass}>
        {getNavText("videos", language)}
      </NavLink>

      <NavLink to="/gallery" className={navLinkClass}>
        {getNavText("gallery", language)}
      </NavLink>

      <NavLink to="/contact" className={navLinkClass}>
        {getNavText("contact", language)}
      </NavLink>

      <LanguageSwitcher />
    </>
  );
};

interface MobileLinksProps {
  onNavigate: () => void;
}

const MobileLinks = ({ onNavigate }: MobileLinksProps) => {
  const { language } = useLanguage();

  return (
    <>
      <NavLink to="/" onClick={onNavigate} className={mobileNavLinkClass}>
        {getNavText("home", language)}
      </NavLink>

      <NavLink to="/events" onClick={onNavigate} className={mobileNavLinkClass}>
        {getNavText("events", language)}
      </NavLink>

      <NavLink to="/about" onClick={onNavigate} className={mobileNavLinkClass}>
        {getNavText("about", language)}
      </NavLink>

      <NavLink to="/videos" onClick={onNavigate} className={mobileNavLinkClass}>
        {getNavText("videos", language)}
      </NavLink>

      <NavLink
        to="/gallery"
        onClick={onNavigate}
        className={mobileNavLinkClass}
      >
        {getNavText("gallery", language)}
      </NavLink>

      <NavLink
        to="/contact"
        onClick={onNavigate}
        className={mobileNavLinkClass}
      >
        {getNavText("contact", language)}
      </NavLink>

      <div className="mt-2">
        <LanguageSwitcher />
      </div>
    </>
  );
};

const LanguageSwitcher = () => {
  const { language, setLanguage, languageOptions } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);

  const activeLanguage =
    languageOptions.find((option) => option.code === language) ||
    languageOptions[0];

  const handleSelectLanguage = (nextLanguage: LanguageCode) => {
    setLanguage(nextLanguage);
    setIsOpen(false);
  };

  return (
    <div className="relative w-fit">
      <button
        type="button"
        onClick={() => setIsOpen((currentValue) => !currentValue)}
        className="flex items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-black text-zinc-300 transition hover:border-violet-400 hover:text-white"
        aria-label="Change language"
      >
        <Globe2 size={15} />
        <span>{activeLanguage.flag}</span>
        <span>{activeLanguage.shortLabel}</span>
        <ChevronDown size={14} />
      </button>

      {isOpen && (
        <div className="absolute right-0 top-full z-50 mt-3 w-44 overflow-hidden rounded-2xl border border-white/10 bg-[#101018] p-2 shadow-2xl shadow-black/40">
          {languageOptions.map((option) => (
            <button
              key={option.code}
              type="button"
              onClick={() => handleSelectLanguage(option.code)}
              className={clsx(
                "flex w-full items-center gap-3 rounded-xl px-3 py-3 text-left text-sm font-bold transition",
                option.code === language
                  ? "bg-violet-600 text-white"
                  : "text-zinc-300 hover:bg-white/5 hover:text-white",
              )}
            >
              <span>{option.flag}</span>
              <span>{option.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

type NavTextKey =
  | "home"
  | "events"
  | "about"
  | "videos"
  | "gallery"
  | "contact";

const navTexts: Record<NavTextKey, Record<LanguageCode, string>> = {
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
  videos: {
    de: "Events Videos",
    en: "Event Videos",
    ar: "فيديوهات",
  },
  gallery: {
    de: "Galerie",
    en: "Gallery",
    ar: "المعرض",
  },
  contact: {
    de: "Kontakt",
    en: "Contact",
    ar: "تواصل معنا",
  },
};

const getNavText = (key: NavTextKey, language: LanguageCode) => {
  return navTexts[key][language];
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "text-sm font-bold transition hover:text-white",
    isActive ? "text-white" : "text-zinc-400",
  );

const mobileNavLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "rounded-2xl px-4 py-3 text-base font-bold transition hover:bg-white/5 hover:text-white",
    isActive ? "bg-white/10 text-white" : "text-zinc-300",
  );
