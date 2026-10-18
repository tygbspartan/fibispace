// Runs after `react-scripts build`. Link-preview crawlers (WhatsApp, Facebook,
// LinkedIn, X) read the raw HTML and never run the app, so without this every
// page would share the home page's title, description and canonical. For each
// public route it writes build/<route>/index.html — a copy of the built shell
// with that page's tags baked in — and writes build/sitemap.xml.
//
// The tags come from src/data/seo.json, the same file the useSeo hook reads in
// the browser, so the two cannot drift apart.

const fs = require("fs");
const path = require("path");

const BUILD = path.join(__dirname, "..", "build");
const seo = require("../src/data/seo.json");

// The address each route is served at. Every route is a folder holding an
// index.html, and Apache redirects /about to /about/, so the slash form is the
// real one — canonical, og:url and the sitemap all have to use it.
const urlFor = (route) => `${seo.siteUrl}${route === "/" ? "/" : `${route}/`}`;

const escape = (s) =>
  s
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

// Every public route, with the admin left out — it is noindex and unlisted.
const routes = [
  ...Object.keys(seo.pages).filter((p) => !p.startsWith("/admin")),
  ...Object.keys(seo.services).map((slug) => `/services/${slug}`),
];

const entryFor = (route) => {
  const service = route.match(/^\/services\/(.+)$/);
  return service ? seo.services[service[1]] : seo.pages[route];
};

// Tags this script owns. Any copy already in the shell is removed first, so
// each page ends up with exactly one of each.
const OWNED = [
  /<title>[^<]*<\/title>/g,
  /<link rel="canonical"[^>]*>/g,
  /<meta name="(description|robots|twitter:title|twitter:description|twitter:image)"[^>]*>/g,
  /<meta property="og:(title|description|url|image)"[^>]*>/g,
];

const shell = fs.readFileSync(path.join(BUILD, "index.html"), "utf8");

const render = (route) => {
  const { title, description } = entryFor(route);
  const url = urlFor(route);
  const image = `${seo.siteUrl}${seo.image}`;
  const t = escape(title);
  const d = escape(description);

  const tags = [
    `<title>${t}</title>`,
    `<meta name="description" content="${d}"/>`,
    `<meta name="robots" content="index, follow"/>`,
    `<link rel="canonical" href="${url}"/>`,
    `<meta property="og:title" content="${t}"/>`,
    `<meta property="og:description" content="${d}"/>`,
    `<meta property="og:url" content="${url}"/>`,
    `<meta property="og:image" content="${image}"/>`,
    `<meta name="twitter:title" content="${t}"/>`,
    `<meta name="twitter:description" content="${d}"/>`,
    `<meta name="twitter:image" content="${image}"/>`,
  ].join("");

  let html = shell;
  for (const re of OWNED) html = html.replace(re, "");
  return html.replace("</head>", `${tags}</head>`);
};

for (const route of routes) {
  const out =
    route === "/"
      ? path.join(BUILD, "index.html")
      : path.join(BUILD, route, "index.html");
  fs.mkdirSync(path.dirname(out), { recursive: true });
  fs.writeFileSync(out, render(route));
}

const today = new Date().toISOString().slice(0, 10);
const sitemap =
  `<?xml version="1.0" encoding="UTF-8"?>\n` +
  `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n` +
  routes
    .map(
      (r) =>
        `  <url><loc>${urlFor(r)}</loc><lastmod>${today}</lastmod>` +
        `<priority>${r === "/" ? "1.0" : r.startsWith("/services/") ? "0.8" : "0.6"}</priority></url>`,
    )
    .join("\n") +
  `\n</urlset>\n`;
fs.writeFileSync(path.join(BUILD, "sitemap.xml"), sitemap);

console.log(`SEO: wrote ${routes.length} pages and sitemap.xml`);
