import Link from "next/link";
import type { ReactNode } from "react";

import type {
  KitCardProps,
  KitDefinitionListProps,
  KitPageProps,
  KitSectionProps,
  ThemePageKit,
} from "@/types/views";

/**
 * Editorial's primitives for the generic routes (ADR-018).
 *
 * The rhythm matches the homepage sections deliberately — mono uppercase
 * labels, hairline rules, one wide measure — so `/experience` reads as the same
 * publication as `/`, rather than a differently-styled page that happens to
 * share a header.
 */

function Page({ title, intro, children }: KitPageProps) {
  return (
    <main id="main" className="py-xl">
      <h1 className="text-display-m font-display tracking-[-0.03em]">{title}</h1>
      {intro ? <p className="mt-md max-w-[55ch] text-body-l text-muted">{intro}</p> : null}
      {children}
    </main>
  );
}

function Section({ id, title, children, compact = false }: KitSectionProps) {
  return (
    <section
      className={`border-t border-border ${compact ? "py-lg" : "py-xl"}`}
      aria-labelledby={id}
    >
      <div className="grid gap-md lg:grid-cols-12">
        <h2
          id={id}
          className="font-mono text-caption tracking-[0.18em] text-muted uppercase lg:col-span-3"
        >
          {title}
        </h2>
        <div className="lg:col-span-8 lg:col-start-5">{children}</div>
      </div>
    </section>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="grid max-w-[62ch] gap-md">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="text-body-l">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Card({ href, eyebrow, title, description, meta }: KitCardProps) {
  const body = (
    <>
      {eyebrow ? (
        <p className="font-mono text-micro tracking-[0.14em] text-muted uppercase">{eyebrow}</p>
      ) : null}
      <h3 className="mt-xs text-heading-m font-display tracking-[-0.02em] transition-colors group-hover:text-accent">
        {title}
      </h3>
      {description === null ? (
        <p className="mt-xs text-body-m text-muted italic">Description pending.</p>
      ) : description ? (
        <p className="mt-xs max-w-[55ch] text-body-m text-muted">{description}</p>
      ) : null}
      {meta ? <p className="mt-sm font-mono text-caption text-muted">{meta}</p> : null}
    </>
  );

  return (
    <li className="group border-t border-border py-lg">
      {href ? (
        <Link href={href} className="block">
          {body}
        </Link>
      ) : (
        body
      )}
    </li>
  );
}

function DefinitionList({ items }: KitDefinitionListProps) {
  return (
    <dl className="grid gap-md sm:grid-cols-2">
      {items.map((item) => (
        <div key={item.term} className="border-t border-border pt-sm">
          <dt className="font-mono text-micro tracking-[0.14em] text-muted uppercase">
            {item.term}
          </dt>
          <dd className="mt-xs text-body-m">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

function Empty({ children }: { children: ReactNode }) {
  return <p className="text-body-m text-muted italic">{children}</p>;
}

function Action({
  href,
  children,
  external = false,
}: {
  href: string;
  children: ReactNode;
  external?: boolean;
}) {
  const className =
    "inline-block rounded-md bg-accent px-md py-sm text-body-s font-medium text-accent-foreground transition-opacity hover:opacity-90";

  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
      {children}
    </a>
  ) : (
    <Link href={href} className={className}>
      {children}
    </Link>
  );
}

export const editorialPageKit: ThemePageKit = {
  Page,
  Section,
  Prose,
  Card,
  DefinitionList,
  Empty,
  Action,
};
