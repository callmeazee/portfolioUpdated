import type { Project } from "@/types/content";

/**
 * A ticker carrying real portfolio data — project names, categories and any
 * verified stack entries. Nothing invented to pad the strip: if the content
 * layer is thin, the marquee is short.
 *
 * Server-rendered: the loop is a CSS keyframe, so this needs no JavaScript.
 *
 * ACCESSIBILITY: the whole strip is `aria-hidden` and clipped rather than
 * scrollable. An axe audit flagged the earlier version under
 * `scrollable-region-focusable` — it had `overflow-x: auto` but nothing
 * focusable inside, so a keyboard user could never scroll it (WCAG 2.1.1).
 *
 * Hiding it is the honest fix rather than adding a tab stop: this is decorative
 * repetition. Every name in it is a real link in the navigation and the project
 * grid, so nothing is lost, and a screen reader is spared the duplicate.
 */
export function BrutalMarquee({ projects }: { projects: Project[] }) {
  const items = projects.flatMap((project) => [
    project.title.toUpperCase(),
    project.category.toUpperCase(),
    ...project.technologies.flatMap((group) => group.items.map((item) => item.toUpperCase())),
  ]);

  if (items.length === 0) return null;

  const strip = () => (
    <ul className="flex shrink-0 items-center gap-lg px-lg text-body-m font-bold tracking-[0.08em] whitespace-nowrap">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-center gap-lg">
          {item}
          <span aria-hidden="true">◆</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div
      aria-hidden="true"
      className="overflow-hidden border-y-2 border-foreground bg-accent py-xs text-accent-foreground"
    >
      {/* The track renders its content twice so the CSS loop is seamless. */}
      <div className="brutal-marquee-track flex w-max">
        {strip()}
        {strip()}
      </div>
    </div>
  );
}
