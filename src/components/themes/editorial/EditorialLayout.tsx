import Link from "next/link";

import { ThemeSwitcher } from "@/components/shared/ThemeSwitcher";
import { getAllThemes } from "@/themes/registry";
import { getActiveThemeId } from "@/themes/server";
import type { ThemeLayoutProps } from "@/types/views";

/**
 * Editorial chrome: a quiet top bar and a generous footer. design.md §24 gives
 * this theme minimal top navigation — the page content is meant to dominate.
 *
 * The switcher's MECHANISM is shared; its presentation belongs to the theme
 * (theme.md §18), hence the `segmented` variant design.md §33 specifies here.
 */
export async function EditorialLayout({
  children,
  profile,
  contact,
  navigation,
}: ThemeLayoutProps) {
  const active = await getActiveThemeId();

  return (
    <>
      <header className="sticky top-0 z-20 border-b border-border bg-background/85 backdrop-blur">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-wrap items-center justify-between gap-md px-md py-sm">
          <Link
            href="/"
            className="text-body-m font-display tracking-[-0.02em] whitespace-nowrap"
          >
            {profile.fullName}
          </Link>

          <nav aria-label="Main" className="order-3 w-full lg:order-none lg:w-auto">
            <ul className="flex flex-wrap items-center gap-md text-body-s">
              {navigation.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-muted transition-colors hover:text-foreground">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <ThemeSwitcher themes={getAllThemes()} active={active} variant="segmented" />
        </div>
      </header>

      <div className="mx-auto w-full max-w-[var(--container-max)] flex-1 px-md">{children}</div>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-[var(--container-max)] flex-wrap items-baseline justify-between gap-md px-md py-lg">
          <p className="text-body-s text-muted">
            {profile.fullName} — {profile.title}
          </p>
          {contact.email === null ? (
            <p className="text-body-s text-muted italic">Contact details pending.</p>
          ) : (
            <a
              href={`mailto:${contact.email}`}
              className="text-body-s text-muted hover:text-foreground"
            >
              {contact.email}
            </a>
          )}
        </div>
      </footer>
    </>
  );
}
