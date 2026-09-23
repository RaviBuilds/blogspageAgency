import Link from "next/link";

import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbNode, type BreadcrumbItem } from "@/lib/structured-data";

/** One rung of a route's own breadcrumb trail (the site root is not included; see below). */
export type BreadcrumbTrailItem = BreadcrumbItem;

/**
 * Renders the visible breadcrumb trail and the matching `BreadcrumbList` node
 * from one `trail` array, so the two cannot drift apart (Requirement 7.4).
 *
 * `trail` is the route's *own* trail — it does not include the Home rung.
 * `breadcrumbNode` (in `src/lib/structured-data.ts`) prepends a "Home" rung to
 * the JSON-LD automatically whenever the trail's first item isn't already
 * `/`, so this component prepends the identical rung to its own visible
 * render, keeping the two renderings in agreement.
 *
 * The first item is always an anchor to `/`, every ancestor item is an
 * anchor, and the final item renders as text (`aria-current="page"`) rather
 * than a link.
 */
export function Breadcrumb({ trail }: { trail: BreadcrumbTrailItem[] }) {
  const home: BreadcrumbTrailItem = { name: "Home", path: "/" };
  const items =
    trail.length > 0 && trail[0].path === "/" ? trail : [home, ...trail];

  return (
    <>
      <nav aria-label="Breadcrumb" className="text-sm text-muted-foreground">
        <ol className="flex flex-wrap items-center gap-1.5">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;

            return (
              <li key={item.path} className="flex items-center gap-1.5">
                {isLast ? (
                  <span aria-current="page" className="text-foreground">
                    {item.name}
                  </span>
                ) : (
                  <Link
                    href={item.path}
                    className="transition-colors hover:text-foreground"
                  >
                    {item.name}
                  </Link>
                )}
                {!isLast ? (
                  <span aria-hidden className="text-muted-foreground/50">
                    /
                  </span>
                ) : null}
              </li>
            );
          })}
        </ol>
      </nav>
      <JsonLd nodes={[breadcrumbNode(trail)]} />
    </>
  );
}
