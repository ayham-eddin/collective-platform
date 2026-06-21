import { Plus, Save, Trash2, Upload } from "lucide-react";
import {
  useState,
  type ChangeEvent,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useNavigate } from "react-router-dom";
import { createAdminEvent } from "../../../services/events.service";
import { uploadSingleImage } from "../../../services/uploads.service";
import type { EventItem, EventVideo } from "../../../types/event.types";
import type { UploadedMedia } from "../../../types/upload.types";

type EventFormState = {
  titleDe: string;
  titleEn: string;
  titleAr: string;
  shortDescriptionDe: string;
  shortDescriptionEn: string;
  shortDescriptionAr: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionAr: string;
  eventDate: string;
  startTime: string;
  endTime: string;
  locationDe: string;
  locationEn: string;
  locationAr: string;
  category: string;
  ticketUrl: string;
  googleMapsUrl: string;
  status: EventItem["status"];
  isFeatured: boolean;
};

type VideoFieldName =
  | "youtubeUrl"
  | "titleDe"
  | "titleEn"
  | "titleAr"
  | "descriptionDe"
  | "descriptionEn"
  | "descriptionAr";

const eventCategories = [
  "Festival",
  "Konzert",
  "Party",
  "Comedy Show",
  "Kultur",
  "Workshop",
  "Community",
  "Other",
];

const initialFormState: EventFormState = {
  titleDe: "",
  titleEn: "",
  titleAr: "",
  shortDescriptionDe: "",
  shortDescriptionEn: "",
  shortDescriptionAr: "",
  descriptionDe: "",
  descriptionEn: "",
  descriptionAr: "",
  eventDate: "",
  startTime: "",
  endTime: "",
  locationDe: "",
  locationEn: "",
  locationAr: "",
  category: "Festival",
  ticketUrl: "",
  googleMapsUrl: "",
  status: "draft",
  isFeatured: false,
};

const createEmptyVideo = (): EventVideo => ({
  youtubeUrl: "",
  title: { de: "", en: "", ar: "" },
  description: { de: "", en: "", ar: "" },
});

const createSlug = (value: string) => {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9äöüß]+/gi, "-")
    .replace(/^-+|-+$/g, "");
};

