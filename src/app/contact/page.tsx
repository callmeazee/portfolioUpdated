import type { Metadata } from "next";

import { createSeoMetadata } from "@/lib/seo";

export const metadata: Metadata = createSeoMetadata({
  title: "Contact",
  description: "Get in touch with Azeez Ahmed Khan.",
  canonicalPath: "/contact",
});

export default function ContactPage() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-md py-2xl" id="main">
      <h1 className="text-display-m font-display">Contact</h1>
      <p className="mt-lg max-w-[65ch] text-body-m text-muted">
        Contact details pending. Only addresses and profiles intentionally meant to be
        public will be published here (content.md §36).
      </p>
    </main>
  );
}
