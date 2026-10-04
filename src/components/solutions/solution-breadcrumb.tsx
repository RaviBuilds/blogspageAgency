import { Breadcrumb, type BreadcrumbTrailItem } from "@/components/seo/breadcrumb";
import { cn } from "@/lib/utils";

/**
 * The breadcrumb band for every solution route.
 *
 * ## Why this exists
 *
 * The solution route used to render `<Breadcrumb>` in a bare wrapper *above*
 * the page component. That put the trail outside whatever surface the page
 * paints: on the gym page (a `dark` island with its own ink background and hero
 * glow) it sat on the site's light `--background`, so the page read as a light
 * strip followed by a dark page.
 *
 * This band paints **no background of its own**. It is a layout slot that
 * inherits the surface it is rendered in, so each page decides where the
 * breadcrumb lives by where it mounts it:
 *
 * - dark-island pages (gym) pass it into the landing, which renders it *inside*
 *   the island, so it shares the ink background, the hero glow and the `.dark`
 *   token scope (muted / foreground resolve to the dark palette);
 * - light pages (dental, generic template, dental packages) render it directly
 *   in the route, where the surface is the site's own light background.
 *
 * ## Spacing
 *
 * The top padding clears the fixed floating header, which occupies y 16-72. At
 * the previous `pt-6` the trail rendered at y 24-44, i.e. behind the header (the
 * same defect the web-design route documents). `width` lets a page align the
 * trail with the left edge of the hero directly beneath it.
 */
export function SolutionBreadcrumb({
  trail,
  width = "max-w-6xl",
  className,
}: {
  trail: BreadcrumbTrailItem[];
  /** Container width; match the page's hero so the trail shares its left edge. */
  width?: string;
  className?: string;
}) {
  return (
    <div className={cn("relative z-10 mx-auto px-6 pt-20 sm:pt-24 lg:px-8", width, className)}>
      <Breadcrumb trail={trail} />
    </div>
  );
}
