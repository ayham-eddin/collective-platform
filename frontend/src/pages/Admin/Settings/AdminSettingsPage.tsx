import { Save, Upload } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  getAdminSiteSettings,
  updateAdminSiteSettings,
} from "../../../services/settings.service";
import { uploadSingleImage } from "../../../services/uploads.service";
import type {
  ImageFile,
  SiteSettingsItem,
} from "../../../types/settings.types";

type SettingsFormState = {
  siteNameDe: string;
  siteNameEn: string;
  siteNameAr: string;
  siteDescriptionDe: string;
  siteDescriptionEn: string;
  siteDescriptionAr: string;
  contactEmail: string;
  contactPhone: string;
  instagramUrl: string;
  facebookUrl: string;
  youtubeUrl: string;
  tiktokUrl: string;
};

const initialFormState: SettingsFormState = {
  siteNameDe: "",
  siteNameEn: "",
  siteNameAr: "",
  siteDescriptionDe: "",
  siteDescriptionEn: "",
  siteDescriptionAr: "",
  contactEmail: "",
  contactPhone: "",
  instagramUrl: "",
  facebookUrl: "",
  youtubeUrl: "",
  tiktokUrl: "",
};

const mapSettingsToForm = (settings: SiteSettingsItem): SettingsFormState => ({
  siteNameDe: settings.siteName.de,
  siteNameEn: settings.siteName.en,
  siteNameAr: settings.siteName.ar,
  siteDescriptionDe: settings.siteDescription.de,
  siteDescriptionEn: settings.siteDescription.en,
  siteDescriptionAr: settings.siteDescription.ar,
  contactEmail: settings.contactEmail,
  contactPhone: settings.contactPhone || "",
  instagramUrl: settings.instagramUrl || "",
  facebookUrl: settings.facebookUrl || "",
  youtubeUrl: settings.youtubeUrl || "",
  tiktokUrl: settings.tiktokUrl || "",
});

