import { Mail, MapPin, Phone, Send } from "lucide-react";
import { useEffect, useState, type FormEvent } from "react";
import { useLanguage } from "../../contexts/useLanguage";
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

const pageText = {
  eyebrow: {
    de: "Kontakt",
    en: "Contact",
    ar: "تواصل معنا",
  },
  title: {
    de: "Lass uns gemeinsam etwas erschaffen.",
    en: "Let’s create something together.",
    ar: "لنصنع شيئاً معاً.",
  },
  subtitle: {
    de: "Schreib uns für Kooperationen, Event-Anfragen, Kulturprogramme oder allgemeine Fragen.",
    en: "Send us a message for collaborations, event requests, cultural programs or general questions.",
    ar: "راسلنا للتعاون أو طلبات الفعاليات أو البرامج الثقافية أو الأسئلة العامة.",
  },
  contactEyebrow: {
    de: "Kontakt Uns",
    en: "Contact us",
    ar: "تواصل معنا",
  },
  contactTitle: {
    de: "Wir freuen uns, von dir zu hören.",
    en: "We’d love to hear from you.",
    ar: "يسعدنا أن نسمع منك.",
  },
  formTitle: {
    de: "Nachricht senden",
    en: "Send a message",
    ar: "إرسال رسالة",
  },
  fullName: {
    de: "Vollständiger Name",
    en: "Full name",
    ar: "الاسم الكامل",
  },
  email: {
    de: "E-Mail",
    en: "Email",
    ar: "البريد الإلكتروني",
  },
  subject: {
    de: "Betreff",
    en: "Subject",
    ar: "الموضوع",
  },
  message: {
    de: "Nachricht",
    en: "Message",
    ar: "الرسالة",
  },
  send: {
    de: "Nachricht senden",
    en: "Send Message",
    ar: "إرسال الرسالة",
  },
  sending: {
    de: "Wird gesendet...",
    en: "Sending...",
    ar: "جاري الإرسال...",
  },
  success: {
    de: "Deine Nachricht wurde erfolgreich gesendet.",
    en: "Your message has been sent successfully.",
    ar: "تم إرسال رسالتك بنجاح.",
  },
  error: {
    de: "Deine Nachricht konnte nicht gesendet werden. Bitte versuche es erneut.",
    en: "Could not send your message. Please try again.",
    ar: "تعذر إرسال رسالتك. يرجى المحاولة مرة أخرى.",
  },
};

export const ContactPage = () => {
  const { language } = useLanguage();
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
      setSuccessMessage(pageText.success[language]);
    } catch {
      setErrorMessage(pageText.error[language]);
    } finally {
      setIsSending(false);
    }
  };

  const contactEmail =
    settings?.contactEmail || "contact@schufimafi-collective.com";

  return (
    <main className="overflow-hidden bg-[#f4f3fb] text-[#252530]">
      <section className="relative min-h-[520px] overflow-hidden bg-[#08080c] text-white sm:min-h-[580px] lg:min-h-[640px]">
        <div className="absolute left-0 top-0 h-80 w-80 rounded-full bg-violet-600/20 blur-3xl" />
        <div className="absolute bottom-0 right-0 h-80 w-80 rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-end px-5 py-14 sm:min-h-[580px] sm:px-6 sm:py-20 lg:min-h-[640px]">
          <div className="max-w-4xl">
            <p className="text-sm font-black uppercase tracking-[0.28em] text-violet-300 sm:text-base lg:text-lg">
              {pageText.eyebrow[language]}
            </p>

            <h1 className="hero-title mt-5">{pageText.title[language]}</h1>

            <p className="mt-6 max-w-2xl text-base leading-8 text-zinc-300 sm:text-lg lg:text-xl">
              {pageText.subtitle[language]}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto grid max-w-7xl gap-8 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[0.85fr_1.15fr] lg:gap-10 lg:py-24">
        <aside className="rounded-[1.5rem] bg-[#08080c] p-6 text-white shadow-2xl shadow-black/20 sm:rounded-[2rem] sm:p-8">
          <p className="text-base font-bold italic text-violet-300 sm:text-lg">
            {pageText.contactEyebrow[language]}
          </p>

          <h2 className="mt-4 break-words text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            {pageText.contactTitle[language]}
          </h2>

          <div className="mt-8 grid gap-5 text-zinc-300 sm:mt-10">
            <a
              href={`mailto:${contactEmail}`}
              className="flex items-start gap-4 transition hover:text-white"
            >
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-600/20 text-violet-300 sm:h-12 sm:w-12">
                <Mail size={21} />
              </span>
              <span className="break-all leading-7">{contactEmail}</span>
            </a>

            {settings?.contactPhone && (
              <a
                href={`tel:${settings.contactPhone}`}
                className="flex items-start gap-4 transition hover:text-white"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-600/20 text-violet-300 sm:h-12 sm:w-12">
                  <Phone size={21} />
                </span>
                <span className="leading-7">{settings.contactPhone}</span>
              </a>
            )}

            <p className="flex items-start gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-violet-600/20 text-violet-300 sm:h-12 sm:w-12">
                <MapPin size={21} />
              </span>
              <span className="leading-7">Düsseldorf, NRW</span>
            </p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit}
          className="rounded-[1.5rem] bg-white p-5 shadow-2xl shadow-black/10 sm:rounded-[2rem] sm:p-8"
        >
          <h2 className="break-words text-3xl font-black leading-tight tracking-tight sm:text-4xl">
            {pageText.formTitle[language]}
          </h2>

          {successMessage && (
            <p className="mt-6 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 text-sm font-bold leading-6 text-emerald-700">
              {successMessage}
            </p>
          )}

          {errorMessage && (
            <p className="mt-6 rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-sm font-bold leading-6 text-red-700">
              {errorMessage}
            </p>
          )}

          <div className="mt-8 grid gap-5 md:grid-cols-2">
            <TextInput
              label={pageText.fullName[language]}
              value={formState.fullName}
              onChange={(value) => updateField("fullName", value)}
              required
            />

            <TextInput
              label={pageText.email[language]}
              type="email"
              value={formState.email}
              onChange={(value) => updateField("email", value)}
              required
            />
          </div>

          <div className="mt-5">
            <TextInput
              label={pageText.subject[language]}
              value={formState.subject}
              onChange={(value) => updateField("subject", value)}
              required
            />
          </div>

          <div className="mt-5">
            <TextAreaInput
              label={pageText.message[language]}
              value={formState.message}
              onChange={(value) => updateField("message", value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSending}
            className="btn btn-primary mt-8 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <Send size={18} />
            {isSending ? pageText.sending[language] : pageText.send[language]}
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
        className={inputClassName}
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
        className={`${inputClassName} resize-none`}
      />
    </label>
  );
};

const inputClassName =
  "w-full min-h-12 rounded-2xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-violet-400 focus:bg-white sm:px-5 sm:py-4";
