import { Plus, Power, Save, ShieldCheck, Trash2, UserCog } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import {
  createAdminRole,
  createAdminUser,
  deleteAdminRole,
  deleteAdminUser,
  getAdminRoles,
  getAdminUsers,
  updateAdminRole,
  updateAdminUser,
} from "../../../services/admin.service";
import { getStoredAdmin } from "../../../services/auth.service";
import type {
  AdminItem,
  AdminRole,
  Permission,
  PermissionAction,
  PermissionModule,
} from "../../../types/admin.types";

type AdminFormState = {
  fullName: string;
  email: string;
  password: string;
  roleId: string;
};

type RoleFormState = {
  name: string;
  permissions: Permission[];
};

const permissionModules: PermissionModule[] = [
  "events",
  "gallery",
  "videos",
  "team",
  "pages",
  "home-content",
  "settings",
  "contact",
  "admins",
];

const permissionActions: PermissionAction[] = [
  "read",
  "create",
  "update",
  "delete",
  "publish",
];

const initialFormState: AdminFormState = {
  fullName: "",
  email: "",
  password: "",
  roleId: "",
};

const initialRoleFormState: RoleFormState = {
  name: "",
  permissions: permissionModules.map((moduleName) => ({
    module: moduleName,
    actions: [],
  })),
};

