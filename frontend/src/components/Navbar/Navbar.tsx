import clsx from "clsx";
import { Link, NavLink } from "react-router-dom";

export const Navbar = () => {
  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#08080c]/85 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-6 px-6 py-5">
        <Link to="/" className="text-2xl font-black tracking-tight text-white">
          Schu Fi Ma Fi
        </Link>

        <div className="flex items-center gap-5">
          <NavLink
            to="/"
            className={({ isActive }) =>
              clsx(
                "text-sm font-bold transition hover:text-white",
                isActive ? "text-white" : "text-zinc-400",
              )
            }
          >
            Home
          </NavLink>

          <NavLink
            to="/events"
            className={({ isActive }) =>
              clsx(
                "text-sm font-bold transition hover:text-white",
                isActive ? "text-white" : "text-zinc-400",
              )
            }
          >
            Events
          </NavLink>

          <a
            href="#contact"
            className="text-sm font-bold text-zinc-400 transition hover:text-white"
          >
            Contact
          </a>
        </div>
      </nav>
    </header>
  );
};
