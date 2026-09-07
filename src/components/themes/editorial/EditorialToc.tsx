"use client";

import { useEffect, useState } from "react";

/**
 * Case-study table of contents with scroll-spy.
 *
 * This one earns its JavaScript, unlike the reveals: knowing where you are in a
 * long case study is functional navigation, not decoration. It uses an
 * IntersectionObserver rather than a scroll listener, so it costs nothing per
 * frame.
 *
 * Progressive: the links are ordinary anchors that work before hydration and
 * with JavaScript disabled. Only the "currently reading" highlight needs the
 * observer.
 */
export function EditorialToc({
  sections,
}: {
  sections: ReadonlyArray<{ id: string; label: string }>;
}) {
  const [active, setActive] = useState<string | null>(null);

  useEffect(() => {
    const elements = sections
      .map((section) => document.getElementById(section.id))
      .filter((element): element is HTMLElement => element !== null);

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id);
      },
      /* Bias towards the upper third, so the heading you are reading wins. */
      { rootMargin: "-10% 0px -70% 0px", threshold: 0 },
    );

    for (const element of elements) observer.observe(element);
    return () => observer.disconnect();
  }, [sections]);

  if (sections.length === 0) return null;

  return (
    <nav aria-label="On this page" className="sticky top-lg hidden lg:block">
      <p className="font-mono text-micro tracking-[0.14em] text-muted uppercase">On this page</p>
      <ul className="mt-sm grid gap-xs">
        {sections.map((section) => (
          <li key={section.id}>
            <a
              href={`#${section.id}`}
              aria-current={active === section.id ? "location" : undefined}
              className={`block border-l-2 py-0 pl-sm text-body-s transition-colors ${
                active === section.id
                  ? "border-accent text-foreground"
                  : "border-border text-muted hover:text-foreground"
              }`}
            >
              {section.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
