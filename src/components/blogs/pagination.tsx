import Link from "next/link";

export type PaginationProps = {
  currentPage: number;
  totalPages: number;
  /**
   * Archive root without a trailing page segment, e.g. `/blogs`,
   * `/blogs/category/tutorials`, `/blogs/author/jane-doe`. Page 1 links to
   * `basePath` itself; page N > 1 links to `${basePath}/page/${N}`.
   */
  basePath: string;
};

function pageHref(basePath: string, page: number): string {
  return page <= 1 ? basePath : `${basePath}/page/${page}`;
}

/**
 * Renders every page target as a real crawlable `<a href>` via `next/link`
 * (which renders a real anchor server-side), so the full page set is
 * discoverable without client-side interaction.
 */
export function Pagination({ currentPage, totalPages, basePath }: PaginationProps) {
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <nav aria-label="Pagination" className="mt-12 flex items-center justify-center gap-2">
      {currentPage > 1 ? (
        <Link
          href={pageHref(basePath, currentPage - 1)}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          Previous
        </Link>
      ) : null}

      <ul className="flex items-center gap-1.5">
        {pages.map((page) => {
          const isCurrent = page === currentPage;

          return (
            <li key={page}>
              <Link
                href={pageHref(basePath, page)}
                aria-current={isCurrent ? "page" : undefined}
                className={
                  isCurrent
                    ? "flex h-8 w-8 items-center justify-center rounded-md border border-primary bg-primary text-sm font-medium text-primary-foreground"
                    : "flex h-8 w-8 items-center justify-center rounded-md border border-border text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
                }
              >
                {page}
              </Link>
            </li>
          );
        })}
      </ul>

      {currentPage < totalPages ? (
        <Link
          href={pageHref(basePath, currentPage + 1)}
          className="rounded-md border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:border-primary hover:text-foreground"
        >
          Next
        </Link>
      ) : null}
    </nav>
  );
}
