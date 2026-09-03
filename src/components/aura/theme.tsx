import { useEffect, useState } from "react";
import { Palette } from "lucide-react";
import { cn } from "@/lib/utils";

export const THEMES = [
  { id: "candy", label: "Cotton Candy Spice", swatch: ["#E5CBCC", "#EFEDE8", "#DB9E83"] },
  { id: "stone", label: "Minimalist Stone", swatch: ["#E5E5E5", "#F7F7F7", "#A3A3A3"] },
  { id: "midnight", label: "Midnight Executive", swatch: ["#1E293B", "#0F172A", "#38BDF8"] },
] as const;

export type ThemeId = (typeof THEMES)[number]["id"];

const KEY = "aura-theme";

export function useTheme() {
  const [theme, setTheme] = useState<ThemeId>("candy");

  useEffect(() => {
    const stored = window.localStorage.getItem(KEY) as ThemeId | null;
    if (stored && THEMES.some((t) => t.id === stored)) setTheme(stored);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    window.localStorage.setItem(KEY, theme);
  }, [theme]);

  return { theme, setTheme };
}

export function ThemeSwitcher() {
  const { theme, setTheme } = useTheme();
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-3">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        <Palette className="h-3.5 w-3.5 shrink-0" /> Theme
      </p>
      <div className="mt-2 flex flex-col gap-1">
        {THEMES.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setTheme(t.id)}
            aria-pressed={theme === t.id}
            className={cn(
              "focus-ring grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2 rounded-xl border px-2.5 py-2 text-left text-xs font-semibold transition-all duration-200",
              theme === t.id
                ? "border-border bg-background shadow-soft"
                : "border-transparent text-muted-foreground hover:bg-lime/60 hover:text-foreground",
            )}
          >
            <span className="truncate">{t.label}</span>
            <span className="flex shrink-0 gap-1">
              {t.swatch.map((c) => (
                <span
                  key={c}
                  style={{ backgroundColor: c }}
                  className="h-3.5 w-3.5 rounded-full border border-border"
                />
              ))}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
