import type { Metadata } from "next";

import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "About",
  description:
    "About Azeez Ahmed Khan, a full-stack developer building web applications, SaaS products and real-time systems.",
  canonicalPath: "/about",
});

export default function AboutPage() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-md py-2xl" id="main">
      <h1 className="text-display-m font-display">About</h1>
      <p className="mt-lg max-w-[65ch] text-body-m text-muted">
        Biography pending. The short bio, long bio, engineering philosophy and current
        learning focus are collected through the content interview.
      </p>
    </main>
  );
}