export const AdminAdminsPage = () => {
  const currentAdmin = getStoredAdmin();

  const [admins, setAdmins] = useState<AdminItem[]>([]);
  const [roles, setRoles] = useState<AdminRole[]>([]);
  const [formState, setFormState] = useState<AdminFormState>(initialFormState);
  const [roleFormState, setRoleFormState] =
    useState<RoleFormState>(initialRoleFormState);

  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [editFullName, setEditFullName] = useState("");
  const [editRoleId, setEditRoleId] = useState("");
  const [editPassword, setEditPassword] = useState("");

  const [editingRoleId, setEditingRoleId] = useState<string | null>(null);
  const [editRoleName, setEditRoleName] = useState("");
  const [editPermissions, setEditPermissions] = useState<Permission[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadAdminData = async () => {
      try {
        const [adminData, roleData] = await Promise.all([
          getAdminUsers(),
          getAdminRoles(),
        ]);

        setAdmins(adminData);
        setRoles(roleData);

        if (roleData[0]) {
          setFormState((currentState) => ({
            ...currentState,
            roleId: roleData[0]._id,
          }));
        }
      } catch {
        setErrorMessage("Could not load admins.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadAdminData();
  }, []);

  const updateField = (fieldName: keyof AdminFormState, value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const getNormalizedPermissions = (permissions: Permission[]) => {
    return permissionModules.map((moduleName) => {
      const existingPermission = permissions.find(
        (permission) => permission.module === moduleName,
      );

      return {
        module: moduleName,
        actions: existingPermission?.actions || [],
      };
    });
  };

  const togglePermissionAction = (
    permissions: Permission[],
    moduleName: PermissionModule,
    action: PermissionAction,
  ) => {
    return permissions.map((permission) => {
      if (permission.module !== moduleName) {
        return permission;
      }

      const hasAction = permission.actions.includes(action);

      return {
        ...permission,
        actions: hasAction
          ? permission.actions.filter(
              (currentAction) => currentAction !== action,
            )
          : [...permission.actions, action],
      };
    });
  };

  const handleCreateRole = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setMessageText("");
    setErrorMessage("");

    try {
      const createdRole = await createAdminRole({
        name: roleFormState.name,
        permissions: roleFormState.permissions,
      });

      setRoles((currentRoles) => [...currentRoles, createdRole]);
      setRoleFormState(initialRoleFormState);
      setMessageText("Role created successfully.");
    } catch {
      setErrorMessage("Could not create role.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditingRole = (role: AdminRole) => {
    setEditingRoleId(role._id);
    setEditRoleName(role.name);
    setEditPermissions(getNormalizedPermissions(role.permissions));
    setMessageText("");
    setErrorMessage("");
  };

  const cancelEditingRole = () => {
    setEditingRoleId(null);
    setEditRoleName("");
    setEditPermissions([]);
  };

  const handleSaveRole = async (roleId: string) => {
    setIsSaving(true);
    setMessageText("");
    setErrorMessage("");

    try {
      const updatedRole = await updateAdminRole(roleId, {
        name: editRoleName,
        permissions: editPermissions,
      });

      setRoles((currentRoles) =>
        currentRoles.map((role) =>
          role._id === updatedRole._id ? updatedRole : role,
        ),
      );

      setAdmins((currentAdmins) =>
        currentAdmins.map((admin) =>
          admin.role._id === updatedRole._id
            ? { ...admin, role: updatedRole }
            : admin,
        ),
      );

      cancelEditingRole();
      setMessageText("Role updated successfully.");
    } catch {
      setErrorMessage("Could not update role.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteRole = async (role: AdminRole) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete the role "${role.name}"?`,
    );

    if (!confirmed) {
      return;
    }

    setMessageText("");
    setErrorMessage("");

    try {
      await deleteAdminRole(role._id);
      setRoles((currentRoles) =>
        currentRoles.filter((currentRole) => currentRole._id !== role._id),
      );
      setMessageText("Role deleted successfully.");
    } catch {
      setErrorMessage(
        "Could not delete role. Make sure no admins are using this role.",
      );
    }
  };

  const handleCreateAdmin = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setMessageText("");
    setErrorMessage("");

    try {
      const createdAdmin = await createAdminUser({
        fullName: formState.fullName,
        email: formState.email,
        password: formState.password,
        roleId: formState.roleId,
      });

      setAdmins((currentAdmins) => [createdAdmin, ...currentAdmins]);
      setFormState({
        ...initialFormState,
        roleId: roles[0]?._id || "",
      });
      setMessageText("Admin created successfully.");
    } catch {
      setErrorMessage("Could not create admin.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (admin: AdminItem) => {
    setEditingAdminId(admin._id);
    setEditFullName(admin.fullName);
    setEditRoleId(admin.role._id);
    setEditPassword("");
    setMessageText("");
    setErrorMessage("");
  };

  const cancelEditing = () => {
    setEditingAdminId(null);
    setEditFullName("");
    setEditRoleId("");
    setEditPassword("");
  };

  const handleSaveEdit = async (adminId: string) => {
    setIsSaving(true);
    setMessageText("");
    setErrorMessage("");

    try {
      const updatedAdmin = await updateAdminUser(adminId, {
        fullName: editFullName,
        roleId: editRoleId,
        password: editPassword || undefined,
      });

      setAdmins((currentAdmins) =>
        currentAdmins.map((admin) =>
          admin._id === updatedAdmin._id ? updatedAdmin : admin,
        ),
      );

      cancelEditing();
      setMessageText("Admin updated successfully.");
    } catch {
      setErrorMessage("Could not update admin.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleActive = async (admin: AdminItem) => {
    const isCurrentAdmin = currentAdmin?.id === admin._id;

    if (isCurrentAdmin) {
      setErrorMessage("You cannot disable your own account.");
      return;
    }

    setMessageText("");
    setErrorMessage("");

    try {
      const updatedAdmin = await updateAdminUser(admin._id, {
        isActive: !admin.isActive,
      });

      setAdmins((currentAdmins) =>
        currentAdmins.map((currentAdmin) =>
          currentAdmin._id === updatedAdmin._id ? updatedAdmin : currentAdmin,
        ),
      );

      setMessageText("Admin status updated.");
    } catch {
      setErrorMessage("Could not update admin status.");
    }
  };

  const handleDeleteAdmin = async (admin: AdminItem) => {
    const isCurrentAdmin = currentAdmin?.id === admin._id;

    if (isCurrentAdmin) {
      setErrorMessage("You cannot delete your own account.");
      return;
    }

    if (admin.role.isSuperAdmin) {
      setErrorMessage("Super Admin accounts cannot be deleted.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this admin?",
    );

    if (!confirmed) {
      return;
    }

    setMessageText("");
    setErrorMessage("");

    try {
      await deleteAdminUser(admin._id);
      setAdmins((currentAdmins) =>
        currentAdmins.filter((currentAdmin) => currentAdmin._id !== admin._id),
      );
      setMessageText("Admin deleted successfully.");
    } catch {
      setErrorMessage("Could not delete admin.");
    }
  };

  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Admins
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">Manage Admins</h1>

      <p className="mt-4 text-zinc-400">
        Create admins, assign roles and manage access from here.
      </p>

      {messageText && (
        <p className="mt-8 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
          {messageText}
        </p>
      )}

      {errorMessage && (
        <p className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          {errorMessage}
        </p>
      )}

      <form
        onSubmit={handleCreateRole}
        className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <div className="flex items-center gap-3">
          <ShieldCheck className="text-violet-300" size={24} />
          <h2 className="text-2xl font-black">Create Role</h2>
        </div>

        <div className="mt-6">
          <TextInput
            label="Role Name"
            value={roleFormState.name}
            onChange={(value) =>
              setRoleFormState((currentState) => ({
                ...currentState,
                name: value,
              }))
            }
            required
          />
        </div>

        <div className="mt-6">
          <PermissionEditor
            permissions={roleFormState.permissions}
            onToggle={(moduleName, action) =>
              setRoleFormState((currentState) => ({
                ...currentState,
                permissions: togglePermissionAction(
                  currentState.permissions,
                  moduleName,
                  action,
                ),
              }))
            }
          />
        </div>

        <button
          type="submit"
          disabled={isSaving}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} />
          {isSaving ? "Creating..." : "Create Role"}
        </button>
      </form>

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
                        onChange={setEditRoleName}
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
                            onClick={() => void handleSaveRole(role._id)}
                            disabled={isSaving}
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                            aria-label="Save role"
                          >
                            <Save size={17} />
                          </button>

                          <button
                            type="button"
                            onClick={cancelEditingRole}
                            className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => startEditingRole(role)}
                            className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => void handleDeleteRole(role)}
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
                        setEditPermissions((currentPermissions) =>
                          togglePermissionAction(
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

      <form
        onSubmit={handleCreateAdmin}
        className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
      >
        <div className="flex items-center gap-3">
          <UserCog className="text-violet-300" size={24} />
          <h2 className="text-2xl font-black">Create Admin</h2>
        </div>

        <div className="mt-6 grid gap-5 lg:grid-cols-4">
          <TextInput
            label="Full Name"
            value={formState.fullName}
            onChange={(value) => updateField("fullName", value)}
            required
          />

          <TextInput
            label="Email"
            type="email"
            value={formState.email}
            onChange={(value) => updateField("email", value)}
            required
          />

          <TextInput
            label="Password"
            type="password"
            value={formState.password}
            onChange={(value) => updateField("password", value)}
            required
          />

          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-300">Role</span>
            <select
              value={formState.roleId}
              onChange={(event) => updateField("roleId", event.target.value)}
              required
              className={inputClassName}
            >
              {roles.map((role) => (
                <option key={role._id} value={role._id}>
                  {role.name}
                </option>
              ))}
            </select>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSaving || roles.length === 0}
          className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Plus size={18} />
          {isSaving ? "Creating..." : "Create Admin"}
        </button>
      </form>

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
                    const isCurrentAdmin = currentAdmin?.id === admin._id;

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
                                onChange={setEditFullName}
                              />

                              <TextInput
                                label="New Password"
                                type="password"
                                value={editPassword}
                                onChange={setEditPassword}
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
                                setEditRoleId(event.target.value)
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
                            ? new Date(admin.lastLoginAt).toLocaleString(
                                "de-DE",
                              )
                            : "Never"}
                        </td>

                        <td className="px-6 py-5">
                          <div className="flex justify-end gap-2">
                            {isEditing ? (
                              <>
                                <button
                                  type="button"
                                  onClick={() => void handleSaveEdit(admin._id)}
                                  disabled={isSaving}
                                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-emerald-400 hover:text-emerald-300 disabled:opacity-50"
                                  aria-label="Save admin"
                                >
                                  <Save size={17} />
                                </button>

                                <button
                                  type="button"
                                  onClick={cancelEditing}
                                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
                                >
                                  Cancel
                                </button>
                              </>
                            ) : (
                              <>
                                <button
                                  type="button"
                                  onClick={() => startEditing(admin)}
                                  className="rounded-full border border-white/10 px-4 py-2 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                                >
                                  Edit
                                </button>

                                <button
                                  type="button"
                                  onClick={() => void handleToggleActive(admin)}
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
                                  onClick={() => void handleDeleteAdmin(admin)}
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
    </section>
  );
};

interface PermissionEditorProps {
  permissions: Permission[];
  onToggle: (moduleName: PermissionModule, action: PermissionAction) => void;
}

const PermissionEditor = ({ permissions, onToggle }: PermissionEditorProps) => {
  return (
    <div className="overflow-hidden rounded-2xl border border-white/10">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[820px] border-collapse">
          <thead className="bg-white/[0.04] text-left text-sm text-zinc-400">
            <tr>
              <th className="px-4 py-3">Module</th>
              {permissionActions.map((action) => (
                <th key={action} className="px-4 py-3 capitalize">
                  {action}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="divide-y divide-white/10">
            {permissionModules.map((moduleName) => {
              const currentPermission = permissions.find(
                (permission) => permission.module === moduleName,
              );

              return (
                <tr key={moduleName}>
                  <td className="px-4 py-3 text-sm font-black text-white">
                    {moduleName}
                  </td>

                  {permissionActions.map((action) => (
                    <td key={action} className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={
                          currentPermission?.actions.includes(action) || false
                        }
                        onChange={() => onToggle(moduleName, action)}
                        className="h-5 w-5"
                      />
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password";
  required?: boolean;
  placeholder?: string;
}

const TextInput = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  placeholder,
}: TextInputProps) => {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-zinc-300">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  );
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
