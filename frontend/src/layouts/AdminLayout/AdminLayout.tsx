import { LogOut } from "lucide-react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { getStoredAdmin, logoutAdmin } from "../../services/auth.service";

export const AdminLayout = () => {
  const navigate = useNavigate();
  const admin = getStoredAdmin();

  const handleLogout = () => {
    logoutAdmin();
    navigate("/admin/login");
  };

  return (
    <main className="min-h-screen bg-[#0b0b10] text-white">
      <div className="grid min-h-screen lg:grid-cols-[280px_1fr]">
        <aside className="border-r border-white/10 bg-[#08080c] px-6 py-8">
          <div>
            <p className="text-2xl font-black tracking-tight">Admin Panel</p>
            <p className="mt-2 text-sm text-zinc-500">Schu Fi Ma Fi CMS</p>
          </div>

          <nav className="mt-10 grid gap-2">
            <NavLink to="/admin" end className={adminLinkClass}>
              Dashboard
            </NavLink>

            <NavLink to="/admin/home-content" className={adminLinkClass}>
              Home Content
            </NavLink>

            <NavLink to="/admin/settings" className={adminLinkClass}>
              Settings
            </NavLink>

            <NavLink to="/admin/events" className={adminLinkClass}>
              Events
            </NavLink>

            <NavLink to="/admin/gallery" className={adminLinkClass}>
              Gallery
            </NavLink>

            <NavLink to="/admin/videos" className={adminLinkClass}>
              Videos
            </NavLink>

            <NavLink to="/admin/team" className={adminLinkClass}>
              Team
            </NavLink>

            {admin?.role.isSuperAdmin && (
              <NavLink to="/admin/admins" className={adminLinkClass}>
                Admins
              </NavLink>
            )}
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
            <p className="mt-1 text-xl font-black">
              {admin?.fullName || "Admin"}
            </p>
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
