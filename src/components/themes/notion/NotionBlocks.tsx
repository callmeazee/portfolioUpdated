"use client";

import { Check, ChevronRight, Copy, Info } from "lucide-react";
import { useState, type ReactNode } from "react";

/**
 * Notion's block vocabulary, rebuilt (ADR-015).
 *
 * Behaviour is replicated faithfully; the assets are original — Lucide icons
 * and open font stacks, since Notion's icon set and fonts cannot ship.
 *
 * DELIBERATELY ABSENT: block drag handles and the slash menu. Both imply
 * editing this page cannot do, and a handle that reorders nothing is exactly
 * the fake interaction CLAUDE.md §39 prohibits.
 */

export function NotionCallout({
  children,
  tone = "info",
}: {
  children: ReactNode;
  tone?: "info" | "warning";
}) {
  return (
    <aside
      className={`my-md flex gap-sm rounded-md border p-md text-body-m ${
        tone === "warning"
          ? "border-warning/40 bg-warning/10"
          : "border-border bg-surface-secondary"
      }`}
    >
      <Info size={18} aria-hidden="true" className="mt-[0.15rem] shrink-0 text-muted" />
      <div className="min-w-0">{children}</div>
    </aside>
  );
}

/**
 * A toggle list. Native `<details>` rather than a hand-rolled disclosure: it is
 * keyboard operable and announced correctly with no state machine to get wrong,
 * and it still works before hydration.
 */
export function NotionToggle({
  summary,
  children,
  defaultOpen = false,
}: {
  summary: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) {
  return (
    <details open={defaultOpen} className="group my-xs border-b border-border/60 py-xs">
      <summary className="flex cursor-pointer list-none items-center gap-xs rounded-sm py-xs text-body-m font-medium hover:bg-surface-secondary">
        <ChevronRight
          size={16}
          aria-hidden="true"
          className="shrink-0 text-muted transition-transform group-open:rotate-90"
        />
        {summary}
      </summary>
      <div className="pt-xs pl-lg">{children}</div>
    </details>
  );
}

export function NotionQuote({ children }: { children: ReactNode }) {
  return (
    <blockquote className="my-md border-l-2 border-foreground pl-md text-body-l">
      {children}
    </blockquote>
  );
}

export function NotionDivider() {
  return <hr className="my-lg border-0 border-t border-border" />;
}

/** A code block whose copy button genuinely copies. */
export function NotionCode({ code, language }: { code: string; language?: string }) {
  const [copied, setCopied] = useState(false);

  async function copy() {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      /* Clipboard blocked — the code is still selectable by hand. */
    }
  }

  return (
    <figure className="my-md overflow-hidden rounded-md border border-border bg-surface-secondary">
      <figcaption className="flex items-center justify-between border-b border-border px-md py-xs">
        <span className="font-mono text-micro text-muted">{language ?? "text"}</span>
        <button
          type="button"
          onClick={copy}
          className="flex items-center gap-xs rounded-sm px-xs py-0 font-mono text-micro text-muted hover:text-foreground"
        >
          {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
          {copied ? "Copied" : "Copy"}
        </button>
      </figcaption>
      <pre className="overflow-x-auto p-md font-mono text-body-s">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

/** Notion's page-property table: a label column and a value column. */
export function NotionProperties({
  items,
}: {
  items: ReadonlyArray<{ label: string; value: ReactNode }>;
}) {
  return (
    <dl className="my-md grid gap-xs">
      {items.map((item) => (
        <div key={item.label} className="grid grid-cols-[8rem_1fr] items-baseline gap-md">
          <dt className="text-body-s text-muted">{item.label}</dt>
          <dd className="text-body-m">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A pill, used for tags and status values. */
export function NotionTag({ children }: { children: ReactNode }) {
  return (
    <span className="inline-block rounded-sm bg-surface-secondary px-xs py-0 text-body-s text-muted">
      {children}
    </span>
  );
}
