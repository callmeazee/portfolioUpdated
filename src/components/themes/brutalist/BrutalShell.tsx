import Link from "next/link";

import type { ThemeShellProps } from "@/types/views";

import { BrutalCursor } from "./BrutalCursor";
import { BrutalMarquee } from "./BrutalMarquee";

/**
 * Brutalist chrome (theme.md §8, design.md §20).
 *
 * Bracketed navigation and a large bold theme selector, per design.md §§24 and
 * 33. The selector is built from relative `?theme=` anchors so switching away
 * never requires JavaScript — the same rule every other theme follows.
 *
 * Almost all of this is server-rendered: the press, hover displacement and the
 * marquee are CSS. Only the cursor follower is a client component.
 */
export function BrutalShell({
  children,
  profile,
  contact,
  navigation,
  projects,
  activeTheme,
  themes,
}: ThemeShellProps) {
  return (
    <>
      <BrutalCursor />

      <header className="border-b-2 border-foreground">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-wrap items-center justify-between gap-md px-md py-md">
          <Link
            href="/"
            className="font-display text-heading-m leading-[0.9] font-bold uppercase tracking-[-0.03em]"
          >
            {profile.displayName}
          </Link>

          <nav aria-label="Main">
            <ul className="flex flex-wrap items-center gap-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="inline-block border-2 border-transparent px-xs py-0 text-body-s font-bold uppercase hover:border-foreground"
                  >
                    [{item.label}]
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          {/* design.md §33 — a large bold selector, working without JavaScript. */}
          <nav aria-label="Theme" className="flex flex-wrap gap-xs">
            {themes.map((theme) => (
              <a
                key={theme.id}
                href={`?theme=${theme.id}`}
                aria-current={theme.id === activeTheme ? "true" : undefined}
                className={`border-2 border-foreground px-sm py-xs text-micro font-bold uppercase transition-transform duration-(--duration-fast) active:translate-x-[2px] active:translate-y-[2px] motion-reduce:transform-none ${
                  theme.id === activeTheme
                    ? "bg-foreground text-background"
                    : "bg-surface hover:bg-surface-secondary"
                }`}
              >
                {theme.name}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <BrutalMarquee projects={projects} />

      <div className="mx-auto w-full max-w-[var(--container-max)] flex-1 px-md">{children}</div>

      <footer className="border-t-2 border-foreground bg-foreground text-background">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-wrap items-center justify-between gap-md px-md py-lg">
          <p className="font-display text-heading-m font-bold uppercase leading-[0.95]">
            {profile.fullName}
          </p>
          {contact.email === null ? (
            <p className="text-body-m font-bold uppercase">Contact pending</p>
          ) : (
            <a href={`mailto:${contact.email}`} className="text-body-m font-bold underline">
              {contact.email}
            </a>
          )}
        </div>
      </footer>
    </>
  );
}
