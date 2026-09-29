"use client";

/**
 * ACCESS DOORS — the RBAC motif.
 *
 * Three users (Customer / Staff / Admin) entering different doors into one
 * system, per canonical spec §29's "three users enter different system
 * doors" motion direction. Drawn as three labelled entries converging on one
 * shared system node.
 *
 * Real text throughout (a role name is meaningful content, not decoration);
 * only the connecting rails are `aria-hidden`.
 */

import { cn } from "@/lib/utils";

import { RailAcross, RailDrop, SystemNode, useDrawGate } from "./system-nodes";

export function AccessDoors({
  roles,
  systemLabel = "One System",
  accent,
  className,
}: {
  roles: readonly { id: string; label: string }[];
  systemLabel?: string;
  accent: string;
  className?: string;
}) {
  const { ref, settled, drawn } = useDrawGate<HTMLDivElement>("-70px");

  return (
    <div ref={ref} className={cn("flex flex-col items-center", className)}>
      <ul className="grid w-full grid-cols-3 gap-2">
        {roles.map((role) => (
          <li key={role.id}>
            <SystemNode label={role.label} accent={accent} size="compact" className="text-center" />
          </li>
        ))}
      </ul>

      <div aria-hidden className="relative h-8 w-full">
        <div className="absolute inset-x-0 top-0 grid grid-cols-3">
          {roles.map((role, i) => (
            <span key={role.id} className="flex justify-center">
              <RailDrop index={i} accent={accent} settled={settled} drawn={drawn} height="h-4" />
            </span>
          ))}
        </div>
        <div className="absolute inset-x-[16.666%] top-4">
          <RailAcross accent={accent} settled={settled} drawn={drawn} delay={0.45} />
        </div>
        <div className="absolute left-1/2 top-4">
          <RailDrop index={3} accent={accent} settled={settled} drawn={drawn} height="h-4" />
        </div>
      </div>

      <SystemNode label={systemLabel} accent={accent} emphasis size="compact" className="text-center" />
    </div>
  );
}
