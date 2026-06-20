import { Plus, UserCog } from "lucide-react";
import type { FormEvent } from "react";
import type { AdminRole } from "../../../../types/admin.types";
import { inputClassName } from "../adminAdmins.constants";
import type { AdminFormState } from "../adminAdmins.types";
import { TextInput } from "./TextInput";

interface AdminCreateFormProps {
  formState: AdminFormState;
  roles: AdminRole[];
  isSaving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (fieldName: keyof AdminFormState, value: string) => void;
}

export const AdminCreateForm = ({
  formState,
  roles,
  isSaving,
  onSubmit,
  onFieldChange,
}: AdminCreateFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
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
          onChange={(value) => onFieldChange("fullName", value)}
          required
        />

        <TextInput
          label="Email"
          type="email"
          value={formState.email}
          onChange={(value) => onFieldChange("email", value)}
          required
        />

        <TextInput
          label="Password"
          type="password"
          value={formState.password}
          onChange={(value) => onFieldChange("password", value)}
          required
        />

        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-300">Role</span>
          <select
            value={formState.roleId}
            onChange={(event) => onFieldChange("roleId", event.target.value)}
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
  );
};
