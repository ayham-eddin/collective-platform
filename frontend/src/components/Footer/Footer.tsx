import { Mail, MapPin, Music2, Play } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

export const Footer = () => {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-[#08080c] text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <Link to="/" className="flex items-center gap-4">
            <img
              src={logo}
              alt="Schu Fi Ma Fi Kollektiv"
              className="h-24 w-24 rounded-2xl object-contain"
            />

            <div>
              <p className="text-3xl font-black uppercase leading-none">
                Schu Fi
                <br />
                Ma Fi
              </p>
              <p className="mt-1 text-sm uppercase tracking-[0.28em] text-zinc-400">
                Collective
              </p>
            </div>
          </Link>

          <p className="mt-8 max-w-sm font-semibold leading-8 text-zinc-500">
            Seit 2018 ist SFMF Kollektiv ein konsequenter Kulturanbieter für die
            syrische Gemeinde in NRW.
          </p>
        </div>

        <div>
          <h3 className="text-xl font-black">Schneller Link</h3>

          <div className="mt-6 grid gap-4 text-zinc-500">
            <Link to="/" className="transition hover:text-white">
              Home
            </Link>
            <Link to="/events" className="transition hover:text-white">
              Events
            </Link>
            <a href="#about-preview" className="transition hover:text-white">
              Über uns
            </a>
            <a href="#contact" className="transition hover:text-white">
              Kontakt
            </a>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black">Kontakt Uns</h3>

          <div className="mt-6 grid gap-4 text-zinc-500">
            <a
              href="mailto:contact@schufimafi-collective.com"
              className="flex items-center gap-3 transition hover:text-white"
            >
              <Mail size={20} />
              contact@schufimafi-collective.com
            </a>

            <p className="flex items-center gap-3">
              <MapPin size={22} />
              Düsseldorf
            </p>
          </div>
        </div>

        <div>
          <h3 className="text-xl font-black">Soziale Medien</h3>

          <div className="mt-6 flex flex-wrap gap-3">
            <a href="/" className={socialLinkClass} aria-label="Facebook">
              f
            </a>

            <a href="/" className={socialLinkClass} aria-label="Instagram">
              ◎
            </a>

            <a href="/" className={socialLinkClass} aria-label="YouTube">
              <Play size={18} />
            </a>

            <a href="/" className={socialLinkClass} aria-label="TikTok">
              <Music2 size={18} />
            </a>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl border-t border-white/10 px-6 py-8 text-center text-sm font-bold text-zinc-500">
        Developed by Ayham © {new Date().getFullYear()} Schu Fi Ma Fi Collective
      </div>
    </footer>
  );
};

const socialLinkClass =
  "grid h-12 w-12 place-items-center rounded-full border border-white/15 text-lg font-black text-zinc-400 transition hover:border-violet-400 hover:bg-violet-500 hover:text-white";
