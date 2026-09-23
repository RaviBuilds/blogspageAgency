/**
 * Renders the Structured_Data_Layer's node array as JSON-LD.
 *
 * One `<script type="application/ld+json">` per node, each carrying its own
 * `@context` and `@type` — never a `@graph` wrapper. Requirements 5.8 and
 * 13.2 both require every emitted block to declare a `@type`, and a `@graph`
 * envelope has no top-level `@type`, so the array is rendered as sibling
 * scripts instead. Cross-node links stay {@link NodeRef} references produced
 * by the builders in `src/lib/structured-data.ts`; this component only
 * serialises what it is given.
 *
 * Server component: no hooks, no client directive, safe to render from any
 * server component or layout.
 */

import type { JsonLdNode } from "@/lib/structured-data";

export type JsonLdProps = {
  nodes: JsonLdNode[];
};

export function JsonLd({ nodes }: JsonLdProps) {
  return (
    <>
      {nodes.map((node, index) => (
        <script
          key={typeof node["@id"] === "string" ? node["@id"] : index}
          type="application/ld+json"
          // JSON-LD must be inlined as raw script content; React would
          // otherwise HTML-escape the JSON text.
          dangerouslySetInnerHTML={{ __html: JSON.stringify(node) }}
        />
      ))}
    </>
  );
}
