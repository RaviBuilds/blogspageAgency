import { createHighlighter } from "shiki";

const LANG_MAP: Record<string, string> = {
  typescript: "typescript",
  javascript: "javascript",
  tsx: "tsx",
  jsx: "tsx",
  json: "json",
  bash: "bash",
  css: "css",
  html: "html",
  groq: "text",
  sql: "sql",
  yaml: "yaml",
  md: "markdown",
  python: "python",
  text: "text",
};

const BADGE_MAP: Record<string, string> = {
  typescript: "TS",
  javascript: "JS",
  tsx: "TSX",
  jsx: "JSX",
  json: "JSON",
  bash: "Bash",
  css: "CSS",
  html: "HTML",
  groq: "GROQ",
  sql: "SQL",
  yaml: "YAML",
  md: "MD",
  python: "Python",
  text: "TEXT",
};

let highlighter: Awaited<ReturnType<typeof createHighlighter>> | null = null;

async function getHighlighter() {
  if (highlighter) return highlighter;
  highlighter = await createHighlighter({
    themes: ["github-dark-default"],
    langs: [
      "typescript",
      "javascript",
      "tsx",
      "json",
      "bash",
      "css",
      "html",
      "sql",
      "yaml",
      "markdown",
      "python",
      "text",
    ],
  });
  return highlighter;
}

export function resolveLanguage(language: string | undefined): string {
  if (!language) return "text";
  return LANG_MAP[language.toLowerCase()] || "text";
}

export function getBadgeLabel(language: string | undefined): string {
  if (!language) return "CODE";
  return BADGE_MAP[language.toLowerCase()] || language.toUpperCase();
}

export async function highlightCode(
  code: string,
  language: string,
): Promise<string> {
  const lang = resolveLanguage(language);
  const hl = await getHighlighter();
  return hl.codeToHtml(code, {
    lang,
    theme: "github-dark-default",
    transformers: [
      {
        pre(node) {
          const orig = (node.properties.style as string) || "";
          const colorMatch = orig.match(/color:\s*[^;]+/);
          const color = colorMatch ? colorMatch[0] : "color: #e6edf3";
          node.properties.style = `${color}; background-color: transparent; margin: 0; padding: 0; overflow: visible;`;
          node.properties.tabindex = "0";
        },
      },
    ],
  });
}
