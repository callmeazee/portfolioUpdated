/**
 * Emits a JSON-LD block.
 *
 * `JSON.stringify` output is escaped for `<` so a value containing `</script>`
 * cannot break out of the tag. Nothing in the content layer contains markup
 * today, but structured data is exactly where an injected string would do the
 * most damage.
 */
export function JsonLd({ data }: { data: object | null }) {
  if (data === null) return null;

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data).replace(/</g, "\\u003c"),
      }}
    />
  );
}
