import { Save, Trash2 } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import type { AdminRole } from "../../../../types/admin.types";
import type {
  Permission,
  PermissionAction,
  PermissionModule,
} from "../adminAdmins.types";
import { PermissionEditor } from "./PermissionEditor";
import { TextInput } from "./TextInput";

interface RolesListProps {
  roles: AdminRole[];
  editingRoleId: string | null;
  editRoleName: string;
  editPermissions: Permission[];
  isSaving: boolean;
  onStartEditingRole: (role: AdminRole) => void;
  onCancelEditingRole: () => void;
  onSaveRole: (roleId: string) => Promise<void>;
  onDeleteRole: (role: AdminRole) => Promise<void>;
  onEditRoleNameChange: (value: string) => void;
  onEditPermissionsChange: Dispatch<SetStateAction<Permission[]>>;
  onTogglePermission: (
    permissions: Permission[],
    moduleName: PermissionModule,
    action: PermissionAction,
  ) => Permission[];
}

export const RolesList = ({
  roles,
  editingRoleId,
  editRoleName,
  editPermissions,
  isSaving,
  onStartEditingRole,
  onCancelEditingRole,
  onSaveRole,
  onDeleteRole,
  onEditRoleNameChange,
  onEditPermissionsChange,
  onTogglePermission,
}: RolesListProps) => {
  return (
    <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-2xl font-black">Roles & Permissions</h2>

      <div className="mt-6 grid gap-5">
        {roles.map((role) => {
          const isEditingRole = editingRoleId === role._id;

          return (
            <div
              key={role._id}
              className="rounded-3xl border border-white/10 bg-black/30 p-5"
            >
              <div className="flex flex-wrap items-start justify-between gap-4">
                <div>
                  {isEditingRole ? (
                    <TextInput
                      label="Role Name"
                      value={editRoleName}
                      onChange={onEditRoleNameChange}
                    />
                  ) : (
                    <>
                      <h3 className="text-xl font-black">{role.name}</h3>
                      <p className="mt-1 text-sm text-zinc-500">
                        {role.isSuperAdmin
                          ? "Full system access"
                          : "Custom permissions"}
                      </p>
                    </>
                  )}
                </div>

                {!role.isSuperAdmin && (
                  <div className="flex gap-2">
                    {isEditingRole ? (
                      <>
                        <button
                          type="button"
                          onClick={() => void onSaveRole(role._id)}
                          disabled={isSaving}
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                          aria-label="Save role"
                        >
                          <Save size={17} />
                        </button>

                        <button
                          type="button"
                          onClick={onCancelEditingRole}
                          className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
                        >
                          Cancel
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          type="button"
                          onClick={() => onStartEditingRole(role)}
                          className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          onClick={() => void onDeleteRole(role)}
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-red-400 hover:text-red-300"
                          aria-label="Delete role"
                        >
                          <Trash2 size={17} />
                        </button>
                      </>
                    )}
                  </div>
                )}
              </div>

              {isEditingRole ? (
                <div className="mt-5">
                  <PermissionEditor
                    permissions={editPermissions}
                    onToggle={(moduleName, action) =>
                      onEditPermissionsChange((currentPermissions) =>
                        onTogglePermission(
                          currentPermissions,
                          moduleName,
                          action,
                        ),
                      )
                    }
                  />
                </div>
              ) : (
                <div className="mt-5 flex flex-wrap gap-2">
                  {role.isSuperAdmin ? (
                    <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black uppercase text-violet-300">
                      All Permissions
                    </span>
                  ) : (
                    role.permissions.map((permission) => (
                      <span
                        key={permission.module}
                        className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold text-zinc-300"
                      >
                        {permission.module}:{" "}
                        {permission.actions.length > 0
                          ? permission.actions.join(", ")
                          : "none"}
                      </span>
                    ))
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
