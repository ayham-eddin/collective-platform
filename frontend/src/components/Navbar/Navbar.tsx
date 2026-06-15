import clsx from "clsx";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logoFallback from "../../assets/logo-white.png";
import { getPublicSiteSettings } from "../../services/settings.service";
import type { SiteSettingsItem } from "../../types/settings.types";

export const Navbar = () => {
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
  const siteName = settings?.siteName.de || "Schu Fi Ma Fi Collective";

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
  return (
    <>
      <NavLink to="/" className={navLinkClass}>
        Home
      </NavLink>

      <NavLink to="/events" className={navLinkClass}>
        Events
      </NavLink>

      <NavLink to="/about" className={navLinkClass}>
        Über uns
      </NavLink>

      <NavLink to="/videos" className={navLinkClass}>
        Events Videos
      </NavLink>

      <NavLink to="/gallery" className={navLinkClass}>
        Galerie
      </NavLink>

      <a
        href="#contact"
        className="text-sm font-bold text-zinc-400 transition hover:text-white"
      >
        Contact
      </a>

      <LanguageSwitcher />
    </>
  );
};

interface MobileLinksProps {
  onNavigate: () => void;
}

const MobileLinks = ({ onNavigate }: MobileLinksProps) => {
  return (
    <>
      <NavLink to="/" onClick={onNavigate} className={mobileNavLinkClass}>
        Home
      </NavLink>

      <NavLink to="/events" onClick={onNavigate} className={mobileNavLinkClass}>
        Events
      </NavLink>

      <NavLink to="/about" onClick={onNavigate} className={mobileNavLinkClass}>
        Über uns
      </NavLink>

      <NavLink to="/videos" onClick={onNavigate} className={mobileNavLinkClass}>
        Events Videos
      </NavLink>

      <NavLink
        to="/gallery"
        onClick={onNavigate}
        className={mobileNavLinkClass}
      >
        Galerie
      </NavLink>

      <a
        href="#contact"
        onClick={onNavigate}
        className="rounded-2xl px-4 py-3 text-base font-bold text-zinc-300 transition hover:bg-white/5 hover:text-white"
      >
        Contact
      </a>

      <div className="mt-2">
        <LanguageSwitcher />
      </div>
    </>
  );
};

const LanguageSwitcher = () => {
  return (
    <div className="flex w-fit items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-black text-zinc-400">
      <button type="button" className="transition hover:text-white">
        DE
      </button>
      <span>/</span>
      <button type="button" className="transition hover:text-white">
        EN
      </button>
      <span>/</span>
      <button type="button" className="transition hover:text-white">
        AR
      </button>
    </div>
  );
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
