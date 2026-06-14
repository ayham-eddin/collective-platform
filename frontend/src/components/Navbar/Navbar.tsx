import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";
import logo from "../../assets/logo.png";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08080c]/90 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-4">
        <Link to="/" className="flex items-center gap-3">
          <div className="bg-white px-1">
            <img
              src={logo}
              alt="Schu Fi Ma Fi Kollektiv"
              className="h-14 w-14 rounded-xl object-contain"
            />
          </div>

          <div className="hidden leading-none sm:block">
            <p className="text-lg font-black uppercase tracking-tight text-white">
              Schu Fi Ma Fi
            </p>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-zinc-400">
              Collective
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-5">
          <NavLink to="/" className={navLinkClass}>
            Home
          </NavLink>

          <NavLink to="/events" className={navLinkClass}>
            Events
          </NavLink>

          <a
            href="#contact"
            className="text-sm font-bold text-zinc-400 transition hover:text-white"
          >
            Contact
          </a>

          <div className="hidden items-center gap-2 rounded-full border border-white/10 px-3 py-2 text-xs font-black text-zinc-400 md:flex">
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
        </div>
      </nav>
    </header>
  );
};

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  clsx(
    "text-sm font-bold transition hover:text-white",
    isActive ? "text-white" : "text-zinc-400",
  );
