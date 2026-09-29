"use client";

/**
 * MULTI-TENANT — one platform, logically separated businesses.
 *
 * One shared platform node fanning out to N tenant nodes, each in its own
 * bordered cell so "separated data" is visible in the layout itself rather
 * than only stated in the caption.
 */

import { cn } from "@/lib/utils";

import { RailAcross, RailDrop, SystemNode, useDrawGate } from "./system-nodes";

export function MultiTenant({
  platformLabel,
  tenants,
  accent,
  className,
}: {
  platformLabel: string;
  tenants: readonly { id: string; label: string }[];
  accent: string;
  className?: string;
}) {
  const { ref, settled, drawn } = useDrawGate<HTMLDivElement>("-70px");

  return (
    <div ref={ref} className={cn("flex flex-col items-center", className)}>
      <SystemNode label={platformLabel} accent={accent} emphasis size="compact" className="text-center" />

      <div aria-hidden className="relative h-8 w-full">
        <div className="absolute left-1/2 top-0">
          <RailDrop index={0} accent={accent} settled={settled} drawn={drawn} height="h-4" />
        </div>
        <div className="absolute inset-x-[16.666%] top-4">
          <RailAcross accent={accent} settled={settled} drawn={drawn} delay={0.3} />
        </div>
        <div className="absolute inset-x-0 top-4 grid grid-cols-3">
          {tenants.map((tenant, i) => (
            <span key={tenant.id} className="flex justify-center">
              <RailDrop index={i + 1} accent={accent} settled={settled} drawn={drawn} height="h-4" />
            </span>
          ))}
        </div>
      </div>

      <ul className="grid w-full grid-cols-3 gap-2">
        {tenants.map((tenant) => (
          <li key={tenant.id}>
            <SystemNode label={tenant.label} accent={accent} size="compact" className="text-center" />
          </li>
        ))}
      </ul>
      <p className="mt-3 text-center text-xs leading-snug text-muted-foreground">
        Each business&apos;s data stays logically separated.
      </p>
    </div>
  );
}
