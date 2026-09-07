import Image from "next/image";

import type { MediaAsset } from "@/types/content";

/**
 * A project screenshot.
 *
 * Shared because the mechanics are shared and easy to get wrong — `next/image`
 * needs an accurate `sizes` to avoid shipping a desktop-width file to a phone,
 * and the captures are a fixed 16:10 so the frame can reserve space and avoid
 * layout shift (design.md §37).
 *
 * Only the frame is shared; each theme supplies its own border, radius and
 * caption treatment through `className`.
 *
 * `alt` comes from the content layer and is required by the type — a
 * screenshot with no description is not publishable (README §14).
 */
export function ProjectImage({
  asset,
  className = "",
  priority = false,
  sizes = "(min-width: 1024px) 60vw, 100vw",
}: {
  asset: MediaAsset;
  className?: string;
  priority?: boolean;
  sizes?: string;
}) {
  return (
    <figure className={className}>
      <div className="relative aspect-[16/10] w-full overflow-hidden bg-surface-secondary">
        <Image
          src={asset.src}
          alt={asset.alt}
          fill
          sizes={sizes}
          priority={priority}
          className="object-cover object-top"
        />
      </div>
      {asset.caption ? (
        <figcaption className="mt-xs text-caption text-muted">{asset.caption}</figcaption>
      ) : null}
    </figure>
  );
}
