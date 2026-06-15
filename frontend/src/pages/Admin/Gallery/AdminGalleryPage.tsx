import {
  ArrowDown,
  ArrowUp,
  ImagePlus,
  Save,
  Trash2,
  Upload,
} from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  createAdminGalleryImage,
  deleteAdminGalleryImage,
  getAdminGalleryImages,
  reorderAdminGalleryImages,
  updateAdminGalleryImage,
} from "../../../services/gallery.service";
import { uploadSingleImage } from "../../../services/uploads.service";
import type { GalleryImageItem } from "../../../types/gallery.types";
import type { UploadedMedia } from "../../../types/upload.types";

type GalleryFormState = {
  titleDe: string;
  titleEn: string;
  titleAr: string;
  descriptionDe: string;
  descriptionEn: string;
  descriptionAr: string;
  status: GalleryImageItem["status"];
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
  const [images, setImages] = useState<GalleryImageItem[]>([]);
  const [formState, setFormState] =
    useState<GalleryFormState>(initialFormState);
  const [uploadedImage, setUploadedImage] = useState<UploadedMedia | null>(
    null,
  );
  const [editingImageId, setEditingImageId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadImages = async () => {
      try {
        const data = await getAdminGalleryImages();
        setImages(data);
      } catch {
        setErrorMessage("Could not load gallery images.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadImages();
  }, []);

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
  };

  const handleImageUpload = async (event: ChangeEvent<HTMLInputElement>) => {
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
    } catch {
      setErrorMessage("Could not upload image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleEditImage = (image: GalleryImageItem) => {
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
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

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
        const createdImage = await createAdminGalleryImage({
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
          [...currentImages, createdImage].sort(sortGalleryImages),
        );
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
      setImages((currentImages) =>
        currentImages.filter((image) => image._id !== imageId),
      );
      setMessage("Gallery image deleted successfully.");
    } catch {
      setErrorMessage("Could not delete gallery image.");
    }
  };

  const handleMoveImage = async (imageId: string, direction: "up" | "down") => {
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

    const items = reorderedImages.map((image, index) => ({
      id: image._id,
      sortOrder: index + 1,
    }));

    setImages(
      reorderedImages.map((image, index) => ({
        ...image,
        sortOrder: index + 1,
      })),
    );

    try {
      const savedImages = await reorderAdminGalleryImages(items);
      setImages(savedImages);
      setMessage("Gallery order updated.");
    } catch {
      setErrorMessage("Could not update gallery order.");
    }
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
            Upload, edit, delete and reorder gallery images from here.
          </p>
        </div>

        <button
          type="button"
          onClick={resetForm}
          className="inline-flex items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300"
        >
          <ImagePlus size={18} />
          New Image
        </button>
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
              onChange={(event) => updateField("status", event.target.value)}
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

        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {isSaving
            ? "Saving..."
            : editingImageId
              ? "Save Changes"
              : "Create Image"}
        </button>
      </form>

      <section className="mt-12">
        <h2 className="text-2xl font-black">Gallery Images</h2>

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
                    Order: {image.sortOrder || index + 1}
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
                    disabled={index === 0}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowUp size={16} />
                    Up
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleMoveImage(image._id, "down")}
                    disabled={index === images.length - 1}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300 disabled:cursor-not-allowed disabled:opacity-40"
                  >
                    <ArrowDown size={16} />
                    Down
                  </button>

                  <button
                    type="button"
                    onClick={() => handleEditImage(image)}
                    className="rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-violet-400 hover:text-violet-300"
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    onClick={() => void handleDeleteImage(image._id)}
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-white/10 px-4 py-3 text-sm font-bold text-zinc-300 transition hover:border-red-400 hover:text-red-300"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>
    </section>
  );
};

const sortGalleryImages = (
  first: GalleryImageItem,
  second: GalleryImageItem,
) => {
  return (first.sortOrder || 0) - (second.sortOrder || 0);
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
