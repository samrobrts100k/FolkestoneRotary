import type { Metadata } from "next";
import { site } from "../site";

export function buildMetadata({ title, description, path, image, type = "website" }: { title: string; description?: string; path: string; image?: string | null; type?: "website" | "article" }): Metadata {
  const desc = description ?? site.description;
  const url = new URL(path, site.url).toString();
  const images = image ? [{ url: image }] : undefined;
  return {
    title, description: desc,
    alternates: { canonical: url },
    openGraph: { title, description: desc, url, siteName: site.name, locale: "en_GB", type, images },
    twitter: { card: images ? "summary_large_image" : "summary", title, description: desc, images: image ? [image] : undefined },
  };
}
