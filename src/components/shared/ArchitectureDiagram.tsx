import type { ArchitectureDiagram as Diagram } from "@/types/content";

/**
 * Renders an architecture diagram from structured data (design.md §28).
 *
 * Built from DOM and semantic tokens rather than an image, so it inherits the
 * active theme's palette, borders and radius automatically, reflows on a phone,
 * and is readable by a screen reader — none of which a PNG manages.
 *
 * ACCESSIBILITY: the whole figure carries a caption describing the system in
 * prose, so the diagram is never the only way to understand it. The connector
 * arrows are decorative and hidden; the flows they represent are also listed as
 * text, because an arrow drawn between two boxes conveys nothing when read
 * aloud (design.md §36 — never use a visual alone to convey meaning).
 */
export function ArchitectureDiagram({ diagram }: { diagram: Diagram }) {
  return (
    <figure className="my-lg">
      <div className="grid gap-xs">
        {diagram.layers.map((layer, index) => (
          <div key={layer.label}>
            {index > 0 ? (
              <p aria-hidden="true" className="py-xs text-center text-body-s text-muted">
                ↓
              </p>
            ) : null}

            <div className="rounded-md border border-border bg-surface p-sm">
              <p className="font-mono text-micro tracking-[0.14em] text-muted uppercase">
                {layer.label}
              </p>
              <ul className="mt-xs flex flex-wrap gap-xs">
                {layer.nodes.map((node) => (
                  <li
                    key={node.id}
                    className="min-w-0 flex-1 rounded-sm border border-border bg-surface-secondary px-sm py-xs"
                  >
                    <span className="block text-body-s font-medium">{node.label}</span>
                    {node.detail ? (
                      <span className="block text-caption text-muted">{node.detail}</span>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {diagram.flows.length > 0 ? (
        <div className="mt-md rounded-md border border-border p-sm">
          <p className="font-mono text-micro tracking-[0.14em] text-muted uppercase">Key paths</p>
          <ul className="mt-xs grid gap-xs text-body-s text-muted">
            {diagram.flows.map((flow) => (
              <li key={`${flow.from}-${flow.to}-${flow.label ?? ""}`}>
                <span className="text-foreground">{flow.from}</span>
                <span aria-hidden="true"> → </span>
                <span className="sr-only"> to </span>
                <span className="text-foreground">{flow.to}</span>
                {flow.label ? <span> — {flow.label}</span> : null}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      <figcaption className="mt-sm max-w-[62ch] text-body-s text-muted">
        {diagram.caption}
      </figcaption>
    </figure>
  );
}
