export const Footer = () => {
  return (
    <footer
      id="contact"
      className="border-t border-white/10 bg-[#08080c] text-white"
    >
      <div className="mx-auto grid max-w-7xl gap-6 px-6 py-14">
        <h2 className="text-3xl font-black tracking-tight">
          Collective Platform
        </h2>

        <p className="max-w-2xl leading-7 text-zinc-400">
          Modern events, cultural programs, galleries, videos, and ticket links.
        </p>

        <p className="text-sm text-zinc-600">
          © {new Date().getFullYear()} Collective Platform. All rights reserved.
        </p>
      </div>
    </footer>
  );
};
