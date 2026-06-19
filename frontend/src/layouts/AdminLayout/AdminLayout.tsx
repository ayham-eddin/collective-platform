import { LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getStoredAdmin, logoutAdmin } from "../../services/auth.service";
import type {
  PermissionAction,
  PermissionModule,
} from "../../types/admin.types";
import { ScrollToTop } from "../../routes/components/ScrollToTop";

interface AdminNavItem {
  label: string;
  path: string;
  end?: boolean;
  module?: PermissionModule;
  action?: PermissionAction;
  superAdminOnly?: boolean;
}

const adminNavItems: AdminNavItem[] = [
  {
    label: "Dashboard",
    path: "/admin",
    end: true,
  },
  {
    label: "Home Content",
    path: "/admin/home-content",
    module: "home-content",
    action: "read",
  },
  {
    label: "Settings",
    path: "/admin/settings",
    module: "settings",
    action: "read",
  },
  {
    label: "Messages",
    path: "/admin/messages",
    module: "contact",
    action: "read",
  },
  {
    label: "Events",
    path: "/admin/events",
    module: "events",
    action: "read",
  },
  {
    label: "Gallery",
    path: "/admin/gallery",
    module: "gallery",
    action: "read",
  },
  {
    label: "Videos",
    path: "/admin/videos",
    module: "videos",
    action: "read",
  },
  {
    label: "Team",
    path: "/admin/team",
    module: "team",
    action: "read",
  },
  {
    label: "Admins",
    path: "/admin/admins",
    module: "admins",
    action: "read",
    superAdminOnly: true,
  },
];

export const AdminLayout = () => {
  const navigate = useNavigate();
  const admin = getStoredAdmin();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  const canAccess = (item: AdminNavItem) => {
    if (!admin) {
      return false;
    }

    if (!item.module || !item.action) {
      return true;
    }

    if (admin.role.isSuperAdmin) {
      return true;
    }

    if (item.superAdminOnly) {
      return false;
    }

    const permission = admin.role.permissions.find(
      (currentPermission) => currentPermission.module === item.module,
    );

    return permission?.actions.includes(item.action) || false;
  };

  const visibleNavItems = adminNavItems.filter(canAccess);

  return (
    <main className="min-h-screen bg-[#0b0b10] text-white">
      <ScrollToTop />
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-[#08080c] px-6 py-8">
          <div>
            <p className="text-2xl font-black tracking-tight">Admin Panel</p>
            <p className="mt-2 text-sm text-zinc-500">Schu Fi Ma Fi CMS</p>
          </div>

          <nav className="mt-10 grid gap-2">
            {visibleNavItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={adminLinkClass}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <button
            type="button"
            onClick={handleLogout}
            className="mt-10 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-400 hover:text-red-300"
          >
            <LogOut size={18} />
            Logout
          </button>
        </aside>

        <section className="px-6 py-8 lg:px-10">
          <div className="mb-8 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
            <p className="text-sm text-zinc-500">Logged in as</p>

            <div className="mt-1 flex flex-wrap items-center gap-3">
              <p className="text-xl font-black">{admin?.fullName || "Admin"}</p>

              {admin?.role.name && (
                <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black uppercase text-violet-300">
                  {admin.role.name}
                </span>
              )}
            </div>
          </div>

          <Outlet />
        </section>
      </div>
    </main>
  );
};

const adminLinkClass = ({ isActive }: { isActive: boolean }) =>
  [
    "rounded-2xl px-4 py-3 text-sm font-bold transition",
    isActive
      ? "bg-violet-600 text-white"
      : "text-zinc-400 hover:bg-white/5 hover:text-white",
  ].join(" ");
