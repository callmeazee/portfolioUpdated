export interface NavItem {
  label: string;
  href: string;
  external?: boolean;
}

export interface SocialLinks {
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface SiteConfig {
  name: string;
  title: string;
  description: string;
  url: string;
  basePath: string;
  defaultLocale: string;
  author: string;
  keywords: ReadonlyArray<string>;
  socials: SocialLinks;
}