export const AdminSettingsPage = () => {
  const [formState, setFormState] =
    useState<SettingsFormState>(initialFormState);
  const [logo, setLogo] = useState<ImageFile | undefined>();
  const [favicon, setFavicon] = useState<ImageFile | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [isUploadingFavicon, setIsUploadingFavicon] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getAdminSiteSettings();
        setFormState(mapSettingsToForm(settings));
        setLogo(settings.logo);
        setFavicon(settings.favicon);
      } catch {
        setErrorMessage("Could not load site settings.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadSettings();
  }, []);

  const updateField = (fieldName: keyof SettingsFormState, value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const handleLogoUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setIsUploadingLogo(true);
    setMessage("");
    setErrorMessage("");

    try {
      const uploadedImage = await uploadSingleImage(imageFile);
      setLogo(uploadedImage);
    } catch {
      setErrorMessage("Could not upload logo.");
    } finally {
      setIsUploadingLogo(false);
    }
  };

  const handleFaviconUpload = async (event: ChangeEvent<HTMLInputElement>) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setIsUploadingFavicon(true);
    setMessage("");
    setErrorMessage("");

    try {
      const uploadedImage = await uploadSingleImage(imageFile);
      setFavicon(uploadedImage);
    } catch {
      setErrorMessage("Could not upload favicon.");
    } finally {
      setIsUploadingFavicon(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setMessage("");
    setErrorMessage("");

    try {
      await updateAdminSiteSettings({
        siteName: {
          de: formState.siteNameDe,
          en: formState.siteNameEn,
          ar: formState.siteNameAr,
        },
        siteDescription: {
          de: formState.siteDescriptionDe,
          en: formState.siteDescriptionEn,
          ar: formState.siteDescriptionAr,
        },
        logo,
        favicon,
        contactEmail: formState.contactEmail,
        contactPhone: formState.contactPhone,
        instagramUrl: formState.instagramUrl,
        facebookUrl: formState.facebookUrl,
        youtubeUrl: formState.youtubeUrl,
        tiktokUrl: formState.tiktokUrl,
      });

      setMessage("Site settings updated successfully.");
    } catch {
      setErrorMessage("Could not update site settings.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-zinc-400">Loading settings...</p>;
  }

  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Settings
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">Site Settings</h1>

      <p className="mt-4 text-zinc-400">
        Manage logo, favicon, contact information and social media links.
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

      <form onSubmit={handleSubmit} className="mt-10 grid gap-8">
        <FormCard title="Branding">
          <div className="grid gap-6 lg:grid-cols-2">
            <div>
              <p className="mb-4 text-sm font-bold text-zinc-300">Logo</p>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300">
                <Upload size={18} />
                {isUploadingLogo ? "Uploading..." : "Upload Logo"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => void handleLogoUpload(event)}
                  className="hidden"
                />
              </label>

              {logo && (
                <div className="mt-5 inline-flex rounded-2xl bg-white p-4">
                  <img
                    src={logo.url}
                    alt="Site logo preview"
                    className="h-24 w-24 object-contain"
                  />
                </div>
              )}
            </div>

            <div>
              <p className="mb-4 text-sm font-bold text-zinc-300">Favicon</p>

              <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300">
                <Upload size={18} />
                {isUploadingFavicon ? "Uploading..." : "Upload Favicon"}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => void handleFaviconUpload(event)}
                  className="hidden"
                />
              </label>

              {favicon && (
                <div className="mt-5 inline-flex rounded-2xl bg-white p-4">
                  <img
                    src={favicon.url}
                    alt="Favicon preview"
                    className="h-16 w-16 object-contain"
                  />
                </div>
              )}
            </div>
          </div>
        </FormCard>

        <FormCard title="Site Name">
          <InputGrid>
            <TextInput
              label="Site Name DE"
              value={formState.siteNameDe}
              onChange={(value) => updateField("siteNameDe", value)}
            />
            <TextInput
              label="Site Name EN"
              value={formState.siteNameEn}
              onChange={(value) => updateField("siteNameEn", value)}
            />
            <TextInput
              label="Site Name AR"
              value={formState.siteNameAr}
              onChange={(value) => updateField("siteNameAr", value)}
            />
          </InputGrid>
        </FormCard>

        <FormCard title="Site Description">
          <InputGrid>
            <TextAreaInput
              label="Description DE"
              value={formState.siteDescriptionDe}
              onChange={(value) => updateField("siteDescriptionDe", value)}
            />
            <TextAreaInput
              label="Description EN"
              value={formState.siteDescriptionEn}
              onChange={(value) => updateField("siteDescriptionEn", value)}
            />
            <TextAreaInput
              label="Description AR"
              value={formState.siteDescriptionAr}
              onChange={(value) => updateField("siteDescriptionAr", value)}
            />
          </InputGrid>
        </FormCard>

        <FormCard title="Contact">
          <InputGrid>
            <TextInput
              label="Contact Email"
              value={formState.contactEmail}
              onChange={(value) => updateField("contactEmail", value)}
            />
            <TextInput
              label="Contact Phone"
              value={formState.contactPhone}
              onChange={(value) => updateField("contactPhone", value)}
            />
          </InputGrid>
        </FormCard>

        <FormCard title="Social Links">
          <InputGrid>
            <TextInput
              label="Instagram URL"
              value={formState.instagramUrl}
              onChange={(value) => updateField("instagramUrl", value)}
            />
            <TextInput
              label="Facebook URL"
              value={formState.facebookUrl}
              onChange={(value) => updateField("facebookUrl", value)}
            />
            <TextInput
              label="YouTube URL"
              value={formState.youtubeUrl}
              onChange={(value) => updateField("youtubeUrl", value)}
            />
          </InputGrid>

          <InputGrid>
            <TextInput
              label="TikTok URL"
              value={formState.tiktokUrl}
              onChange={(value) => updateField("tiktokUrl", value)}
            />
          </InputGrid>
        </FormCard>

        <button
          type="submit"
          disabled={isSaving || isUploadingLogo || isUploadingFavicon}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-600 px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Settings"}
        </button>
      </form>
    </section>
  );
};

interface FormCardProps {
  title: string;
  children: React.ReactNode;
}

const FormCard = ({ title, children }: FormCardProps) => {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/[0.03] p-6">
      <h2 className="text-2xl font-black">{title}</h2>
      <div className="mt-6 grid gap-6">{children}</div>
    </div>
  );
};

interface InputGridProps {
  children: React.ReactNode;
}

const InputGrid = ({ children }: InputGridProps) => {
  return <div className="grid gap-5 lg:grid-cols-3">{children}</div>;
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
