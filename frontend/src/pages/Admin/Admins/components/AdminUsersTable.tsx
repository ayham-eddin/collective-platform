import { Power, Save, Trash2 } from "lucide-react";
import type { AdminItem, AdminRole } from "../../../../types/admin.types";
import { inputClassName } from "../adminAdmins.constants";
import { TextInput } from "./TextInput";

interface AdminUsersTableProps {
  admins: AdminItem[];
  roles: AdminRole[];
  currentAdminId?: string;
  editingAdminId: string | null;
  editFullName: string;
  editRoleId: string;
  editPassword: string;
  isLoading: boolean;
  isSaving: boolean;
  onStartEditing: (admin: AdminItem) => void;
  onCancelEditing: () => void;
  onSaveAdmin: (adminId: string) => Promise<void>;
  onToggleActive: (admin: AdminItem) => Promise<void>;
  onDeleteAdmin: (admin: AdminItem) => Promise<void>;
  onEditFullNameChange: (value: string) => void;
  onEditRoleIdChange: (value: string) => void;
  onEditPasswordChange: (value: string) => void;
}

export const AdminUsersTable = ({
  admins,
  roles,
  currentAdminId,
  editingAdminId,
  editFullName,
  editRoleId,
  editPassword,
  isLoading,
  isSaving,
  onStartEditing,
  onCancelEditing,
  onSaveAdmin,
  onToggleActive,
  onDeleteAdmin,
  onEditFullNameChange,
  onEditRoleIdChange,
  onEditPasswordChange,
}: AdminUsersTableProps) => {
  return (
    <div className="mt-10">
      <h2 className="text-2xl font-black">Admin Users</h2>

      {isLoading && <p className="mt-6 text-zinc-400">Loading admins...</p>}

      {!isLoading && admins.length === 0 && (
        <p className="mt-6 text-zinc-400">No admins found.</p>
      )}

      {!isLoading && admins.length > 0 && (
        <div className="mt-6 overflow-hidden rounded-3xl border border-white/10">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[980px] border-collapse">
              <thead className="bg-white/[0.04] text-left text-sm text-zinc-400">
                <tr>
                  <th className="px-6 py-4">Admin</th>
                  <th className="px-6 py-4">Role</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Last Login</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-white/10">
                {admins.map((admin) => {
                  const isEditing = editingAdminId === admin._id;
                  const isSuperAdmin = admin.role.isSuperAdmin;
                  const isCurrentAdmin = currentAdminId === admin._id;

                  return (
                    <tr
                      key={admin._id}
                      className="transition hover:bg-white/[0.03]"
                    >
                      <td className="px-6 py-5">
                        {isEditing ? (
                          <div className="grid gap-3">
                            <TextInput
                              label="Full Name"
                              value={editFullName}
                              onChange={onEditFullNameChange}
                            />

                            <TextInput
                              label="New Password"
                              type="password"
                              value={editPassword}
                              onChange={onEditPasswordChange}
                              placeholder="Leave empty to keep password"
                            />
                          </div>
                        ) : (
                          <div>
                            <p className="font-black text-white">
                              {admin.fullName}
                            </p>
                            <p className="mt-1 text-sm text-zinc-500">
                              {admin.email}
                            </p>
                            {isCurrentAdmin && (
                              <p className="mt-2 text-xs font-black uppercase text-violet-300">
                                Current account
                              </p>
                            )}
                          </div>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        {isEditing ? (
                          <select
                            value={editRoleId}
                            onChange={(event) =>
                              onEditRoleIdChange(event.target.value)
                            }
                            className={inputClassName}
                            disabled={isSuperAdmin}
                          >
                            {roles.map((role) => (
                              <option key={role._id} value={role._id}>
                                {role.name}
                              </option>
                            ))}
                          </select>
                        ) : (
                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-zinc-300">
                            {admin.role.name}
                          </span>
                        )}
                      </td>

                      <td className="px-6 py-5">
                        <span
                          className={[
                            "rounded-full px-3 py-1 text-xs font-black uppercase",
                            admin.isActive
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-red-500/20 text-red-300",
                          ].join(" ")}
                        >
                          {admin.isActive ? "Active" : "Disabled"}
                        </span>
                      </td>

                      <td className="px-6 py-5 text-zinc-400">
                        {admin.lastLoginAt
                          ? new Date(admin.lastLoginAt).toLocaleString("de-DE")
                          : "Never"}
                      </td>

                      <td className="px-6 py-5">
                        <div className="flex justify-end gap-2">
                          {isEditing ? (
                            <>
                              <button
                                type="button"
                                onClick={() => void onSaveAdmin(admin._id)}
                                disabled={isSaving}
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                                aria-label="Save admin"
                              >
                                <Save size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={onCancelEditing}
                                className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
                              >
                                Cancel
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                onClick={() => onStartEditing(admin)}
                                className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                              >
                                Edit
                              </button>

                              <button
                                type="button"
                                onClick={() => void onToggleActive(admin)}
                                disabled={isCurrentAdmin}
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-yellow-400 hover:text-yellow-300 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Toggle admin status"
                                title={
                                  isCurrentAdmin
                                    ? "You cannot disable your own account"
                                    : undefined
                                }
                              >
                                <Power size={17} />
                              </button>

                              <button
                                type="button"
                                onClick={() => void onDeleteAdmin(admin)}
                                disabled={isSuperAdmin || isCurrentAdmin}
                                className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                                aria-label="Delete admin"
                                title={
                                  isCurrentAdmin
                                    ? "You cannot delete your own account"
                                    : isSuperAdmin
                                      ? "Super Admin cannot be deleted"
                                      : undefined
                                }
                              >
                                <Trash2 size={17} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
