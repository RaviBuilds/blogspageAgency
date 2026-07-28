/**
 * Skip-navigation link. Visually hidden until keyboard-focused, at which
 * point it becomes the first focus stop on every page and jumps straight to
 * the shared `<main id="main">` landmark rendered by `(site)/layout.tsx`,
 * letting keyboard/screen-reader users bypass the navbar on every page load.
 */
export function SkipLink() {
  return (
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-foreground focus:outline-2 focus:outline-offset-2 focus:outline-primary"
    >
      Skip to main content
    </a>
  );
}
