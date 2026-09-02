import Link from "next/link";

export default function NotFound() {
  return (
    <main className="mx-auto w-full max-w-[var(--container-max)] px-md py-2xl" id="main">
      <h1 className="text-display-m font-display">Page not found</h1>
      <p className="mt-lg max-w-[65ch] text-body-m text-muted">
        The page you are looking for does not exist or has moved.
      </p>
      <Link
        href="/"
        className="mt-lg inline-block rounded-md bg-accent px-md py-sm font-medium text-accent-foreground"
      >
        Go home
      </Link>
    </main>
  );
}
