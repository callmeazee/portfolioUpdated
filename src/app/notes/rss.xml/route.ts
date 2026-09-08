import { siteConfig } from "@/config/site";
import { notes, profile } from "@/content";

/**
 * RSS feed for the notes section.
 *
 * A writing section without a feed cannot be followed, and readers who care
 * about technical writing are exactly the ones still using readers.
 *
 * Served from a route handler rather than written to a file so it derives from
 * the same content layer as the pages — a note cannot appear on the site and be
 * missing from the feed.
 */

/** XML has five characters that must never appear raw in content. */
function escapeXml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export async function GET() {
  const items = [...notes]
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt))
    .map((note) => {
      const url = `${siteConfig.url}/notes/${note.slug}`;
      return `    <item>
      <title>${escapeXml(note.title)}</title>
      <link>${escapeXml(url)}</link>
      <guid isPermaLink="true">${escapeXml(url)}</guid>
      <pubDate>${new Date(note.publishedAt).toUTCString()}</pubDate>
      <description>${escapeXml(note.summary)}</description>
    </item>`;
    })
    .join("\n");

  /*
   * A feed with no items is still valid, and publishing it early means the URL
   * is stable before there is anything to read.
   */
  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${profile.fullName} — Notes`)}</title>
    <link>${escapeXml(`${siteConfig.url}/notes`)}</link>
    <description>${escapeXml(`Technical notes by ${profile.fullName}.`)}</description>
    <language>en</language>
    <atom:link href="${escapeXml(`${siteConfig.url}/notes/rss.xml`)}" rel="self" type="application/rss+xml"/>
${items}
  </channel>
</rss>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
      "Cache-Control": "public, max-age=3600",
    },
  });
}
