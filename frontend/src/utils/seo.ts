type SeoOptions = {
  title: string;
  description: string;
  imageUrl?: string;
  url?: string;
  type?: "website" | "article";
};

const defaultImageUrl =
  "https://res.cloudinary.com/dabhyvhy3/image/upload/v1781453481/Layali1_ukdkuw.png";

const updateMetaTag = (selector: string, attribute: string, value: string) => {
  let metaTag = document.head.querySelector<HTMLMetaElement>(selector);

  if (!metaTag) {
    metaTag = document.createElement("meta");

    if (selector.includes("property=")) {
      metaTag.setAttribute(
        "property",
        selector.replace('meta[property="', "").replace('"]', ""),
      );
    } else {
      metaTag.setAttribute(
        "name",
        selector.replace('meta[name="', "").replace('"]', ""),
      );
    }

    document.head.appendChild(metaTag);
  }

  metaTag.setAttribute(attribute, value);
};

export const updateSeo = ({
  title,
  description,
  imageUrl = defaultImageUrl,
  url = window.location.href,
  type = "website",
}: SeoOptions) => {
  document.title = title;

  updateMetaTag('meta[name="description"]', "content", description);

  updateMetaTag('meta[property="og:title"]', "content", title);
  updateMetaTag('meta[property="og:description"]', "content", description);
  updateMetaTag('meta[property="og:image"]', "content", imageUrl);
  updateMetaTag('meta[property="og:url"]', "content", url);
  updateMetaTag('meta[property="og:type"]', "content", type);

  updateMetaTag('meta[name="twitter:card"]', "content", "summary_large_image");
  updateMetaTag('meta[name="twitter:title"]', "content", title);
  updateMetaTag('meta[name="twitter:description"]', "content", description);
  updateMetaTag('meta[name="twitter:image"]', "content", imageUrl);
};
