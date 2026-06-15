export const AdminDashboardPage = () => {
  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Dashboard
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">
        Welcome to the CMS
      </h1>

      <p className="mt-4 max-w-2xl text-zinc-400">
        From here you will manage events, gallery images, videos, team members,
        homepage content and admin permissions.
      </p>

      <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {["Events", "Gallery", "Videos", "Team"].map((item) => (
          <article
            key={item}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6"
          >
            <p className="text-sm text-zinc-500">Manage</p>
            <h2 className="mt-2 text-2xl font-black">{item}</h2>
          </article>
        ))}
      </div>
    </section>
  );
};
