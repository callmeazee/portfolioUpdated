import type { Project } from "@/types/content";

/**
 * A ticker carrying real portfolio data — project names, categories and any
 * verified stack entries. Nothing invented to pad the strip: if the content
 * layer is thin, the marquee is short.
 *
 * Server-rendered: the loop is a CSS keyframe, so this needs no JavaScript.
 * The duplicated track is what makes the loop seamless; the copy is
 * `aria-hidden` so a screen reader hears the list once.
 */
export function BrutalMarquee({ projects }: { projects: Project[] }) {
  const items = projects.flatMap((project) => [
    project.title.toUpperCase(),
    project.category.toUpperCase(),
    ...project.technologies.flatMap((group) => group.items.map((item) => item.toUpperCase())),
  ]);

  if (items.length === 0) return null;

  const strip = (hidden: boolean) => (
    <ul
      aria-hidden={hidden || undefined}
      className="flex shrink-0 items-center gap-lg px-lg text-body-m font-bold tracking-[0.08em] whitespace-nowrap"
    >
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex items-center gap-lg">
          {item}
          <span aria-hidden="true">◆</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="overflow-x-auto border-y-2 border-foreground bg-accent py-xs text-accent-foreground">
      <div className="brutal-marquee-track flex w-max">
        {strip(false)}
        {strip(true)}
      </div>
    </div>
  );
}
