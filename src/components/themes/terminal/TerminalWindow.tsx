import type { ReactNode } from "react";

/**
 * macOS window chrome (design.md §19).
 *
 * The traffic lights are `aria-hidden` because they are exactly what design.md
 * §19 says they may be — decorative, since they perform no real function here.
 * Announcing three unlabelled circles to a screen reader would be noise, and
 * making them look actionable when they are not would be a fake interaction
 * (CLAUDE.md §39).
 *
 * Their colours come from the semantic danger/warning/success tokens rather
 * than hard-coded macOS hexes, so the chrome stays consistent with the palette.
 */
export function TerminalWindow({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`overflow-hidden rounded-md border border-border bg-surface ${className}`}
    >
      <div className="flex items-center gap-sm border-b border-border bg-surface-secondary px-md py-sm">
        <span aria-hidden="true" className="flex shrink-0 gap-xs">
          <span className="block size-[0.7rem] rounded-full bg-danger" />
          <span className="block size-[0.7rem] rounded-full bg-warning" />
          <span className="block size-[0.7rem] rounded-full bg-success" />
        </span>
        <p className="truncate font-mono text-caption text-muted">{title}</p>
      </div>
      <div className="p-md sm:p-lg">{children}</div>
    </div>
  );
}

/**
 * A shell prompt line used as a section heading.
 *
 * The visible text is the terminal metaphor; the `sr-only` span carries the
 * real section name. Screen-reader users get "Selected work", sighted users get
 * `$ ls projects`, and the heading level stays correct either way — theme.md
 * §7.5 requires the content be reachable without terminal literacy.
 */
export function PromptHeading({
  id,
  command,
  label,
  cwd = "~",
  level = 2,
}: {
  id: string;
  command: string;
  label: string;
  cwd?: string;
  /**
   * Every page needs exactly one `h1` (README §14). The terminal homepage shipped
   * with none — its sections were all `h2` prompts — so the top prompt renders as
   * the `h1` and carries the page's real name in its screen-reader label.
   */
  level?: 1 | 2;
}) {
  const Tag = level === 1 ? "h1" : "h2";

  return (
    <Tag id={id} className="font-mono text-body-s font-normal">
      <span aria-hidden="true">
        <span className="text-muted">azeez@portfolio</span>{" "}
        <span className="text-accent">{cwd}</span> <span className="text-muted">%</span>{" "}
        <span className="text-foreground">{command}</span>
      </span>
      <span className="sr-only">{label}</span>
    </Tag>
  );
}

/** Output block beneath a prompt. Indented like real shell output. */
export function TerminalOutput({ children }: { children: ReactNode }) {
  return <div className="mt-sm mb-lg border-l border-border pl-md">{children}</div>;
}

export function TerminalPending({ children }: { children: ReactNode }) {
  return <p className="font-mono text-body-s text-muted italic">{children}</p>;
}
