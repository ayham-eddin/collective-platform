import { Save, Upload } from "lucide-react";
import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import {
  getAdminHomeContent,
  updateAdminHomeContent,
} from "../../../services/homeContent.service";
import { uploadSingleImage } from "../../../services/uploads.service";
import type {
  HomeContentItem,
  ImageFile,
} from "../../../types/homeContent.types";

type HomeContentFormState = {
  heroBadgeDe: string;
  heroBadgeEn: string;
  heroBadgeAr: string;
  heroTitleDe: string;
  heroTitleEn: string;
  heroTitleAr: string;
  heroSubtitleDe: string;
  heroSubtitleEn: string;
  heroSubtitleAr: string;
  primaryButtonLabelDe: string;
  primaryButtonLabelEn: string;
  primaryButtonLabelAr: string;
  primaryButtonUrl: string;
  secondaryButtonLabelDe: string;
  secondaryButtonLabelEn: string;
  secondaryButtonLabelAr: string;
  secondaryButtonUrl: string;
  aboutEyebrowDe: string;
  aboutEyebrowEn: string;
  aboutEyebrowAr: string;
  aboutTitleDe: string;
  aboutTitleEn: string;
  aboutTitleAr: string;
  aboutTextDe: string;
  aboutTextEn: string;
  aboutTextAr: string;
  aboutButtonLabelDe: string;
  aboutButtonLabelEn: string;
  aboutButtonLabelAr: string;
  aboutButtonUrl: string;
};

const initialFormState: HomeContentFormState = {
  heroBadgeDe: "",
  heroBadgeEn: "",
  heroBadgeAr: "",
  heroTitleDe: "",
  heroTitleEn: "",
  heroTitleAr: "",
  heroSubtitleDe: "",
  heroSubtitleEn: "",
  heroSubtitleAr: "",
  primaryButtonLabelDe: "",
  primaryButtonLabelEn: "",
  primaryButtonLabelAr: "",
  primaryButtonUrl: "",
  secondaryButtonLabelDe: "",
  secondaryButtonLabelEn: "",
  secondaryButtonLabelAr: "",
  secondaryButtonUrl: "",
  aboutEyebrowDe: "",
  aboutEyebrowEn: "",
  aboutEyebrowAr: "",
  aboutTitleDe: "",
  aboutTitleEn: "",
  aboutTitleAr: "",
  aboutTextDe: "",
  aboutTextEn: "",
  aboutTextAr: "",
  aboutButtonLabelDe: "",
  aboutButtonLabelEn: "",
  aboutButtonLabelAr: "",
  aboutButtonUrl: "",
};

const mapContentToForm = (content: HomeContentItem): HomeContentFormState => ({
  heroBadgeDe: content.heroBadge.de,
  heroBadgeEn: content.heroBadge.en,
  heroBadgeAr: content.heroBadge.ar,
  heroTitleDe: content.heroTitle.de,
  heroTitleEn: content.heroTitle.en,
  heroTitleAr: content.heroTitle.ar,
  heroSubtitleDe: content.heroSubtitle.de,
  heroSubtitleEn: content.heroSubtitle.en,
  heroSubtitleAr: content.heroSubtitle.ar,
  primaryButtonLabelDe: content.primaryButton.label.de,
  primaryButtonLabelEn: content.primaryButton.label.en,
  primaryButtonLabelAr: content.primaryButton.label.ar,
  primaryButtonUrl: content.primaryButton.url,
  secondaryButtonLabelDe: content.secondaryButton.label.de,
  secondaryButtonLabelEn: content.secondaryButton.label.en,
  secondaryButtonLabelAr: content.secondaryButton.label.ar,
  secondaryButtonUrl: content.secondaryButton.url,
  aboutEyebrowDe: content.aboutEyebrow.de,
  aboutEyebrowEn: content.aboutEyebrow.en,
  aboutEyebrowAr: content.aboutEyebrow.ar,
  aboutTitleDe: content.aboutTitle.de,
  aboutTitleEn: content.aboutTitle.en,
  aboutTitleAr: content.aboutTitle.ar,
  aboutTextDe: content.aboutText.de,
  aboutTextEn: content.aboutText.en,
  aboutTextAr: content.aboutText.ar,
  aboutButtonLabelDe: content.aboutButton.label.de,
  aboutButtonLabelEn: content.aboutButton.label.en,
  aboutButtonLabelAr: content.aboutButton.label.ar,
  aboutButtonUrl: content.aboutButton.url,
});

