import Link from "next/link";
import type { ReactNode } from "react";

import type {
  KitCardProps,
  KitDefinitionListProps,
  KitPageProps,
  KitSectionProps,
  ThemePageKit,
} from "@/types/views";

import { PromptHeading, TerminalOutput, TerminalPending } from "./TerminalWindow";

/**
 * Terminal's primitives for the generic routes (ADR-018).
 *
 * Reuses `PromptHeading`, so these pages keep the same dual-layer heading
 * contract as the homepage: the prompt is the visible metaphor, an `sr-only`
 * span carries the real section name (theme.md §7.5).
 */

/** `cd about` reads more like a shell than the raw route would. */
function commandFor(title: string) {
  return `cat ${title.toLowerCase().replace(/\s+/g, "-")}`;
}

function Page({ title, intro, children }: KitPageProps) {
  return (
    /* MacWindow supplies the chrome; this renders only the session content. */
    <main id="main" className="p-md sm:p-lg">
      <>
        <h1 className="font-mono text-heading-m font-normal">
          <span aria-hidden="true" className="text-muted">
            azeez@portfolio ~ %{" "}
          </span>
          <span>{commandFor(title)}</span>
          <span className="sr-only">{title}</span>
        </h1>

        {intro ? <p className="mt-md max-w-[62ch] text-body-m text-muted">{intro}</p> : null}

        <div className="mt-lg">{children}</div>
      </>
    </main>
  );
}

function Section({ id, title, children }: KitSectionProps) {
  return (
    <>
      <PromptHeading id={id} command={commandFor(title)} label={title} />
      <TerminalOutput>{children}</TerminalOutput>
    </>
  );
}

function Prose({ paragraphs }: { paragraphs: string[] }) {
  return (
    <div className="grid max-w-[62ch] gap-sm">
      {paragraphs.map((paragraph, i) => (
        <p key={i} className="text-body-m">
          {paragraph}
        </p>
      ))}
    </div>
  );
}

function Card({ href, eyebrow, title, description, meta }: KitCardProps) {
  const body = (
    <div className="grid gap-xs sm:grid-cols-[16rem_1fr] sm:gap-md">
      <span className={href ? "text-accent group-hover:underline" : ""}>
        {eyebrow ? `${eyebrow}/` : title}
      </span>
      <span className="text-muted">
        {description === null ? <em>description pending</em> : (description ?? title)}
        {meta ? <span className="block text-micro">{meta}</span> : null}
      </span>
    </div>
  );

  return (
    <li className="group font-mono text-body-s">
      {href ? <Link href={href}>{body}</Link> : body}
    </li>
  );
}

function DefinitionList({ items }: KitDefinitionListProps) {
  return (
    <dl className="grid gap-xs font-mono text-body-s">
      {items.map((item) => (
        <div key={item.term} className="grid gap-xs sm:grid-cols-[12rem_1fr] sm:gap-md">
          <dt className="text-muted">{item.term.toLowerCase()}</dt>
          <dd className="min-w-0 break-words">{item.description}</dd>
        </div>
      ))}
    </dl>
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
  const className = "font-mono text-body-s text-accent hover:underline";

  return external ? (
    <a href={href} target="_blank" rel="noreferrer noopener" className={className}>
      {children} →
    </a>
  ) : (
    <Link href={href} className={className}>
      ./{children}
    </Link>
  );
}

export const terminalPageKit: ThemePageKit = {
  Page,
  Section,
  Prose,
  Card,
  DefinitionList,
  Empty: TerminalPending,
  Action,
};
