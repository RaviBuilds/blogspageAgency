import { highlightCode, getBadgeLabel } from "@/lib/highlight";
import { CopyButton } from "./CopyButton";

type CodeBlockProps = {
  language?: string;
  code?: string;
  filename?: string;
};

export async function CodeBlock({ language, code, filename }: CodeBlockProps) {
  if (!code) return null;

  const badgeLabel = getBadgeLabel(language);
  const highlightedHtml = await highlightCode(code, language || "text");

  return (
    <div
      className="not-prose my-8 overflow-hidden rounded-2xl border border-white/[0.08] bg-[#0d0d12] shadow-lg"
      role="region"
      aria-label={`Code snippet${language ? ` in ${badgeLabel}` : ""}`}
    >
      <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-2">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center rounded-md border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 font-mono text-[11px] font-medium leading-5 text-muted-foreground">
            {badgeLabel}
          </span>
          {filename ? (
            <span className="font-mono text-xs text-muted-foreground">
              {filename}
            </span>
          ) : null}
        </div>
        <CopyButton code={code} />
      </div>
      <div
        className="overflow-x-auto p-4 text-sm leading-relaxed font-mono"
        dangerouslySetInnerHTML={{ __html: highlightedHtml }}
      />
    </div>
  );
}
