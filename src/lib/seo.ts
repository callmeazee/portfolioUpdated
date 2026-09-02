import type { Metadata } from "next";

import { siteConfig } from "@/config/site";
import type { SeoPageMeta } from "@/interfaces/seo";

export function buildCanonicalUrl(pathname = "") {
  const normalizedPath = pathname.startsWith("/") ? pathname : `/${pathname}`;
  return new URL(normalizedPath, siteConfig.url).toString();
}

/*
 * Theme-independent SEO identity (README §16): every theme renders the same
 * canonical metadata for a given route.
 */
export function createSeoMetadata({
  title,
  description,
  slug,
  canonicalPath,
  keywords,
  image,
  type = "website",
  publishedTime,
  modifiedTime,
  author,
  section,
}: SeoPageMeta = {}): Metadata {
  const pageTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.title;
  const pageDescription = description ?? siteConfig.description;
  const canonical = canonicalPath
    ? buildCanonicalUrl(canonicalPath)
    : buildCanonicalUrl(slug ?? "");

  /*
   * The boilerplate defaulted this to `/opengraph-image.png` — a file that does
   * not exist in `public/` — leaving every page with a broken social preview.
   *
   * The default is now `/og`, a route handler that renders the card. It is set
   * explicitly on every route because a page exporting its own `openGraph`
   * object replaces the parent's wholesale; see app/og/route.tsx for why the
   * `opengraph-image.tsx` file convention could not be used here.
   */
  const ogImage = image ?? "/og";
  const images = [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }];

  return {
    metadataBase: new URL(siteConfig.url),
    title: pageTitle,
    description: pageDescription,
    keywords: keywords ? [...keywords] : [...siteConfig.keywords],
    alternates: {
      canonical,
    },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url: canonical,
      siteName: siteConfig.name,
      locale: siteConfig.defaultLocale,
      type,
      publishedTime,
      modifiedTime,
      authors: author ? [author] : [siteConfig.author],
      section,
      images,
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
    },
    authors: [{ name: author ?? siteConfig.author }],
  };
}
