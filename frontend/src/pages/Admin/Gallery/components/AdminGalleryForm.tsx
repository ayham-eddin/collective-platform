import { Save, Upload } from "lucide-react";
import type { ChangeEvent, FormEvent } from "react";
import type { GalleryImageStatus } from "../../../../types/gallery.types";
import type { UploadedMedia } from "../../../../types/upload.types";
import type { GalleryFormState } from "../adminGalleryForm.types";

interface AdminGalleryFormProps {
  formState: GalleryFormState;
  uploadedImage: UploadedMedia | null;
  editingImageId: string | null;
  isUploading: boolean;
  isSaving: boolean;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  onFieldChange: (
    fieldName: keyof GalleryFormState,
    value: string | boolean,
  ) => void;
  onImageUpload: (event: ChangeEvent<HTMLInputElement>) => void;
  onCancelEdit: () => void;
}

export const AdminGalleryForm = ({
  formState,
  uploadedImage,
  editingImageId,
  isUploading,
  isSaving,
  onSubmit,
  onFieldChange,
  onImageUpload,
  onCancelEdit,
}: AdminGalleryFormProps) => {
  return (
    <form
      onSubmit={onSubmit}
      className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
    >
      <h2 className="text-2xl font-black">
        {editingImageId ? "Edit Image" : "Create Image"}
      </h2>

      <div className="mt-6">
        <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300">
          <Upload size={18} />
          {isUploading ? "Uploading..." : "Upload Image"}
          <input
            type="file"
            accept="image/*"
            onChange={(event) => onImageUpload(event)}
            disabled={isUploading}
            className="hidden"
          />
        </label>

        {uploadedImage && (
          <img
            src={uploadedImage.url}
            alt="Gallery preview"
            className="mt-6 h-72 w-full rounded-3xl object-cover"
          />
        )}
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <TextInput
          label="Title DE"
          value={formState.titleDe}
          onChange={(value) => onFieldChange("titleDe", value)}
        />
        <TextInput
          label="Title EN"
          value={formState.titleEn}
          onChange={(value) => onFieldChange("titleEn", value)}
        />
        <TextInput
          label="Title AR"
          value={formState.titleAr}
          onChange={(value) => onFieldChange("titleAr", value)}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        <TextAreaInput
          label="Description DE"
          value={formState.descriptionDe}
          onChange={(value) => onFieldChange("descriptionDe", value)}
        />
        <TextAreaInput
          label="Description EN"
          value={formState.descriptionEn}
          onChange={(value) => onFieldChange("descriptionEn", value)}
        />
        <TextAreaInput
          label="Description AR"
          value={formState.descriptionAr}
          onChange={(value) => onFieldChange("descriptionAr", value)}
        />
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-300">Status</span>
          <select
            value={formState.status}
            onChange={(event) =>
              onFieldChange("status", event.target.value as GalleryImageStatus)
            }
            className={inputClassName}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

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
            Featured image
          </span>
        </label>
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {isSaving
            ? "Saving..."
            : editingImageId
              ? "Save Changes"
              : "Create Image"}
        </button>

        {editingImageId && (
          <button
            type="button"
            onClick={onCancelEdit}
            className="rounded-full border border-white/10 px-7 py-4 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
          >
            Cancel
          </button>
        )}
      </div>
    </form>
  );
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
}

const TextInput = ({ label, value, onChange }: TextInputProps) => {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-zinc-300">{label}</span>
      <input
        type="text"
        value={value}
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
        onChange={(event) => onChange(event.target.value)}
        rows={4}
        className={inputClassName}
      />
    </label>
  );
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
