import Link from "next/link";
import type { ReactNode } from "react";

import type {
  KitCardProps,
  KitDefinitionListProps,
  KitPageProps,
  KitSectionProps,
  ThemePageKit,
} from "@/types/views";

import { NotionProperties, NotionTag } from "./NotionBlocks";
import { NotionDocument, NotionHeading } from "./NotionPage";

/** Notion's primitives for the generic routes (ADR-018). */

const ICONS: Record<string, string> = {
  Projects: "📁",
  Experience: "💼",
  Engineering: "🛠",
  About: "👤",
  Notes: "📝",
  Contact: "✉️",
  Résumé: "📄",
};

function Page({ title, intro, children }: KitPageProps) {
  return (
    <NotionDocument icon={ICONS[title] ?? "📄"} title={title} description={intro}>
      {children}
    </NotionDocument>
  );
}

function Section({ id, title, children }: KitSectionProps) {
  return (
    <section aria-labelledby={id}>
      <NotionHeading id={id}>{title}</NotionHeading>
      {children}
    </section>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="grid gap-md">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="text-body-m leading-[1.75]">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

/** A database-style row rather than a card — Notion lists pages, not tiles. */
function Card({ href, eyebrow, title, description, meta }: KitCardProps) {
  const body = (
    <>
      <span className="flex items-center gap-sm">
        <span aria-hidden="true" className="text-muted">
          📄
        </span>
        <span className="text-body-m font-medium underline-offset-2 group-hover:underline">
          {title}
        </span>
        {meta ? <NotionTag>{meta}</NotionTag> : null}
      </span>
      {description === null ? (
        <span className="mt-xs block pl-lg text-body-s text-muted italic">
          Description pending.
        </span>
      ) : description ? (
        <span className="mt-xs block pl-lg text-body-s text-muted">{description}</span>
      ) : null}
      {eyebrow ? <span className="sr-only">{eyebrow}</span> : null}
    </>
  );

  return (
    <li className="group border-b border-border py-sm">
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
    <NotionProperties
      items={items.map((item) => ({ label: item.term, value: item.description }))}
    />
  );
}

function Empty({ children }: { children: ReactNode }) {
  return (
    <p className="rounded-md border border-border bg-surface-secondary p-md text-body-m text-muted italic">
      {children}
    </p>
  );
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
    "inline-flex items-center gap-xs rounded-sm border border-border bg-surface px-md py-sm text-body-s font-medium hover:bg-surface-secondary";

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

export const notionPageKit: ThemePageKit = {
  Page,
  Section,
  Prose,
  Card,
  DefinitionList,
  Empty,
  Action,
};
