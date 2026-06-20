import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import type { TeamMemberImage } from "../../../../types/team.types";
import type { TeamFormState } from "../adminTeamForm.types";

interface AdminTeamMemberFormProps {
  formState: TeamFormState;
  image: TeamMemberImage | null;
  isUploadingImage: boolean;
  onFieldChange: (
    fieldName: keyof TeamFormState,
    value: string | boolean,
  ) => void;
  onImageChange: (image: TeamMemberImage | null) => void;
  onUploadImage: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const AdminTeamMemberForm = ({
  formState,
  image,
  isUploadingImage,
  onFieldChange,
  onImageChange,
  onUploadImage,
}: AdminTeamMemberFormProps) => {
  return (
    <div className="mt-6 grid gap-8">
      <div className="grid gap-5 lg:grid-cols-3">
        <TextInput
          label="Full Name"
          value={formState.fullName}
          onChange={(value) => onFieldChange("fullName", value)}
          required
        />

        <TextInput
          label="Sort Order"
          type="number"
          value={formState.sortOrder}
          onChange={(value) => onFieldChange("sortOrder", value)}
        />

        <label className="flex items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
          <input
            type="checkbox"
            checked={formState.isFeatured}
            onChange={(event) =>
              onFieldChange("isFeatured", event.target.checked)
            }
            className="h-5 w-5"
          />
          <span className="text-sm font-bold text-zinc-300">
            Featured member
          </span>
        </label>
      </div>

      <div>
        <p className="text-sm font-bold text-zinc-300">Image</p>

        <div className="mt-3 flex flex-wrap items-center gap-4">
          {image && (
            <img
              src={image.url}
              alt="Team member"
              className="h-28 w-28 rounded-2xl object-cover"
            />
          )}

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300">
            <Upload size={17} />
            {isUploadingImage ? "Uploading..." : "Upload Image"}
            <input
              type="file"
              accept="image/*"
              onChange={onUploadImage}
              disabled={isUploadingImage}
              className="hidden"
            />
          </label>

          {image && (
            <button
              type="button"
              onClick={() => onImageChange(null)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-400 hover:text-red-300"
            >
              Remove Image
            </button>
          )}
        </div>
      </div>

      <FormSection title="Role">
        <TextInput
          label="Role DE"
          value={formState.roleDe}
          onChange={(value) => onFieldChange("roleDe", value)}
          required
        />
        <TextInput
          label="Role EN"
          value={formState.roleEn}
          onChange={(value) => onFieldChange("roleEn", value)}
          required
        />
        <TextInput
          label="Role AR"
          value={formState.roleAr}
          onChange={(value) => onFieldChange("roleAr", value)}
          required
        />
      </FormSection>

      <FormSection title="Biography">
        <TextAreaInput
          label="Biography DE"
          value={formState.biographyDe}
          onChange={(value) => onFieldChange("biographyDe", value)}
        />
        <TextAreaInput
          label="Biography EN"
          value={formState.biographyEn}
          onChange={(value) => onFieldChange("biographyEn", value)}
        />
        <TextAreaInput
          label="Biography AR"
          value={formState.biographyAr}
          onChange={(value) => onFieldChange("biographyAr", value)}
        />
      </FormSection>

      <div>
        <h3 className="text-lg font-black">Contact & Social Links</h3>

        <div className="mt-4 grid gap-5 lg:grid-cols-4">
          <TextInput
            label="Email"
            type="email"
            value={formState.email}
            onChange={(value) => onFieldChange("email", value)}
          />
          <TextInput
            label="Instagram URL"
            value={formState.instagramUrl}
            onChange={(value) => onFieldChange("instagramUrl", value)}
          />
          <TextInput
            label="Facebook URL"
            value={formState.facebookUrl}
            onChange={(value) => onFieldChange("facebookUrl", value)}
          />
          <TextInput
            label="LinkedIn URL"
            value={formState.linkedinUrl}
            onChange={(value) => onFieldChange("linkedinUrl", value)}
          />
        </div>
      </div>
    </div>
  );
};

interface FormSectionProps {
  title: string;
  children: React.ReactNode;
}

const FormSection = ({ title, children }: FormSectionProps) => {
  return (
    <div>
      <h3 className="text-lg font-black">{title}</h3>
      <div className="mt-4 grid gap-5 lg:grid-cols-3">{children}</div>
    </div>
  );
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "number";
  required?: boolean;
}

const TextInput = ({
  label,
  value,
  onChange,
  type = "text",
  required = false,
}: TextInputProps) => {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-zinc-300">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  );
};

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TextAreaInput = ({ label, value, onChange }: TextAreaInputProps) => {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-zinc-300">{label}</span>
      <textarea
        value={value}
        rows={4}
        onChange={(event) => onChange(event.target.value)}
        className={inputClassName}
      />
    </label>
  );
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
