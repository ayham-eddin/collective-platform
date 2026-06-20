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
import type { AdminItem, AdminRole } from "../../../types/admin.types";
import {
  initialFormState,
  initialRoleFormState,
  permissionModules,
} from "./adminAdmins.constants";
import type {
  AdminFormState,
  Permission,
  PermissionAction,
  PermissionModule,
  RoleFormState,
} from "./adminAdmins.types";
import { AdminCreateForm } from "./components/AdminCreateForm";
import { AdminUsersTable } from "./components/AdminUsersTable";
import { RoleCreateForm } from "./components/RoleCreateForm";
import { RolesList } from "./components/RolesList";

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

  const startEditingAdmin = (admin: AdminItem) => {
    setEditingAdminId(admin._id);
    setEditFullName(admin.fullName);
    setEditRoleId(admin.role._id);
    setEditPassword("");
    setMessageText("");
    setErrorMessage("");
  };

  const cancelEditingAdmin = () => {
    setEditingAdminId(null);
    setEditFullName("");
    setEditRoleId("");
    setEditPassword("");
  };

  const handleSaveAdmin = async (adminId: string) => {
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

      cancelEditingAdmin();
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
        currentAdmins.map((currentAdminItem) =>
          currentAdminItem._id === updatedAdmin._id
            ? updatedAdmin
            : currentAdminItem,
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
        currentAdmins.filter(
          (currentAdminItem) => currentAdminItem._id !== admin._id,
        ),
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

      <RoleCreateForm
        roleFormState={roleFormState}
        isSaving={isSaving}
        onSubmit={handleCreateRole}
        onRoleFormChange={setRoleFormState}
        onTogglePermission={togglePermissionAction}
      />

      <RolesList
        roles={roles}
        editingRoleId={editingRoleId}
        editRoleName={editRoleName}
        editPermissions={editPermissions}
        isSaving={isSaving}
        onStartEditingRole={startEditingRole}
        onCancelEditingRole={cancelEditingRole}
        onSaveRole={handleSaveRole}
        onDeleteRole={handleDeleteRole}
        onEditRoleNameChange={setEditRoleName}
        onEditPermissionsChange={setEditPermissions}
        onTogglePermission={togglePermissionAction}
      />

      <AdminCreateForm
        formState={formState}
        roles={roles}
        isSaving={isSaving}
        onSubmit={handleCreateAdmin}
        onFieldChange={updateField}
      />

      <AdminUsersTable
        admins={admins}
        roles={roles}
        currentAdminId={currentAdmin?.id}
        editingAdminId={editingAdminId}
        editFullName={editFullName}
        editRoleId={editRoleId}
        editPassword={editPassword}
        isLoading={isLoading}
        isSaving={isSaving}
        onStartEditing={startEditingAdmin}
        onCancelEditing={cancelEditingAdmin}
        onSaveAdmin={handleSaveAdmin}
        onToggleActive={handleToggleActive}
        onDeleteAdmin={handleDeleteAdmin}
        onEditFullNameChange={setEditFullName}
        onEditRoleIdChange={setEditRoleId}
        onEditPasswordChange={setEditPassword}
      />
    </section>
  );
};
