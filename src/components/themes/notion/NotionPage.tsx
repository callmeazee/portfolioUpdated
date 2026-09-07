import type { ReactNode } from "react";

/**
 * A Notion document: emoji page icon, large title, optional description, then
 * blocks. Shared by the home page, the case study and the PageKit so every
 * route reads as a page in the same workspace.
 */
export function NotionDocument({
  icon,
  title,
  description,
  children,
}: {
  icon: string;
  title: string;
  description?: string | null;
  children?: ReactNode;
}) {
  return (
    <main id="main" className="py-xl">
      <p aria-hidden="true" className="text-[3rem] leading-none">
        {icon}
      </p>

      <h1 className="mt-md text-display-m font-display tracking-[-0.02em]">{title}</h1>

      {description === null ? (
        <p className="mt-sm text-body-l text-muted italic">Description pending.</p>
      ) : description ? (
        <p className="mt-sm text-body-l text-muted">{description}</p>
      ) : null}

      <div className="mt-lg pb-2xl">{children}</div>
    </main>
  );
}

export function NotionHeading({ id, children }: { id: string; children: ReactNode }) {
  return (
    <h2 id={id} className="mt-lg mb-sm text-heading-m font-display tracking-[-0.01em]">
      {children}
    </h2>
  );
}
