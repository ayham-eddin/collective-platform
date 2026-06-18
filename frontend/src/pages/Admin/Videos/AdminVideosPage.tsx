import { Edit, Plus, Save, Trash2, X } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getStoredAdmin } from "../../../services/auth.service";
import {
  uploadSingleImage,
  uploadSingleVideo,
} from "../../../services/uploads.service";
import {
  createAdminVideo,
  deleteAdminVideo,
  getAdminVideos,
  updateAdminVideo,
} from "../../../services/videos.service";
import type {
  MediaFile,
  VideoItem,
  VideoPayload,
  VideoStatus,
  VideoType,
} from "../../../types/video.types";
import { hasPermission } from "../../../utils/permissions";
import {
  initialVideoFormState,
  type VideoFormState,
} from "./adminVideoForm.types";
import { AdminVideoForm } from "./components/AdminVideoForm";

export const AdminVideosPage = () => {
  const admin = getStoredAdmin();

  const canCreateVideo = hasPermission(admin, "videos", "create");
  const canUpdateVideo = hasPermission(admin, "videos", "update");
  const canDeleteVideo = hasPermission(admin, "videos", "delete");

  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [formState, setFormState] = useState<VideoFormState>(
    initialVideoFormState,
  );
  const [thumbnail, setThumbnail] = useState<MediaFile | null>(null);
  const [videoFile, setVideoFile] = useState<MediaFile | null>(null);

  const [editingVideoId, setEditingVideoId] = useState<string | null>(null);
  const [editFormState, setEditFormState] = useState<VideoFormState>(
    initialVideoFormState,
  );
  const [editThumbnail, setEditThumbnail] = useState<MediaFile | null>(null);
  const [editVideoFile, setEditVideoFile] = useState<MediaFile | null>(null);

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [statusFilter, setStatusFilter] = useState<VideoStatus | "all">("all");
  const [typeFilter, setTypeFilter] = useState<VideoType | "all">("all");
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingThumbnail, setIsUploadingThumbnail] = useState(false);
  const [isUploadingVideo, setIsUploadingVideo] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [messageText, setMessageText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadVideos = async (targetPage: number) => {
    const response = await getAdminVideos({
      page: targetPage,
      limit,
      status: statusFilter,
      type: typeFilter,
      search,
    });

    setVideos(response.data);
    setTotalPages(response.pagination.totalPages || 1);
    setTotalItems(response.pagination.totalItems);
  };

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);

      try {
        await loadVideos(page);
      } catch {
        setErrorMessage("Could not load videos.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter, typeFilter, search]);

  const updateCreateField = (
    fieldName: keyof VideoFormState,
    value: string | boolean,
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const updateEditField = (
    fieldName: keyof VideoFormState,
    value: string | boolean,
  ) => {
    setEditFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const handleUploadThumbnail = async (
    event: ChangeEvent<HTMLInputElement>,
    mode: "create" | "edit",
  ) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setIsUploadingThumbnail(true);
    setErrorMessage("");

    try {
      const uploadedImage = await uploadSingleImage(imageFile);

      if (mode === "create") {
        setThumbnail(uploadedImage);
      } else {
        setEditThumbnail(uploadedImage);
      }

      setMessageText("Thumbnail uploaded successfully.");
    } catch {
      setErrorMessage("Could not upload thumbnail.");
    } finally {
      setIsUploadingThumbnail(false);
      event.target.value = "";
    }
  };

  const handleUploadVideo = async (
    event: ChangeEvent<HTMLInputElement>,
    mode: "create" | "edit",
  ) => {
    const selectedVideoFile = event.target.files?.[0];

    if (!selectedVideoFile) {
      return;
    }

    setIsUploadingVideo(true);
    setErrorMessage("");

    try {
      const uploadedVideo = await uploadSingleVideo(selectedVideoFile);

      if (mode === "create") {
        setVideoFile(uploadedVideo);
      } else {
        setEditVideoFile(uploadedVideo);
      }

      setMessageText("Video uploaded successfully.");
    } catch {
      setErrorMessage("Could not upload video.");
    } finally {
      setIsUploadingVideo(false);
      event.target.value = "";
    }
  };

  const buildPayload = (
    state: VideoFormState,
    selectedThumbnail: MediaFile | null,
    selectedVideoFile: MediaFile | null,
  ): VideoPayload => {
    return {
      title: {
        de: state.titleDe,
        en: state.titleEn,
        ar: state.titleAr,
      },
      description: {
        de: state.descriptionDe,
        en: state.descriptionEn,
        ar: state.descriptionAr,
      },
      type: state.type,
      youtubeUrl: state.type === "youtube" ? state.youtubeUrl : undefined,
      videoFile:
        state.type === "uploaded" ? selectedVideoFile || undefined : undefined,
      thumbnail: selectedThumbnail || undefined,
      isFeatured: state.isFeatured,
      status: state.status,
    };
  };

  const handleCreateVideo = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!canCreateVideo) {
      setErrorMessage("You do not have permission to create videos.");
      return;
    }

    if (formState.type === "uploaded" && !videoFile) {
      setErrorMessage("Please upload a video file first.");
      return;
    }

    setIsSaving(true);
    setMessageText("");
    setErrorMessage("");

    try {
      await createAdminVideo(buildPayload(formState, thumbnail, videoFile));

      setFormState(initialVideoFormState);
      setThumbnail(null);
      setVideoFile(null);
      setMessageText("Video created successfully.");
      setPage(1);
      await loadVideos(1);
    } catch {
      setErrorMessage("Could not create video.");
    } finally {
      setIsSaving(false);
    }
  };

  const startEditing = (video: VideoItem) => {
    setEditingVideoId(video._id);
    setEditFormState({
      titleDe: video.title.de,
      titleEn: video.title.en,
      titleAr: video.title.ar,
      descriptionDe: video.description?.de || "",
      descriptionEn: video.description?.en || "",
      descriptionAr: video.description?.ar || "",
      type: video.type,
      youtubeUrl: video.youtubeUrl || "",
      status: video.status,
      isFeatured: video.isFeatured,
    });
    setEditThumbnail(video.thumbnail || null);
    setEditVideoFile(video.videoFile || null);
    setMessageText("");
    setErrorMessage("");
  };

  const cancelEditing = () => {
    setEditingVideoId(null);
    setEditFormState(initialVideoFormState);
    setEditThumbnail(null);
    setEditVideoFile(null);
  };

  const handleSaveEdit = async (videoId: string) => {
    if (!canUpdateVideo) {
      setErrorMessage("You do not have permission to update videos.");
      return;
    }

    if (editFormState.type === "uploaded" && !editVideoFile) {
      setErrorMessage("Please upload a video file first.");
      return;
    }

    setIsSaving(true);
    setMessageText("");
    setErrorMessage("");

    try {
      const updatedVideo = await updateAdminVideo(
        videoId,
        buildPayload(editFormState, editThumbnail, editVideoFile),
      );

      setVideos((currentVideos) =>
        currentVideos.map((video) =>
          video._id === updatedVideo._id ? updatedVideo : video,
        ),
      );

      cancelEditing();
      setMessageText("Video updated successfully.");
    } catch {
      setErrorMessage("Could not update video.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteVideo = async (videoId: string) => {
    if (!canDeleteVideo) {
      setErrorMessage("You do not have permission to delete videos.");
      return;
    }

    const confirmed = window.confirm("Are you sure you want to delete video?");

    if (!confirmed) {
      return;
    }

    setMessageText("");
    setErrorMessage("");

    try {
      await deleteAdminVideo(videoId);
      setVideos((currentVideos) =>
        currentVideos.filter((video) => video._id !== videoId),
      );
      setTotalItems((currentTotal) => Math.max(currentTotal - 1, 0));
      setMessageText("Video deleted successfully.");
    } catch {
      setErrorMessage("Could not delete video.");
    }
  };

  const handleApplySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusFilterChange = (value: VideoStatus | "all") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleTypeFilterChange = (value: VideoType | "all") => {
    setTypeFilter(value);
    setPage(1);
  };

  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Videos
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">Manage Videos</h1>

      <p className="mt-4 text-zinc-400">
        Add YouTube videos, upload video files, manage thumbnails and control
        publishing status.
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

      {canCreateVideo ? (
        <form
          onSubmit={handleCreateVideo}
          className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6"
        >
          <div className="flex items-center gap-3">
            <Plus className="text-violet-300" size={24} />
            <h2 className="text-2xl font-black">Add Video</h2>
          </div>

          <AdminVideoForm
            formState={formState}
            thumbnail={thumbnail}
            videoFile={videoFile}
            isUploadingThumbnail={isUploadingThumbnail}
            isUploadingVideo={isUploadingVideo}
            onFieldChange={updateCreateField}
            onThumbnailChange={setThumbnail}
            onVideoFileChange={setVideoFile}
            onUploadThumbnail={(event) =>
              void handleUploadThumbnail(event, "create")
            }
            onUploadVideo={(event) => void handleUploadVideo(event, "create")}
          />

          <button
            type="submit"
            disabled={isSaving || isUploadingThumbnail || isUploadingVideo}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-violet-600 px-6 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Save size={18} />
            {isSaving ? "Creating..." : "Create Video"}
          </button>
        </form>
      ) : (
        <p className="mt-10 rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-4 text-sm font-bold text-yellow-300">
          You do not have permission to create videos.
        </p>
      )}

      <div className="mt-10 rounded-3xl border border-white/10 bg-white/[0.03] p-6">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black">Videos</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Total results: {totalItems}
            </p>
          </div>

          <form onSubmit={handleApplySearch} className="flex gap-3">
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search videos..."
              className={inputClassName}
            />

            <button
              type="submit"
              className="rounded-2xl bg-violet-600 px-5 py-3 text-sm font-black text-white transition hover:bg-violet-500"
            >
              Search
            </button>
          </form>
        </div>

        <div className="mt-6 grid gap-5 md:grid-cols-2">
          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-300">Status</span>
            <select
              value={statusFilter}
              onChange={(event) =>
                handleStatusFilterChange(
                  event.target.value as VideoStatus | "all",
                )
              }
              className={inputClassName}
            >
              <option value="all">All statuses</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </label>

          <label className="grid gap-2">
            <span className="text-sm font-bold text-zinc-300">Type</span>
            <select
              value={typeFilter}
              onChange={(event) =>
                handleTypeFilterChange(event.target.value as VideoType | "all")
              }
              className={inputClassName}
            >
              <option value="all">All types</option>
              <option value="youtube">YouTube</option>
              <option value="uploaded">Uploaded</option>
            </select>
          </label>
        </div>

        {isLoading && <p className="mt-8 text-zinc-400">Loading videos...</p>}

        {!isLoading && videos.length === 0 && (
          <p className="mt-8 text-zinc-400">No videos found.</p>
        )}

        {!isLoading && videos.length > 0 && (
          <div className="mt-8 grid gap-6">
            {videos.map((video) => {
              const isEditing = editingVideoId === video._id;

              return (
                <article
                  key={video._id}
                  className="rounded-3xl border border-white/10 bg-black/30 p-6"
                >
                  {isEditing ? (
                    <>
                      <AdminVideoForm
                        formState={editFormState}
                        thumbnail={editThumbnail}
                        videoFile={editVideoFile}
                        isUploadingThumbnail={isUploadingThumbnail}
                        isUploadingVideo={isUploadingVideo}
                        onFieldChange={updateEditField}
                        onThumbnailChange={setEditThumbnail}
                        onVideoFileChange={setEditVideoFile}
                        onUploadThumbnail={(event) =>
                          void handleUploadThumbnail(event, "edit")
                        }
                        onUploadVideo={(event) =>
                          void handleUploadVideo(event, "edit")
                        }
                      />

                      <div className="mt-6 flex flex-wrap gap-3">
                        <button
                          type="button"
                          onClick={() => void handleSaveEdit(video._id)}
                          disabled={
                            isSaving || isUploadingThumbnail || isUploadingVideo
                          }
                          className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-sm font-black text-white transition hover:bg-emerald-500 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          <Save size={17} />
                          {isSaving ? "Saving..." : "Save Changes"}
                        </button>

                        <button
                          type="button"
                          onClick={cancelEditing}
                          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
                        >
                          <X size={17} />
                          Cancel
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="grid gap-6 lg:grid-cols-[240px_1fr_auto]">
                      <div className="overflow-hidden rounded-3xl bg-black/40">
                        {video.thumbnail ? (
                          <img
                            src={video.thumbnail.url}
                            alt={video.title.de}
                            className="h-40 w-full object-cover"
                          />
                        ) : (
                          <div className="grid h-40 place-items-center text-sm text-zinc-500">
                            No thumbnail
                          </div>
                        )}
                      </div>

                      <div>
                        <div className="flex flex-wrap items-center gap-3">
                          <h3 className="text-2xl font-black">
                            {video.title.de}
                          </h3>

                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-zinc-300">
                            {video.status}
                          </span>

                          <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-zinc-300">
                            {video.type}
                          </span>

                          {video.isFeatured && (
                            <span className="rounded-full bg-violet-500/20 px-3 py-1 text-xs font-black uppercase text-violet-300">
                              Featured
                            </span>
                          )}
                        </div>

                        {video.description?.de && (
                          <p className="mt-4 max-w-3xl leading-7 text-zinc-400">
                            {video.description.de}
                          </p>
                        )}

                        <div className="mt-4 flex flex-wrap gap-4">
                          {video.youtubeUrl && (
                            <a
                              href={video.youtubeUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex text-sm font-bold text-violet-300 transition hover:text-violet-200"
                            >
                              Open YouTube video
                            </a>
                          )}

                          {video.videoFile?.url && (
                            <a
                              href={video.videoFile.url}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex text-sm font-bold text-violet-300 transition hover:text-violet-200"
                            >
                              Open uploaded video
                            </a>
                          )}
                        </div>
                      </div>

                      <div className="flex gap-2 lg:justify-end">
                        {canUpdateVideo ? (
                          <button
                            type="button"
                            onClick={() => startEditing(video)}
                            className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                            aria-label="Edit video"
                          >
                            <Edit size={17} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            disabled
                            className="grid h-10 w-10 cursor-not-allowed place-items-center rounded-full border border-white/10 text-zinc-600 opacity-50"
                            aria-label="Edit disabled"
                          >
                            <Edit size={17} />
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() => void handleDeleteVideo(video._id)}
                          disabled={!canDeleteVideo}
                          className="grid h-10 w-10 place-items-center rounded-full border border-white/10 text-zinc-300 transition hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:text-zinc-600 disabled:opacity-50"
                          aria-label="Delete video"
                        >
                          <Trash2 size={17} />
                        </button>
                      </div>
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        )}

        {totalPages > 1 && (
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Previous
            </button>

            <span className="text-sm font-bold text-zinc-400">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="rounded-full border border-white/10 px-5 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

const inputClassName =
  "w-full rounded-2xl border border-white/10 bg-black/30 px-4 py-4 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
