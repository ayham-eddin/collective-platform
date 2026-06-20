import { Upload } from "lucide-react";
import type { ChangeEvent } from "react";
import type {
  MediaFile,
  VideoStatus,
  VideoType,
} from "../../../../types/video.types";
import type { VideoFormState } from "../adminVideoForm.types";

interface AdminVideoFormProps {
  formState: VideoFormState;
  thumbnail: MediaFile | null;
  videoFile: MediaFile | null;
  isUploadingThumbnail: boolean;
  isUploadingVideo: boolean;
  onFieldChange: (
    fieldName: keyof VideoFormState,
    value: string | boolean,
  ) => void;
  onThumbnailChange: (thumbnail: MediaFile | null) => void;
  onVideoFileChange: (videoFile: MediaFile | null) => void;
  onUploadThumbnail: (event: ChangeEvent<HTMLInputElement>) => void;
  onUploadVideo: (event: ChangeEvent<HTMLInputElement>) => void;
}

export const AdminVideoForm = ({
  formState,
  thumbnail,
  videoFile,
  isUploadingThumbnail,
  isUploadingVideo,
  onFieldChange,
  onThumbnailChange,
  onVideoFileChange,
  onUploadThumbnail,
  onUploadVideo,
}: AdminVideoFormProps) => {
  return (
    <div className="mt-6 grid gap-8">
      <div className="grid gap-5 lg:grid-cols-3">
        <TextInput
          label="Title DE"
          value={formState.titleDe}
          onChange={(value) => onFieldChange("titleDe", value)}
          required
        />
        <TextInput
          label="Title EN"
          value={formState.titleEn}
          onChange={(value) => onFieldChange("titleEn", value)}
          required
        />
        <TextInput
          label="Title AR"
          value={formState.titleAr}
          onChange={(value) => onFieldChange("titleAr", value)}
          required
        />
      </div>

      <div className="grid gap-5 lg:grid-cols-3">
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

      <div className="grid gap-5 lg:grid-cols-3">
        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-300">Type</span>
          <select
            value={formState.type}
            onChange={(event) =>
              onFieldChange("type", event.target.value as VideoType)
            }
            className={inputClassName}
          >
            <option value="youtube">YouTube</option>
            <option value="uploaded">Uploaded video</option>
          </select>
        </label>

        <label className="grid gap-2">
          <span className="text-sm font-bold text-zinc-300">Status</span>
          <select
            value={formState.status}
            onChange={(event) =>
              onFieldChange("status", event.target.value as VideoStatus)
            }
            className={inputClassName}
          >
            <option value="draft">Draft</option>
            <option value="published">Published</option>
            <option value="archived">Archived</option>
          </select>
        </label>

        <label className="flex min-h-[58px] items-center gap-3 rounded-2xl border border-white/10 bg-black/30 px-4 py-4">
          <input
            type="checkbox"
            checked={formState.isFeatured}
            onChange={(event) =>
              onFieldChange("isFeatured", event.target.checked)
            }
            className="h-5 w-5"
          />
          <span className="text-sm font-bold text-zinc-300">
            Featured video
          </span>
        </label>
      </div>

      {formState.type === "youtube" && (
        <TextInput
          label="YouTube URL"
          value={formState.youtubeUrl}
          onChange={(value) => onFieldChange("youtubeUrl", value)}
          required
        />
      )}

      {formState.type === "uploaded" && (
        <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
          <p className="text-sm font-bold text-zinc-300">Video File</p>

          <div className="mt-4 flex flex-wrap items-center gap-4">
            {videoFile && (
              <a
                href={videoFile.url}
                target="_blank"
                rel="noreferrer"
                className="btn btn-secondary-dark btn-sm"
              >
                Open uploaded video
              </a>
            )}

            <label className="btn btn-secondary-dark btn-sm cursor-pointer">
              <Upload size={17} />
              {isUploadingVideo ? "Uploading video..." : "Upload Video"}
              <input
                type="file"
                accept="video/*"
                onChange={onUploadVideo}
                disabled={isUploadingVideo}
                className="hidden"
              />
            </label>

            {videoFile && (
              <button
                type="button"
                onClick={() => onVideoFileChange(null)}
                className="btn btn-secondary-dark btn-sm hover:border-red-400 hover:text-red-300"
              >
                Remove Video
              </button>
            )}
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-white/10 bg-black/20 p-5">
        <p className="text-sm font-bold text-zinc-300">Thumbnail</p>

        <div className="mt-4 flex flex-wrap items-center gap-4">
          {thumbnail && (
            <img
              src={thumbnail.url}
              alt="Video thumbnail"
              className="h-28 w-44 rounded-2xl object-cover"
            />
          )}

          <label className="btn btn-secondary-dark btn-sm cursor-pointer">
            <Upload size={17} />
            {isUploadingThumbnail ? "Uploading..." : "Upload Thumbnail"}
            <input
              type="file"
              accept="image/*"
              onChange={onUploadThumbnail}
              disabled={isUploadingThumbnail}
              className="hidden"
            />
          </label>

          {thumbnail && (
            <button
              type="button"
              onClick={() => onThumbnailChange(null)}
              className="btn btn-secondary-dark btn-sm hover:border-red-400 hover:text-red-300"
            >
              Remove Thumbnail
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const TextInput = ({
  label,
  value,
  onChange,
  required = false,
}: TextInputProps) => {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-zinc-300">{label}</span>
      <input
        type="text"
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