const normalizeYoutubeUrl = (value: string) => {
  const trimmedUrl = value.trim();

  if (!trimmedUrl) {
    return "";
  }

  try {
    const url = new URL(trimmedUrl);

    if (url.hostname.includes("youtu.be")) {
      const videoId = url.pathname.replace("/", "");

      if (!videoId) {
        return "";
      }

      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    if (url.hostname.includes("youtube.com")) {
      const videoId = url.searchParams.get("v");

      if (!videoId) {
        return "";
      }

      return `https://www.youtube.com/watch?v=${videoId}`;
    }

    return "";
  } catch {
    return "";
  }
};

export const AdminCreateEventPage = () => {
  const navigate = useNavigate();

  const [formState, setFormState] = useState<EventFormState>(initialFormState);
  const [coverImage, setCoverImage] = useState<UploadedMedia | null>(null);
  const [lineup, setLineup] = useState<string[]>([]);
  const [newArtist, setNewArtist] = useState("");
  const [videos, setVideos] = useState<EventVideo[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingCover, setIsUploadingCover] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (
    fieldName: keyof EventFormState,
    value: string | boolean,
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const handleCoverUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setIsUploadingCover(true);
    setErrorMessage("");

    try {
      const uploadedImage = await uploadSingleImage(imageFile);
      setCoverImage(uploadedImage);
    } catch {
      setErrorMessage("Could not upload cover image.");
    } finally {
      setIsUploadingCover(false);
      event.target.value = "";
    }
  };

  const handleAddArtist = () => {
    const trimmedArtist = newArtist.trim();

    if (!trimmedArtist) {
      return;
    }

    setLineup((currentLineup) => [...currentLineup, trimmedArtist]);
    setNewArtist("");
  };

  const handleRemoveArtist = (artistIndex: number) => {
    setLineup((currentLineup) =>
      currentLineup.filter((_, index) => index !== artistIndex),
    );
  };

  const handleAddVideo = () => {
    setVideos((currentVideos) => [...currentVideos, createEmptyVideo()]);
  };

  const handleRemoveVideo = (videoIndex: number) => {
    setVideos((currentVideos) =>
      currentVideos.filter((_, index) => index !== videoIndex),
    );
  };

  const updateVideoField = (
    videoIndex: number,
    fieldName: VideoFieldName,
    value: string,
  ) => {
    setVideos((currentVideos): EventVideo[] =>
      currentVideos.map((video, index): EventVideo => {
        if (index !== videoIndex) {
          return video;
        }

        const nextVideo: EventVideo = {
          youtubeUrl: video.youtubeUrl,
          title: {
            de: video.title.de,
            en: video.title.en,
            ar: video.title.ar,
          },
          description: {
            de: video.description?.de || "",
            en: video.description?.en || "",
            ar: video.description?.ar || "",
          },
        };

        if (fieldName === "youtubeUrl") nextVideo.youtubeUrl = value;
        if (fieldName === "titleDe") nextVideo.title.de = value;
        if (fieldName === "titleEn") nextVideo.title.en = value;
        if (fieldName === "titleAr") nextVideo.title.ar = value;
        if (fieldName === "descriptionDe" && nextVideo.description)
          nextVideo.description.de = value;
        if (fieldName === "descriptionEn" && nextVideo.description)
          nextVideo.description.en = value;
        if (fieldName === "descriptionAr" && nextVideo.description)
          nextVideo.description.ar = value;

        return nextVideo;
      }),
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage("");

    try {
      const slug = createSlug(formState.titleEn || formState.titleDe);

      const hasInvalidYoutubeUrl = videos.some(
        (video) =>
          video.youtubeUrl.trim() !== "" &&
          normalizeYoutubeUrl(video.youtubeUrl) === "",
      );

      if (hasInvalidYoutubeUrl) {
        setErrorMessage("Please enter a valid YouTube URL.");
        setIsSaving(false);
        return;
      }

      await createAdminEvent({
        title: {
          de: formState.titleDe,
          en: formState.titleEn,
          ar: formState.titleAr,
        },
        slug,
        shortDescription: {
          de: formState.shortDescriptionDe,
          en: formState.shortDescriptionEn,
          ar: formState.shortDescriptionAr,
        },
        description: {
          de: formState.descriptionDe,
          en: formState.descriptionEn,
          ar: formState.descriptionAr,
        },
        coverImage: coverImage
          ? {
              ...coverImage,
              alt: {
                de: formState.titleDe,
                en: formState.titleEn,
                ar: formState.titleAr,
              },
            }
          : undefined,
        galleryImages: [],
        videos: videos
          .filter((video) => video.youtubeUrl.trim() !== "")
          .map((video) => ({
            youtubeUrl: normalizeYoutubeUrl(video.youtubeUrl),
            title: {
              de: video.title.de || "Video",
              en: video.title.en || "Video",
              ar: video.title.ar || "فيديو",
            },
            description: {
              de: video.description?.de || "",
              en: video.description?.en || "",
              ar: video.description?.ar || "",
            },
          })),
        eventDate: formState.eventDate,
        startTime: formState.startTime,
        endTime: formState.endTime,
        location: {
          de: formState.locationDe,
          en: formState.locationEn,
          ar: formState.locationAr,
        },
        googleMapsUrl: formState.googleMapsUrl,
        ticketUrl: formState.ticketUrl,
        lineup,
        category: formState.category,
        status: formState.status,
        isFeatured: formState.isFeatured,
      });

      navigate("/admin/events");
    } catch {
      setErrorMessage("Could not create event.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Events
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Create Event
          </h1>

          <p className="mt-4 text-zinc-400">
            Add a new event with cover image, details, lineup and videos.
          </p>
        </div>

        <Link
          to="/admin/events"
          className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
        >
          Back to Events
        </Link>
      </div>

      {errorMessage && (
        <p className="mt-8 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          {errorMessage}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-10 grid gap-8">
        <FormCard title="Cover Image">
          <p className="mb-5 text-sm text-zinc-500">
            Max image size: 10MB. Recommended width: 1600–2000px.
          </p>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300">
            <Upload size={18} />
            {isUploadingCover ? "Uploading..." : "Upload Cover"}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void handleCoverUpload(event)}
              className="hidden"
            />
          </label>

          {coverImage && (
            <img
              src={coverImage.url}
              alt="Cover preview"
              className="mt-6 h-72 w-full rounded-3xl object-cover"
            />
          )}
        </FormCard>

        <FormCard title="Title">
          <div className="grid gap-5 lg:grid-cols-3">
            <TextInput
              label="Title DE"
              value={formState.titleDe}
              onChange={(value) => updateField("titleDe", value)}
            />
            <TextInput
              label="Title EN"
              value={formState.titleEn}
              onChange={(value) => updateField("titleEn", value)}
            />
            <TextInput
              label="Title AR"
              value={formState.titleAr}
              onChange={(value) => updateField("titleAr", value)}
            />
          </div>
        </FormCard>

        <FormCard title="Descriptions">
          <div className="grid gap-5 lg:grid-cols-3">
            <TextAreaInput
              label="Short Description DE"
              value={formState.shortDescriptionDe}
              onChange={(value) => updateField("shortDescriptionDe", value)}
            />
            <TextAreaInput
              label="Short Description EN"
              value={formState.shortDescriptionEn}
              onChange={(value) => updateField("shortDescriptionEn", value)}
            />
            <TextAreaInput
              label="Short Description AR"
              value={formState.shortDescriptionAr}
              onChange={(value) => updateField("shortDescriptionAr", value)}
            />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <TextAreaInput
              label="Description DE"
              value={formState.descriptionDe}
              onChange={(value) => updateField("descriptionDe", value)}
            />
            <TextAreaInput
              label="Description EN"
              value={formState.descriptionEn}
              onChange={(value) => updateField("descriptionEn", value)}
            />
            <TextAreaInput
              label="Description AR"
              value={formState.descriptionAr}
              onChange={(value) => updateField("descriptionAr", value)}
            />
          </div>
        </FormCard>

        <FormCard title="Event Details">
          <div className="grid gap-5 lg:grid-cols-3">
            <TextInput
              label="Date"
              type="date"
              value={formState.eventDate}
              onChange={(value) => updateField("eventDate", value)}
            />
            <TextInput
              label="Start Time"
              type="time"
              value={formState.startTime}
              onChange={(value) => updateField("startTime", value)}
            />
            <TextInput
              label="End Time"
              type="time"
              value={formState.endTime}
              onChange={(value) => updateField("endTime", value)}
            />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <TextInput
              label="Location DE"
              value={formState.locationDe}
              onChange={(value) => updateField("locationDe", value)}
            />
            <TextInput
              label="Location EN"
              value={formState.locationEn}
              onChange={(value) => updateField("locationEn", value)}
            />
            <TextInput
              label="Location AR"
              value={formState.locationAr}
              onChange={(value) => updateField("locationAr", value)}
            />
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-3">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-300">Category</span>
              <select
                value={formState.category}
                onChange={(event) =>
                  updateField("category", event.target.value)
                }
                className={inputClassName}
              >
                {eventCategories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </label>

            <TextInput
              label="Ticket URL"
              value={formState.ticketUrl}
              onChange={(value) => updateField("ticketUrl", value)}
            />
            <TextInput
              label="Google Maps URL"
              value={formState.googleMapsUrl}
              onChange={(value) => updateField("googleMapsUrl", value)}
            />
          </div>
        </FormCard>

        <FormCard title="Lineup">
          <p className="text-sm text-zinc-500">
            Leave empty if this event should not show a lineup section.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            {lineup.map((artist, index) => (
              <button
                key={`${artist}-${index}`}
                type="button"
                onClick={() => handleRemoveArtist(index)}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-4 py-2 text-sm font-bold text-zinc-200 transition hover:border-red-400 hover:text-red-300"
              >
                {artist}
                <Trash2 size={14} />
              </button>
            ))}
          </div>

          <div className="mt-6 flex gap-3">
            <input
              type="text"
              value={newArtist}
              onChange={(event) => setNewArtist(event.target.value)}
              placeholder="Artist name"
              className={inputClassName}
            />

            <button
              type="button"
              onClick={handleAddArtist}
              className="inline-flex items-center gap-2 rounded-full bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-500"
            >
              <Plus size={18} />
              Add
            </button>
          </div>
        </FormCard>

        <FormCard title="Event Videos">
          <div className="grid gap-6">
            {videos.map((video, index) => (
              <div
                key={index}
                className="rounded-3xl border border-white/10 bg-black/30 p-5"
              >
                <div className="flex justify-between gap-4">
                  <h3 className="font-black">Video {index + 1}</h3>

                  <button
                    type="button"
                    onClick={() => handleRemoveVideo(index)}
                    className="text-red-300 transition hover:text-red-200"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>

                <div className="mt-5 grid gap-5">
                  <TextInput
                    label="YouTube URL"
                    value={video.youtubeUrl}
                    onChange={(value) =>
                      updateVideoField(index, "youtubeUrl", value)
                    }
                  />

                  <div className="grid gap-5 lg:grid-cols-3">
                    <TextInput
                      label="Video Title DE"
                      value={video.title.de}
                      onChange={(value) =>
                        updateVideoField(index, "titleDe", value)
                      }
                    />
                    <TextInput
                      label="Video Title EN"
                      value={video.title.en}
                      onChange={(value) =>
                        updateVideoField(index, "titleEn", value)
                      }
                    />
                    <TextInput
                      label="Video Title AR"
                      value={video.title.ar}
                      onChange={(value) =>
                        updateVideoField(index, "titleAr", value)
                      }
                    />
                  </div>

                  <div className="grid gap-5 lg:grid-cols-3">
                    <TextAreaInput
                      label="Video Description DE"
                      value={video.description?.de || ""}
                      onChange={(value) =>
                        updateVideoField(index, "descriptionDe", value)
                      }
                    />
                    <TextAreaInput
                      label="Video Description EN"
                      value={video.description?.en || ""}
                      onChange={(value) =>
                        updateVideoField(index, "descriptionEn", value)
                      }
                    />
                    <TextAreaInput
                      label="Video Description AR"
                      value={video.description?.ar || ""}
                      onChange={(value) =>
                        updateVideoField(index, "descriptionAr", value)
                      }
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={handleAddVideo}
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300"
          >
            <Plus size={18} />
            Add YouTube Video
          </button>
        </FormCard>

        <FormCard title="Publishing">
          <div className="grid gap-5 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-300">Status</span>
              <select
                value={formState.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as EventItem["status"],
                  )
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
                  updateField("isFeatured", event.target.checked)
                }
                className="h-5 w-5"
              />
              <span className="text-sm font-bold text-zinc-300">
                Featured event
              </span>
            </label>
          </div>
        </FormCard>

        <button
          type="submit"
          disabled={isSaving || isUploadingCover}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-600 px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {isSaving ? "Creating..." : "Create Event"}
        </button>
      </form>
    </section>
  );
};

interface FormCardProps {
  title: string;
  children: ReactNode;
}

const FormCard = ({ title, children }: FormCardProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-6">{children}</div>
    </div>
  );
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "date" | "time";
}

const TextInput = ({
  label,
  value,
  onChange,
  type = "text",
}: TextInputProps) => {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-bold text-zinc-300">{label}</span>
      <input
        type={type}
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
