// frontend/src/pages/Admin/Dashboard/AdminDashboardPage.tsx
import { CalendarDays, Image, Mail, Play, Star, Users } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getAdminDashboardStats,
  type DashboardStats,
} from "../../../services/dashboard.service";

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
  {
    label: "Messages",
    description: "Read and manage contact messages.",
    path: "/admin/messages",
  },
];

const emptyStats: DashboardStats = {
  totalEvents: 0,
  publishedEvents: 0,
  galleryImages: 0,
  videos: 0,
  teamMembers: 0,
  unreadMessages: 0,
};

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState<DashboardStats>(emptyStats);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [statsErrorMessage, setStatsErrorMessage] = useState("");

  useEffect(() => {
    const loadStats = async () => {
      try {
        const data = await getAdminDashboardStats();
        setStats(data);
      } catch {
        setStatsErrorMessage("Could not load dashboard statistics.");
      } finally {
        setIsLoadingStats(false);
      }
    };

    void loadStats();
  }, []);

  const statCards = [
    {
      label: "Total Events",
      value: stats.totalEvents,
      icon: <CalendarDays size={22} />,
    },
    {
      label: "Published Events",
      value: stats.publishedEvents,
      icon: <Star size={22} />,
    },
    {
      label: "Gallery Images",
      value: stats.galleryImages,
      icon: <Image size={22} />,
    },
    { label: "Videos", value: stats.videos, icon: <Play size={22} /> },
    {
      label: "Team Members",
      value: stats.teamMembers,
      icon: <Users size={22} />,
    },
    {
      label: "Unread Messages",
      value: stats.unreadMessages,
      icon: <Mail size={22} />,
    },
  ];

  return (
    <section>
      <p className="text-xs font-black uppercase tracking-[0.3em] text-violet-300 sm:text-sm sm:tracking-[0.35em]">
        Dashboard
      </p>

      <h1 className="mt-4 break-words text-3xl font-black tracking-tight sm:text-4xl">
        Welcome to the CMS
      </h1>

      <p className="mt-4 max-w-2xl text-sm leading-7 text-zinc-400 sm:text-base">
        From here you will manage events, gallery images, videos, team members,
        homepage content and admin permissions.
      </p>

      <div className="mt-10">
        <div>
          <h2 className="text-2xl font-black">Overview</h2>
          <p className="mt-2 text-sm text-zinc-500">
            Live statistics from your CMS content.
          </p>
        </div>

        {isLoadingStats && (
          <p className="mt-6 rounded-2xl border border-white/10 bg-white/[0.03] p-4 text-sm font-bold text-zinc-400">
            Loading dashboard statistics...
          </p>
        )}

        {statsErrorMessage && (
          <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
            {statsErrorMessage}
          </p>
        )}

        {!isLoadingStats && !statsErrorMessage && (
          <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {statCards.map((card) => (
              <article
                key={card.label}
                className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 sm:rounded-3xl sm:p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-zinc-500">
                    {card.label}
                  </p>

                  <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-600/20 text-violet-300">
                    {card.icon}
                  </span>
                </div>

                <p className="mt-5 text-4xl font-black tracking-tight sm:text-5xl">
                  {card.value}
                </p>
              </article>
            ))}
          </div>
        )}
      </div>

      <div className="mt-14">
        <h2 className="text-2xl font-black">Manage Content</h2>

        <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {dashboardItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className="rounded-[1.5rem] border border-white/10 bg-white/[0.04] p-5 transition hover:border-violet-400/50 hover:bg-white/[0.07] sm:rounded-3xl sm:p-6"
            >
              <p className="text-sm text-zinc-500">Manage</p>
              <h2 className="mt-2 break-words text-xl font-black sm:text-2xl">
                {item.label}
              </h2>
              <p className="mt-3 text-sm leading-6 text-zinc-400">
                {item.description}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
