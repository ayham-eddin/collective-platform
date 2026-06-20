import { Plus, ShieldCheck } from "lucide-react";
import type { Dispatch, FormEvent, SetStateAction } from "react";
import type {
  Permission,
  PermissionAction,
  PermissionModule,
  RoleFormState,
} from "../adminAdmins.types";
import { PermissionEditor } from "./PermissionEditor";
import { TextInput } from "./TextInput";

interface RoleCreateFormProps {
  roleFormState: RoleFormState;
  isSaving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onRoleFormChange: Dispatch<SetStateAction<RoleFormState>>;
  onTogglePermission: (
    permissions: Permission[],
    moduleName: PermissionModule,
    action: PermissionAction,
  ) => Permission[];
}

export const RoleCreateForm = ({
  roleFormState,
  isSaving,
  onSubmit,
  onRoleFormChange,
  onTogglePermission,
}: RoleCreateFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
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
            onRoleFormChange((currentState) => ({
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
            onRoleFormChange((currentState) => ({
              ...currentState,
              permissions: onTogglePermission(
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
  );
};
