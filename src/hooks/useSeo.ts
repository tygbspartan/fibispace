import { useEffect } from "react";
import seo from "../data/seo.json";

// Per-page title, description and share tags. The same seo.json also feeds
// scripts/prerender-seo.js, which bakes these tags into a static HTML file per
// route at build time — link-preview crawlers (WhatsApp, Facebook, LinkedIn)
// never run this hook, so they only see what the build wrote.

type SeoEntry = { title: string; description: string };

const PAGES = seo.pages as Record<string, SeoEntry>;
const SERVICES = seo.services as Record<string, SeoEntry>;

// Look an existing tag up, or make it, so every page writes to the same one
// instead of stacking duplicates as people navigate.
const upsertMeta = (attr: "name" | "property", key: string, value: string) => {
  let el = document.head.querySelector<HTMLMetaElement>(
    `meta[${attr}="${key}"]`,
  );
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", value);
};

const upsertCanonical = (href: string) => {
  let el = document.head.querySelector<HTMLLinkElement>(
    'link[rel="canonical"]',
  );
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
};

// "/about/" and "/about" are the same page.
const normalise = (path: string) =>
  path.length > 1 ? path.replace(/\/+$/, "") : path;

export const seoForPath = (path: string): SeoEntry => {
  if (path.startsWith("/admin")) return PAGES["/admin"];
  const service = path.match(/^\/services\/([^/]+)/);
  if (service && SERVICES[service[1]]) return SERVICES[service[1]];
  return PAGES[path] ?? PAGES["/"];
};

/**
 * Sets the document's SEO tags for `path` (a key in seo.json). Pass
 * `noindex` for pages search engines should leave out, such as the admin.
 */
export const useSeo = (path: string, options?: { noindex?: boolean }) => {
  const noindex = options?.noindex ?? false;

  useEffect(() => {
    const clean = normalise(path);
    const { title, description } = seoForPath(clean);
    const url = `${seo.siteUrl}${clean}`;
    const image = `${seo.siteUrl}${seo.image}`;

    document.title = title;
    upsertMeta("name", "description", description);
    upsertMeta("name", "robots", noindex ? "noindex, nofollow" : "index, follow");
    upsertCanonical(url);

    upsertMeta("property", "og:title", title);
    upsertMeta("property", "og:description", description);
    upsertMeta("property", "og:url", url);
    upsertMeta("property", "og:image", image);
    upsertMeta("name", "twitter:title", title);
    upsertMeta("name", "twitter:description", description);
    upsertMeta("name", "twitter:image", image);
  }, [path, noindex]);
};
