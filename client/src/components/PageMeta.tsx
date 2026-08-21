import { useEffect } from "react";

type PageMetaProps = {
  title: string;
  description: string;
  image: string;
  type?: "website" | "profile" | "article";
};

const upsertMeta = (selector: string, attribute: "name" | "property", key: string, content: string) => {
  let node = document.head.querySelector<HTMLMetaElement>(selector);
  if (!node) {
    node = document.createElement("meta");
    node.setAttribute(attribute, key);
    document.head.appendChild(node);
  }
  node.setAttribute("content", content);
};

export default function PageMeta({ title, description, image, type = "website" }: PageMetaProps) {
  useEffect(() => {
    const origin = window.location.origin;
    const url = `${origin}${window.location.pathname}`;
    const imageUrl = image.startsWith("http") ? image : `${origin}${image}`;
    document.title = title;
    upsertMeta('meta[property="og:title"]', "property", "og:title", title);
    upsertMeta('meta[property="og:description"]', "property", "og:description", description);
    upsertMeta('meta[property="og:type"]', "property", "og:type", type);
    upsertMeta('meta[property="og:url"]', "property", "og:url", url);
    upsertMeta('meta[property="og:image"]', "property", "og:image", imageUrl);
    upsertMeta('meta[property="og:image:width"]', "property", "og:image:width", "1200");
    upsertMeta('meta[property="og:image:height"]', "property", "og:image:height", "630");
    upsertMeta('meta[name="twitter:card"]', "name", "twitter:card", "summary_large_image");
    upsertMeta('meta[name="twitter:title"]', "name", "twitter:title", title);
    upsertMeta('meta[name="twitter:description"]', "name", "twitter:description", description);
    upsertMeta('meta[name="twitter:image"]', "name", "twitter:image", imageUrl);
  }, [description, image, title, type]);

  return null;
}
