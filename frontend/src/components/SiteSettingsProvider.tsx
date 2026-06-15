import { useEffect, type ReactNode } from "react";
import { getPublicSiteSettings } from "../services/settings.service";

interface SiteSettingsProviderProps {
  children: ReactNode;
}

export const SiteSettingsProvider = ({
  children,
}: SiteSettingsProviderProps) => {
  useEffect(() => {
    const applySiteSettings = async () => {
      try {
        const settings = await getPublicSiteSettings();

        document.title = settings.siteName.de;

        const descriptionMetaTag = getOrCreateMetaTag("description");
        descriptionMetaTag.setAttribute("content", settings.siteDescription.de);

        if (settings.favicon?.url) {
          const faviconLink = getOrCreateFaviconLink();
          faviconLink.setAttribute("href", settings.favicon.url);
        }
      } catch {
        document.title = "Schu Fi Ma Fi Collective";
      }
    };

    void applySiteSettings();
  }, []);

  return children;
};

const getOrCreateMetaTag = (name: string) => {
  const existingMetaTag = document.querySelector<HTMLMetaElement>(
    `meta[name="${name}"]`,
  );

  if (existingMetaTag) {
    return existingMetaTag;
  }

  const metaTag = document.createElement("meta");
  metaTag.setAttribute("name", name);
  document.head.appendChild(metaTag);

  return metaTag;
};

const getOrCreateFaviconLink = () => {
  const existingFaviconLink =
    document.querySelector<HTMLLinkElement>('link[rel="icon"]');

  if (existingFaviconLink) {
    return existingFaviconLink;
  }

  const faviconLink = document.createElement("link");
  faviconLink.setAttribute("rel", "icon");
  document.head.appendChild(faviconLink);

  return faviconLink;
};
