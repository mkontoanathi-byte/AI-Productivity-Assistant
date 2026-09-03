import { useState } from "react";
import { Linkedin, Instagram, Music2, Twitter } from "lucide-react";
import { cn } from "@/lib/utils";

export const PLATFORMS = [
  { id: "linkedin", label: "LinkedIn", icon: Linkedin, connected: true },
  { id: "instagram", label: "Instagram", icon: Instagram, connected: true },
  { id: "tiktok", label: "TikTok", icon: Music2, connected: true },
  { id: "x", label: "X", icon: Twitter, connected: false },
] as const;

export function ConnectedPlatforms({ compact = false }: { compact?: boolean }) {
  const [state, setState] = useState<Record<string, boolean>>(
    Object.fromEntries(PLATFORMS.map((p) => [p.id, p.connected])),
  );

  return (
    <div className={cn("rounded-2xl border border-border bg-card/70 p-3", compact && "p-3")}>
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Connected platforms
      </p>
      <ul className="mt-2 flex flex-col gap-1">
        {PLATFORMS.map(({ id, label, icon: Icon }) => {
          const on = state[id];
          return (
            <li key={id}>
              <button
                type="button"
                role="switch"
                aria-checked={on}
                onClick={() => setState((p) => ({ ...p, [id]: !p[id] }))}
                className="focus-ring grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl px-2 py-2 text-left transition-colors duration-200 hover:bg-lime/60"
              >
                <Icon className="h-4 w-4 shrink-0" />
                <span className="min-w-0">
                  <span className="block truncate text-xs font-semibold">{label}</span>
                  <span className="block text-[0.65rem] text-muted-foreground">
                    {on ? "Active" : "Disconnected"}
                  </span>
                </span>
                <span
                  className={cn(
                    "relative h-5 w-9 shrink-0 rounded-full transition-colors duration-200",
                    on ? "bg-terracotta" : "bg-blue",
                  )}
                >
                  <span
                    className={cn(
                      "absolute top-0.5 h-4 w-4 rounded-full bg-card shadow-soft transition-all duration-200",
                      on ? "left-[1.15rem]" : "left-0.5",
                    )}
                  />
                </span>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
