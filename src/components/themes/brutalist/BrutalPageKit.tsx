import Link from "next/link";
import type { ReactNode } from "react";

import type {
  KitCardProps,
  KitDefinitionListProps,
  KitPageProps,
  KitSectionProps,
  ThemePageKit,
} from "@/types/views";

import { BrutalButton, BrutalEmpty, BrutalLabel } from "./BrutalPrimitives";

/** Brutalist primitives for the generic routes (ADR-018). */

function Page({ title, intro, children }: KitPageProps) {
  return (
    <main id="main" className="py-xl">
      <h1 className="font-display text-display-m leading-[0.9] font-bold uppercase tracking-[-0.03em]">
        {title}
      </h1>
      {intro ? <p className="mt-md max-w-[50ch] text-body-l font-medium">{intro}</p> : null}
      {children}
    </main>
  );
}

function Section({ id, title, children }: KitSectionProps) {
  return (
    <section aria-labelledby={id} className="border-t-2 border-foreground py-lg">
      <h2 id={id}>
        <BrutalLabel>{title}</BrutalLabel>
      </h2>
      <div className="mt-md">{children}</div>
    </section>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="grid max-w-[58ch] gap-md">
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
        <span className="block font-mono text-micro font-bold uppercase">{eyebrow}</span>
      ) : null}
      <span className="mt-xs block font-display text-heading-l leading-[0.95] font-bold uppercase tracking-[-0.02em]">
        {title}
      </span>
      {description === null ? (
        <span className="mt-sm block text-body-m italic">Description pending.</span>
      ) : description ? (
        <span className="mt-sm block text-body-m">{description}</span>
      ) : null}
      {meta ? (
        <span className="mt-sm inline-block border-2 border-foreground px-xs py-0 text-micro font-bold uppercase">
          {meta}
        </span>
      ) : null}
    </>
  );

  return (
    <li className="mb-md">
      {href ? (
        <Link
          href={href}
          className="block border-2 border-foreground bg-surface p-md shadow-(--shadow-md) transition-[transform,box-shadow] duration-(--duration-fast) hover:-translate-x-[3px] hover:-translate-y-[3px] hover:shadow-(--shadow-lg) active:translate-x-[3px] active:translate-y-[3px] active:shadow-none motion-reduce:transform-none motion-reduce:transition-none"
        >
          {body}
        </Link>
      ) : (
        <div className="border-2 border-foreground bg-surface p-md">{body}</div>
      )}
    </li>
  );
}

function DefinitionList({ items }: KitDefinitionListProps) {
  return (
    <dl className="grid gap-0 border-2 border-foreground">
      {items.map((item, index) => (
        <div
          key={item.term}
          /* Stacks below `sm`: a 9rem label column left too little room for a
             URL at 360px, pushing the page 89px wide. */
          className={`grid gap-xs p-sm sm:grid-cols-[9rem_1fr] sm:gap-md ${
            index > 0 ? "border-t-2 border-foreground" : ""
          }`}
        >
          <dt className="text-body-s font-bold uppercase">{item.term}</dt>
          <dd className="min-w-0 text-body-m break-words">{item.description}</dd>
        </div>
      ))}
    </dl>
  );
}

function Action({ href, children, external = false }: { href: string; children: ReactNode; external?: boolean }) {
  return (
    <BrutalButton href={href} external={external} tone="accent">
      {children}
    </BrutalButton>
  );
}

export const brutalistPageKit: ThemePageKit = {
  Page,
  Section,
  Prose,
  Card,
  DefinitionList,
  Empty: BrutalEmpty,
  Action,
};
