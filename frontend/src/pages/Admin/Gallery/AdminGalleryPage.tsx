import { ArrowDown, ArrowUp, ImagePlus, Trash2 } from "lucide-react";
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
import {
  initialGalleryFormState,
  type GalleryFormState,
} from "./adminGalleryForm.types";
import { AdminGalleryForm } from "./components/AdminGalleryForm";

export const AdminGalleryPage = () => {
  const admin = getStoredAdmin();

  const canCreateGallery = hasPermission(admin, "gallery", "create");
  const canUpdateGallery = hasPermission(admin, "gallery", "update");
  const canDeleteGallery = hasPermission(admin, "gallery", "delete");

  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [formState, setFormState] = useState<GalleryFormState>(
    initialGalleryFormState,
  );
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
      setErrorMessage("");

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
    setFormState(initialGalleryFormState);
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
      <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
            Gallery
          </p>

          <h1 className="mt-4 break-words text-4xl font-black tracking-tight">
            Manage Gallery
          </h1>

          <p className="mt-4 max-w-3xl text-zinc-400">
            Upload, edit, delete, filter and reorder gallery images from here.
          </p>
        </div>

        {canCreateGallery && (
          <button
            type="button"
            onClick={resetForm}
            className="btn btn-secondary-dark"
          >
            <ImagePlus size={18} />
            New Image
          </button>
        )}
      </div>

      <p className="mt-6 rounded-2xl border border-violet-400/20 bg-violet-500/10 p-4 text-sm font-bold leading-6 text-violet-200">
        Hint: max image size is 10MB. Recommended upload size: 1600–2000px wide.
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
        <AdminGalleryForm
          formState={formState}
          uploadedImage={uploadedImage}
          editingImageId={editingImageId}
          isUploading={isUploading}
          isSaving={isSaving}
          onSubmit={handleSubmit}
          onFieldChange={updateField}
          onImageUpload={handleImageUpload}
          onCancelEdit={resetForm}
        />
      )}

      <section className="mt-12 rounded-3xl border border-white/10 bg-white/[0.03] p-5 sm:p-6">
        <div className="grid gap-5 lg:grid-cols-[1fr_auto] lg:items-end">
          <div>
            <h2 className="text-2xl font-black">Gallery Images</h2>
            <p className="mt-2 text-sm text-zinc-500">
              Total results: {totalItems}
            </p>
          </div>

          <form onSubmit={handleApplySearch} className="grid gap-3 sm:flex">
            <input
              type="search"
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search images..."
              className={inputClassName}
            />

            <button type="submit" className="btn btn-primary">
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

        {isLoading && <p className="mt-8 text-zinc-400">Loading images...</p>}

        {!isLoading && images.length === 0 && (
          <p className="mt-8 text-zinc-400">No gallery images found.</p>
        )}

        <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {images.map((image, index) => (
            <article
              key={image._id}
              className="overflow-hidden rounded-3xl border border-white/10 bg-black/30"
            >
              <img
                src={image.image.url}
                alt={image.title.de}
                className="h-56 w-full object-cover sm:h-64"
              />

              <div className="p-5">
                <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                  <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-black uppercase text-zinc-300">
                    {image.status}
                  </span>

                  <span className="text-xs font-bold text-zinc-500">
                    Order: {image.sortOrder || (page - 1) * limit + index + 1}
                  </span>
                </div>

                <h3 className="break-words text-xl font-black">
                  {image.title.de}
                </h3>

                {image.description?.de && (
                  <p className="mt-2 line-clamp-2 break-words text-sm leading-6 text-zinc-400">
                    {image.description.de}
                  </p>
                )}

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => void handleMoveImage(image._id, "up")}
                    disabled={!canUpdateGallery || index === 0}
                    className="btn btn-secondary-dark btn-sm"
                  >
                    <ArrowUp size={16} />
                    Up
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleMoveImage(image._id, "down")}
                    disabled={!canUpdateGallery || index === images.length - 1}
                    className="btn btn-secondary-dark btn-sm"
                  >
                    <ArrowDown size={16} />
                    Down
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditImage(image)}
                    disabled={!canUpdateGallery}
                    className="btn btn-secondary-dark btn-sm"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDeleteImage(image._id)}
                    disabled={!canDeleteGallery}
                    className="btn btn-danger btn-sm"
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
          <div className="mt-8 grid gap-3 sm:flex sm:flex-wrap sm:items-center sm:justify-center">
            <button
              type="button"
              disabled={page === 1}
              onClick={() => setPage((currentPage) => currentPage - 1)}
              className="btn btn-secondary-dark btn-sm"
            >
              Previous
            </button>

            <span className="inline-flex min-h-10 items-center justify-center rounded-full bg-white/5 px-5 py-2 text-sm font-bold text-zinc-400">
              Page {page} of {totalPages}
            </span>

            <button
              type="button"
              disabled={page === totalPages}
              onClick={() => setPage((currentPage) => currentPage + 1)}
              className="btn btn-secondary-dark btn-sm"
            >
              Next
            </button>
          </div>
        )}
      </section>
    </section>
  );
};

const inputClassName =
  "w-full min-h-12 rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-white outline-none transition placeholder:text-zinc-600 focus:border-violet-400";
