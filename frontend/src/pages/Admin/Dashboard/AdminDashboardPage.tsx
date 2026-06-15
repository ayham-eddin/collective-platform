import { Link } from "react-router-dom";

const dashboardItems = [
  {
    label: "Home Content",
    description: "Edit homepage hero and about preview.",
    path: "/admin/home-content",
  },
  {
    label: "Events",
    description: "Create, edit and publish events.",
    path: "/admin/events",
  },
  {
    label: "Gallery",
    description: "Upload, edit and reorder gallery images.",
    path: "/admin/gallery",
  },
  {
    label: "Videos",
    description: "Manage uploaded videos and YouTube links.",
    path: "/admin/videos",
  },
  {
    label: "Team",
    description: "Manage team members and roles.",
    path: "/admin/team",
  },
];

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

      <div className="mt-10 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {dashboardItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className="rounded-3xl border border-white/10 bg-white/[0.04] p-6 transition hover:border-violet-400/50 hover:bg-white/[0.07]"
          >
            <p className="text-sm text-zinc-500">Manage</p>
            <h2 className="mt-2 text-2xl font-black">{item.label}</h2>
            <p className="mt-3 text-sm leading-6 text-zinc-400">
              {item.description}
            </p>
          </Link>
        ))}
      </div>
    </section>
  );
};
