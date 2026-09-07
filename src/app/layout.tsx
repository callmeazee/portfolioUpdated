import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { navigation, siteConfig } from "@/config/site";
import { contact, notes, profile, getAllProjects } from "@/content";
import { createSeoMetadata } from "@/lib/seo";
import { getThemeSections } from "@/themes/renderer";
import { getAllThemes } from "@/themes/registry";
import { getActiveThemeId } from "@/themes/server";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = createSeoMetadata({
  title: siteConfig.title,
  description: siteConfig.description,
  slug: "",
  keywords: siteConfig.keywords,
});

export default async function RootLayout({ children }: LayoutProps<"/">) {
  /*
   * Theme resolved on the server (ADR-007): `data-theme` drives every token
   * override, and the renderer supplies the chrome for that theme only — so a
   * visitor downloads one theme's markup and JavaScript, not four.
   */
  const theme = await getActiveThemeId();
  const { Shell } = await getThemeSections(theme);

  return (
    <html
      lang="en"
      data-theme={theme}
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <body className="flex min-h-screen flex-col">
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <Shell
          profile={profile}
          contact={contact}
          navigation={navigation}
          projects={getAllProjects()}
          notes={notes}
          activeTheme={theme}
          themes={getAllThemes()}
        >
          {children}
        </Shell>
      </body>
    </html>
  );
}
