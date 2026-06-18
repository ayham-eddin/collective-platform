import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { getStoredAdmin } from "../../../services/auth.service";
import {
  createAdminGalleryImage,
  deleteAdminGalleryImage,
  getAdminGalleryImages,
  reorderAdminGalleryImages,
  updateAdminGalleryImage,
} from "../../../services/gallery.service";
import { uploadSingleImage } from "../../../services/uploads.service";
import type {
  GalleryImageItem,
  GalleryImageStatus,
} from "../../../types/gallery.types";
import type { UploadedMedia } from "../../../types/upload.types";
import { hasPermission } from "../../../utils/permissions";

type GalleryFormState = {
  titleDe: string;
  titleEn: string;
  titleAr: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionAr: string;
  status: GalleryImageStatus;
  isFeatured: boolean;
};

const initialFormState: GalleryFormState = {
  titleDe: "",
  titleEn: "",
  titleAr: "",
  descriptionDe: "",
  descriptionEn: "",
  descriptionAr: "",
  status: "published",
  isFeatured: false,
};

export const AdminGalleryPage = () => {
  const admin = getStoredAdmin();

  const canCreateGallery = hasPermission(admin, "gallery", "create");
  const canUpdateGallery = hasPermission(admin, "gallery", "update");
  const canDeleteGallery = hasPermission(admin, "gallery", "delete");

  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [formState, setFormState] =
    useState<GalleryFormState>(initialFormState);
  const [uploadedImage, setUploadedImage] = useState<UploadedMedia | null>(
    null,
  );
  const [editingImageId, setEditingImageId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(12);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [statusFilter, setStatusFilter] = useState<GalleryImageStatus | "all">(
    "all",
  );
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const loadImages = async (targetPage: number) => {
    const response = await getAdminGalleryImages({
      page: targetPage,
      limit,
      status: statusFilter,
      search,
    });

    setImages(response.data);
    setTotalPages(response.pagination.totalPages || 1);
    setTotalItems(response.pagination.totalItems);
  };

  useEffect(() => {
    const run = async () => {
      setIsLoading(true);

      try {
        await loadImages(page);
      } catch {
        setErrorMessage("Could not load gallery images.");
      } finally {
        setIsLoading(false);
      }
    };

    void run();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, limit, statusFilter, search]);

  const updateField = (
    fieldName: keyof GalleryFormState,
    value: string | boolean,
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const resetForm = () => {
    setFormState(initialFormState);
    setUploadedImage(null);
    setEditingImageId(null);
    setMessage("");
    setErrorMessage("");
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    if (!canCreateGallery && !canUpdateGallery) {
      setErrorMessage("You do not have permission to upload gallery images.");
      return;
    }

    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const uploaded = await uploadSingleImage(imageFile);
      setUploadedImage(uploaded);
      setMessage("Image uploaded successfully.");
    } catch {
      setErrorMessage("Could not upload image.");
    } finally {
      setIsUploading(false);
      event.target.value = "";
    }
  };

  const handleEditImage = (image: GalleryImageItem) => {
    if (!canUpdateGallery) {
      setErrorMessage("You do not have permission to update gallery images.");
      return;
    }

    setEditingImageId(image._id);
    setUploadedImage(image.image);
    setFormState({
      titleDe: image.title.de,
      titleEn: image.title.en,
      titleAr: image.title.ar,
      descriptionDe: image.description?.de || "",
      descriptionEn: image.description?.en || "",
      descriptionAr: image.description?.ar || "",
      status: image.status,
      isFeatured: image.isFeatured,
    });
    setMessage("");
    setErrorMessage("");
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (editingImageId && !canUpdateGallery) {
      setErrorMessage("You do not have permission to update gallery images.");
      return;
    }

    if (!editingImageId && !canCreateGallery) {
      setErrorMessage("You do not have permission to create gallery images.");
      return;
    }

    if (!uploadedImage) {
      setErrorMessage("Please upload an image first.");
      return;
    }

    setIsSaving(true);
    setErrorMessage("");
    setMessage("");

    try {
      if (editingImageId) {
        const updatedImage = await updateAdminGalleryImage(editingImageId, {
          title: {
            de: formState.titleDe,
            en: formState.titleEn,
            ar: formState.titleAr,
          },
          description: {
            de: formState.descriptionDe,
            en: formState.descriptionEn,
            ar: formState.descriptionAr,
          },
          image: uploadedImage,
          status: formState.status,
          isFeatured: formState.isFeatured,
        });

        setImages((currentImages) =>
          currentImages.map((image) =>
            image._id === updatedImage._id ? updatedImage : image,
          ),
        );

        setMessage("Gallery image updated successfully.");
      } else {
        await createAdminGalleryImage({
          title: {
            de: formState.titleDe,
            en: formState.titleEn,
            ar: formState.titleAr,
          },
          description: {
            de: formState.descriptionDe,
            en: formState.descriptionEn,
            ar: formState.descriptionAr,
          },
          image: uploadedImage,
          status: formState.status,
          isFeatured: formState.isFeatured,
        });

        setPage(1);
        await loadImages(1);
        setMessage("Gallery image created successfully.");
      }

      resetForm();
    } catch {
      setErrorMessage("Could not save gallery image.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteImage = async (imageId: string) => {
    if (!canDeleteGallery) {
      setErrorMessage("You do not have permission to delete gallery images.");
      return;
    }

    const confirmed = window.confirm(
      "Are you sure you want to delete this gallery image?",
    );

    if (!confirmed) {
      return;
    }

    setErrorMessage("");
    setMessage("");

    try {
      await deleteAdminGalleryImage(imageId);
      await loadImages(page);
      setMessage("Gallery image deleted successfully.");
    } catch {
      setErrorMessage("Could not delete gallery image.");
    }
  };

  const handleMoveImage = async (imageId: string, direction: "up" | "down") => {
    if (!canUpdateGallery) {
      setErrorMessage("You do not have permission to reorder gallery images.");
      return;
    }

    const currentIndex = images.findIndex((image) => image._id === imageId);
    const targetIndex =
      direction === "up" ? currentIndex - 1 : currentIndex + 1;

    if (currentIndex < 0 || targetIndex < 0 || targetIndex >= images.length) {
      return;
    }

    const reorderedImages = [...images];
    const currentImage = reorderedImages[currentIndex];
    const targetImage = reorderedImages[targetIndex];

    reorderedImages[currentIndex] = targetImage;
    reorderedImages[targetIndex] = currentImage;

    const pageOffset = (page - 1) * limit;

    const items = reorderedImages.map((image, index) => ({
      id: image._id,
      sortOrder: pageOffset + index + 1,
    }));

    setImages(
      reorderedImages.map((image, index) => ({
        ...image,
        sortOrder: pageOffset + index + 1,
      })),
    );

    try {
      await reorderAdminGalleryImages(items);
      await loadImages(page);
      setMessage("Gallery order updated.");
    } catch {
      setErrorMessage("Could not update gallery order.");
    }
  };

  const handleApplySearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setPage(1);
    setSearch(searchInput);
  };

  const handleStatusFilterChange = (value: GalleryImageStatus | "all") => {
    setStatusFilter(value);
    setPage(1);
  };

  const handleLimitChange = (value: number) => {
    setLimit(value);
    setPage(1);
  };

  return (
    <section>
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Gallery
          </p>

          <h1 className="mt-4 text-4xl font-black tracking-tight">
            Manage Gallery
          </h1>

          <p className="mt-4 text-zinc-400">
            Upload, edit, delete, filter and reorder gallery images from here.
          </p>
        </div>

        {canCreateGallery && (
          <button
            type="button"
            onClick={resetForm}
            className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300"
          >
            <ImagePlus size={18} />
            New Image
          </button>
        )}
      </div>

      <p className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm font-bold text-violet-200">
        Hint: max image size is 10MB. Recommended width: 1600–2000px.
      </p>

      {message && (
        <p className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-300">
          {message}
        </p>
      )}

      {errorMessage && (
        <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-300">
          {errorMessage}
        </p>
      )}

      {(canCreateGallery || (editingImageId && canUpdateGallery)) && (
        <form
          onSubmit={handleSubmit}
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
                onChange={(event) => void handleImageUpload(event)}
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

          <div className="mt-6 grid gap-5 lg:grid-cols-2">
            <label className="grid gap-2">
              <span className="text-sm font-bold text-zinc-300">Status</span>
              <select
                value={formState.status}
                onChange={(event) =>
                  updateField(
                    "status",
                    event.target.value as GalleryImageStatus,
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
                onClick={resetForm}
                className="rounded-full border border-white/10 px-7 py-4 text-sm font-bold text-zinc-300 transition hover:border-zinc-400 hover:text-white"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}

      <section className="mt-12">
        <div className="flex flex-wrap items-end justify-between gap-5">
          <div>
            <h2 className="text-2xl font-black">Gallery Images</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Total results: {totalItems}
            </p>
          </div>

          <form onSubmit={handleApplySearch} className="flex gap-3">
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search images..."
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
                  event.target.value as GalleryImageStatus | "all",
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
            <span className="text-sm font-bold text-zinc-300">Per page</span>
            <select
              value={limit}
              onChange={(event) =>
                handleLimitChange(Number(event.target.value))
              }
              className={inputClassName}
            >
              <option value={6}>6 images</option>
              <option value={12}>12 images</option>
              <option value={24}>24 images</option>
            </select>
          </label>
        </div>

        {isLoading && <p className="mt-6 text-zinc-400">Loading images...</p>}

        {!isLoading && images.length === 0 && (
          <p className="mt-6 text-zinc-400">No gallery images found.</p>
        )}

        <div className="mt-6 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <article
              key={image._id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-white/[0.03]"
            >
              <img
                src={image.image.url}
                alt={image.title.de}
                className="h-64 w-full object-cover"
              />

              <div className="p-5">
                <div className="mb-4 flex items-center justify-between gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-zinc-300">
                    {image.status}
                  </span>

                  <span className="text-xs font-bold text-zinc-500">
                    Order: {image.sortOrder || (page - 1) * limit + index + 1}
                  </span>
                </div>

                <h3 className="text-xl font-black">{image.title.de}</h3>

                {image.description?.de && (
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-400">
                    {image.description.de}
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => void handleMoveImage(image._id, "up")}
                    disabled={!canUpdateGallery || index === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowUp size={16} />
                    Up
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleMoveImage(image._id, "down")}
                    disabled={!canUpdateGallery || index === images.length - 1}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowDown size={16} />
                    Down
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditImage(image)}
                    disabled={!canUpdateGallery}
                    className="rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDeleteImage(image._id)}
                    disabled={!canDeleteGallery}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-400 hover:text-red-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>

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
      </section>
    </section>
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
