import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { createContactMessage } from "../../services/contact.service";
import { getPublicSiteSettings } from "../../services/settings.service";
import type { SiteSettingsItem } from "../../types/settings.types";

type ContactFormState = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const initialFormState: ContactFormState = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

export const ContactPage = () => {
  const [formState, setFormState] =
    useState<ContactFormState>(initialFormState);
  const [settings, setSettings] = useState<SiteSettingsItem | null>(null);
  const [isSending, setIsSending] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const data = await getPublicSiteSettings();
        setSettings(data);
      } catch {
        setSettings(null);
      }
    };

    void loadSettings();
  }, []);

  const updateField = (fieldName: keyof ContactFormState, value: string) => {
    setFormState((currentState) => ({
      ...currentState,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    setIsSending(true);
    setSuccessMessage("");
    setErrorMessage("");

    try {
      await createContactMessage({
        fullName: formState.fullName,
        email: formState.email,
        subject: formState.subject,
        message: formState.message,
      });

      setFormState(initialFormState);
      setSuccessMessage("Your message has been sent successfully.");
    } catch {
      setErrorMessage("Could not send your message. Please try again.");
    } finally {
      setIsSending(false);
    }
  };

  const contactEmail =
    settings?.contactEmail || "contact@schufimafi-collective.com";

  return (
    <main className="bg-[#f4f3fb] text-[#252530]">
      <section className="relative overflow-hidden bg-[#08080c] text-white">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute right-0 bottom-0 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 md:py-32">
          <p className="text-lg font-black uppercase tracking-[0.35em] text-violet-300">
            Contact
          </p>

          <h1 className="mt-6 max-w-4xl text-6xl font-black leading-none tracking-tight md:text-8xl">
            Let’s create something together.
          </h1>

          <p className="mt-8 max-w-2xl text-xl leading-9 text-zinc-300">
            Send us a message for collaborations, event requests, cultural
            programs or general questions.
          </p>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-10 px-6 py-24 lg:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[2rem] bg-[#08080c] p-8 text-white shadow-2xl shadow-black/20">
          <p className="text-lg font-bold italic text-violet-300">
            Kontakt Uns
          </p>

          <h2 className="mt-4 text-4xl font-black tracking-tight">
            We’d love to hear from you.
          </h2>

          <div className="mt-10 grid gap-6 text-zinc-300">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-center gap-4 transition hover:text-white"
            >
              <span className="grid h-12 w-12 place-items-center rounded-full bg-violet-600/20 text-violet-300">
                <Mail size={21} />
              </span>
              <span className="break-all">{contactEmail}</span>
            </a>

            {settings?.contactPhone && (
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-center gap-4 transition hover:text-white"
              >
                <span className="grid h-12 w-12 place-items-center rounded-full bg-violet-600/20 text-violet-300">
                  <Phone size={21} />
                </span>
                <span>{settings.contactPhone}</span>
              </a>
            )}

            <p className="flex items-center gap-4">
              <span className="grid h-12 w-12 place-items-center rounded-full bg-violet-600/20 text-violet-300">
                <MapPin size={21} />
              </span>
              <span>Düsseldorf, NRW</span>
            </p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-[2rem] bg-white p-6 shadow-2xl shadow-black/10 md:p-8"
        >
          <h2 className="text-4xl font-black tracking-tight">Send a message</h2>

          {successMessage && (
            <p className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold text-emerald-700">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <TextInput
              label="Full name"
              value={formState.fullName}
              onChange={(value) => updateField("fullName", value)}
              required
            />

            <TextInput
              label="Email"
              type="email"
              value={formState.email}
              onChange={(value) => updateField("email", value)}
              required
            />
          </div>

          <div className="mt-5">
            <TextInput
              label="Subject"
              value={formState.subject}
              onChange={(value) => updateField("subject", value)}
              required
            />
          </div>

          <div className="mt-5">
            <TextAreaInput
              label="Message"
              value={formState.message}
              onChange={(value) => updateField("message", value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-violet-600 px-8 py-4 text-sm font-black uppercase tracking-wide text-white transition hover:bg-violet-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {isSending ? "Sending..." : "Send Message"}
          </button>
        </form>
      </section>
    </main>
  );
};

interface TextInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email";
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
      <span className="text-sm font-black text-zinc-700">{label}</span>
      <input
        type={type}
        value={value}
        required={required}
        onChange={(event) => onChange(event.target.value)}
        className="w-full rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:bg-white"
      />
    </label>
  );
};

interface TextAreaInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  required?: boolean;
}

const TextAreaInput = ({
  label,
  value,
  onChange,
  required = false,
}: TextAreaInputProps) => {
  return (
    <label className="grid gap-2">
      <span className="text-sm font-black text-zinc-700">{label}</span>
      <textarea
        value={value}
        required={required}
        rows={7}
        onChange={(event) => onChange(event.target.value)}
        className="w-full resize-none rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-4 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:bg-white"
      />
    </label>
  );
};