export const AdminHomeContentPage = () => {
  const [formState, setFormState] =
    useState<HomeContentFormState>(initialFormState);
  const [heroImage, setHeroImage] = useState<ImageFile | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadContent = async () => {
      try {
        const content = await getAdminHomeContent();
        setFormState(mapContentToForm(content));
        setHeroImage(content.heroImage);
      } catch {
        setErrorMessage("Could not load home content.");
      } finally {
        setIsLoading(false);
      }
    };

    void loadContent();
  }, []);

  const updateField = (
    fieldName: keyof HomeContentFormState,
    value: string,
  ) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const handleHeroImageUpload = async (
    event: ChangeEvent<HTMLInputElement>,
  ) => {
    const imageFile = event.target.files?.[0];

    if (!imageFile) {
      return;
    }

    setIsUploading(true);
    setErrorMessage("");
    setMessage("");

    try {
      const uploadedImage = await uploadSingleImage(imageFile);
      setHeroImage(uploadedImage);
    } catch {
      setErrorMessage("Could not upload hero image.");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSaving(true);
    setErrorMessage("");
    setMessage("");

    try {
      await updateAdminHomeContent({
        heroBadge: {
          de: formState.heroBadgeDe,
          en: formState.heroBadgeEn,
          ar: formState.heroBadgeAr,
        },
        heroTitle: {
          de: formState.heroTitleDe,
          en: formState.heroTitleEn,
          ar: formState.heroTitleAr,
        },
        heroSubtitle: {
          de: formState.heroSubtitleDe,
          en: formState.heroSubtitleEn,
          ar: formState.heroSubtitleAr,
        },
        heroImage,
        primaryButton: {
          label: {
            de: formState.primaryButtonLabelDe,
            en: formState.primaryButtonLabelEn,
            ar: formState.primaryButtonLabelAr,
          },
          url: formState.primaryButtonUrl,
        },
        secondaryButton: {
          label: {
            de: formState.secondaryButtonLabelDe,
            en: formState.secondaryButtonLabelEn,
            ar: formState.secondaryButtonLabelAr,
          },
          url: formState.secondaryButtonUrl,
        },
        aboutEyebrow: {
          de: formState.aboutEyebrowDe,
          en: formState.aboutEyebrowEn,
          ar: formState.aboutEyebrowAr,
        },
        aboutTitle: {
          de: formState.aboutTitleDe,
          en: formState.aboutTitleEn,
          ar: formState.aboutTitleAr,
        },
        aboutText: {
          de: formState.aboutTextDe,
          en: formState.aboutTextEn,
          ar: formState.aboutTextAr,
        },
        aboutButton: {
          label: {
            de: formState.aboutButtonLabelDe,
            en: formState.aboutButtonLabelEn,
            ar: formState.aboutButtonLabelAr,
          },
          url: formState.aboutButtonUrl,
        },
      });

      setMessage("Home content updated successfully.");
    } catch {
      setErrorMessage("Could not update home content.");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <p className="text-zinc-400">Loading home content...</p>;
  }

  return (
    <section>
      <p className="text-sm font-black uppercase tracking-[0.35em] text-violet-300">
        Home Content
      </p>

      <h1 className="mt-4 text-4xl font-black tracking-tight">
        Manage Homepage
      </h1>

      <p className="mt-4 text-zinc-400">
        Edit homepage hero section and about preview content.
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
        <FormCard title="Hero Image">
          <p className="mb-5 text-sm text-zinc-500">
            Max image size: 10MB. Recommended width: 1600–2000px.
          </p>

          <label className="inline-flex cursor-pointer items-center gap-2 rounded-full border border-white/10 px-5 py-3 text-sm font-black text-white transition hover:border-violet-400 hover:text-violet-300">
            <Upload size={18} />
            {isUploading ? "Uploading..." : "Upload Hero Image"}
            <input
              type="file"
              accept="image/*"
              onChange={(event) => void handleHeroImageUpload(event)}
              className="hidden"
            />
          </label>

          {heroImage && (
            <img
              src={heroImage.url}
              alt="Homepage hero preview"
              className="mt-6 h-72 w-full rounded-3xl object-cover"
            />
          )}
        </FormCard>

        <FormCard title="Hero Text">
          <InputGrid>
            <TextInput
              label="Hero Badge DE"
              value={formState.heroBadgeDe}
              onChange={(value) => updateField("heroBadgeDe", value)}
            />
            <TextInput
              label="Hero Badge EN"
              value={formState.heroBadgeEn}
              onChange={(value) => updateField("heroBadgeEn", value)}
            />
            <TextInput
              label="Hero Badge AR"
              value={formState.heroBadgeAr}
              onChange={(value) => updateField("heroBadgeAr", value)}
            />
          </InputGrid>

          <InputGrid>
            <TextInput
              label="Hero Title DE"
              value={formState.heroTitleDe}
              onChange={(value) => updateField("heroTitleDe", value)}
            />
            <TextInput
              label="Hero Title EN"
              value={formState.heroTitleEn}
              onChange={(value) => updateField("heroTitleEn", value)}
            />
            <TextInput
              label="Hero Title AR"
              value={formState.heroTitleAr}
              onChange={(value) => updateField("heroTitleAr", value)}
            />
          </InputGrid>

          <InputGrid>
            <TextAreaInput
              label="Hero Subtitle DE"
              value={formState.heroSubtitleDe}
              onChange={(value) => updateField("heroSubtitleDe", value)}
            />
            <TextAreaInput
              label="Hero Subtitle EN"
              value={formState.heroSubtitleEn}
              onChange={(value) => updateField("heroSubtitleEn", value)}
            />
            <TextAreaInput
              label="Hero Subtitle AR"
              value={formState.heroSubtitleAr}
              onChange={(value) => updateField("heroSubtitleAr", value)}
            />
          </InputGrid>
        </FormCard>

        <FormCard title="Hero Buttons">
          <InputGrid>
            <TextInput
              label="Primary Button DE"
              value={formState.primaryButtonLabelDe}
              onChange={(value) => updateField("primaryButtonLabelDe", value)}
            />
            <TextInput
              label="Primary Button EN"
              value={formState.primaryButtonLabelEn}
              onChange={(value) => updateField("primaryButtonLabelEn", value)}
            />
            <TextInput
              label="Primary Button AR"
              value={formState.primaryButtonLabelAr}
              onChange={(value) => updateField("primaryButtonLabelAr", value)}
            />
          </InputGrid>

          <TextInput
            label="Primary Button URL"
            value={formState.primaryButtonUrl}
            onChange={(value) => updateField("primaryButtonUrl", value)}
          />

          <InputGrid>
            <TextInput
              label="Secondary Button DE"
              value={formState.secondaryButtonLabelDe}
              onChange={(value) => updateField("secondaryButtonLabelDe", value)}
            />
            <TextInput
              label="Secondary Button EN"
              value={formState.secondaryButtonLabelEn}
              onChange={(value) => updateField("secondaryButtonLabelEn", value)}
            />
            <TextInput
              label="Secondary Button AR"
              value={formState.secondaryButtonLabelAr}
              onChange={(value) => updateField("secondaryButtonLabelAr", value)}
            />
          </InputGrid>

          <TextInput
            label="Secondary Button URL"
            value={formState.secondaryButtonUrl}
            onChange={(value) => updateField("secondaryButtonUrl", value)}
          />
        </FormCard>

        <FormCard title="About Preview">
          <InputGrid>
            <TextInput
              label="Eyebrow DE"
              value={formState.aboutEyebrowDe}
              onChange={(value) => updateField("aboutEyebrowDe", value)}
            />
            <TextInput
              label="Eyebrow EN"
              value={formState.aboutEyebrowEn}
              onChange={(value) => updateField("aboutEyebrowEn", value)}
            />
            <TextInput
              label="Eyebrow AR"
              value={formState.aboutEyebrowAr}
              onChange={(value) => updateField("aboutEyebrowAr", value)}
            />
          </InputGrid>

          <InputGrid>
            <TextInput
              label="About Title DE"
              value={formState.aboutTitleDe}
              onChange={(value) => updateField("aboutTitleDe", value)}
            />
            <TextInput
              label="About Title EN"
              value={formState.aboutTitleEn}
              onChange={(value) => updateField("aboutTitleEn", value)}
            />
            <TextInput
              label="About Title AR"
              value={formState.aboutTitleAr}
              onChange={(value) => updateField("aboutTitleAr", value)}
            />
          </InputGrid>

          <InputGrid>
            <TextAreaInput
              label="About Text DE"
              value={formState.aboutTextDe}
              onChange={(value) => updateField("aboutTextDe", value)}
            />
            <TextAreaInput
              label="About Text EN"
              value={formState.aboutTextEn}
              onChange={(value) => updateField("aboutTextEn", value)}
            />
            <TextAreaInput
              label="About Text AR"
              value={formState.aboutTextAr}
              onChange={(value) => updateField("aboutTextAr", value)}
            />
          </InputGrid>

          <InputGrid>
            <TextInput
              label="About Button DE"
              value={formState.aboutButtonLabelDe}
              onChange={(value) => updateField("aboutButtonLabelDe", value)}
            />
            <TextInput
              label="About Button EN"
              value={formState.aboutButtonLabelEn}
              onChange={(value) => updateField("aboutButtonLabelEn", value)}
            />
            <TextInput
              label="About Button AR"
              value={formState.aboutButtonLabelAr}
              onChange={(value) => updateField("aboutButtonLabelAr", value)}
            />
          </InputGrid>

          <TextInput
            label="About Button URL"
            value={formState.aboutButtonUrl}
            onChange={(value) => updateField("aboutButtonUrl", value)}
          />
        </FormCard>

        <button
          type="submit"
          disabled={isSaving || isUploading}
          className="inline-flex w-fit items-center gap-2 rounded-full bg-violet-600 px-7 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
        >
          <Save size={18} />
          {isSaving ? "Saving..." : "Save Homepage"}
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
