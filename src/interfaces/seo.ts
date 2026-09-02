export interface SeoPageMeta {
  title?: string;
  description?: string;
  slug?: string;
  canonicalPath?: string;
  keywords?: ReadonlyArray<string>;
  image?: string;
  type?: "website" | "article";
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}
