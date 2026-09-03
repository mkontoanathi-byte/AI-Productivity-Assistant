import { useState, type ReactNode } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import { Toaster } from "sonner";
import {
  LayoutDashboard,
  Table2,
  FolderSync,
  Sparkles,
  Info,
  Menu,
  X,
  ShieldAlert,
} from "lucide-react";
import { AuraMark } from "./logo";
import { ThemeSwitcher } from "./theme";
import { ConnectedPlatforms } from "./platforms";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/master-grid", label: "Master Grid", icon: Table2 },
  { to: "/assets", label: "Asset & Drive Hub", icon: FolderSync },
  { to: "/research", label: "Trend & Hook AI", icon: Sparkles },
  { to: "/about", label: "About Aura", icon: Info },
] as const;

function NavList({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-1">
      {nav.map(({ to, label, icon: Icon }) => {
        const active = pathname === to;
        return (
          <Link
            key={to}
            to={to}
            onClick={onNavigate}
            className={cn(
              "focus-ring flex items-center gap-3 rounded-xl border border-transparent px-3 py-2.5 text-sm font-semibold transition-all duration-200",
              active
                ? "border-border bg-card text-foreground shadow-soft"
                : "text-muted-foreground hover:border-border hover:bg-lime/60 hover:text-foreground",
            )}
          >
            <Icon className="h-4 w-4 shrink-0" strokeWidth={2} />
            <span className="truncate">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

function SidebarInner({ onNavigate }: { onNavigate?: (() => void) | undefined }) {
  return (
    <div className="flex h-full flex-col gap-6 overflow-y-auto p-5">
      <Link to="/" onClick={onNavigate} className="focus-ring flex items-center gap-3 rounded-xl">
        <AuraMark />
        <span className="font-display text-2xl leading-none tracking-tight">Aura</span>
      </Link>
      <NavList onNavigate={onNavigate} />
      <ConnectedPlatforms />
      <ThemeSwitcher />
      <div className="mt-auto rounded-2xl border border-border bg-rose/50 p-4">
        <p className="text-sm font-semibold">Social command centre</p>
        <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
          Plan, approve and publish every channel from one grid. Aura drafts, you decide.
        </p>
      </div>
    </div>
  );
}

export function ResponsibleAiBanner() {
  return (
    <aside
      role="note"
      aria-label="Responsible AI disclaimer"
      className="mt-10 rounded-2xl border-2 border-terracotta bg-terracotta/25 p-4 sm:p-5"
    >
      <div className="grid grid-cols-[auto_minmax(0,1fr)] gap-3">
        <ShieldAlert className="mt-0.5 h-5 w-5 shrink-0" />
        <div className="min-w-0">
          <p className="text-sm font-bold uppercase tracking-[0.12em]">Responsible AI disclaimer</p>
          <p className="mt-1 text-sm leading-relaxed">
            Aura's outputs are AI-generated drafts and can be incomplete or wrong. Always review,
            edit, and verify before publishing. Avoid entering confidential, personal, or regulated
            data. A human stays accountable for every post that goes live.
          </p>
        </div>
      </div>
    </aside>
  );
}

export function AppShell({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" richColors={false} />

      {/* Fixed sidebar (desktop) */}
      <div className="fixed inset-y-0 left-0 z-30 hidden w-64 border-r border-border bg-sidebar lg:block">
        <SidebarInner />
      </div>

      {/* Mobile top bar */}
      <div className="sticky top-0 z-40 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border bg-sidebar/95 px-4 py-3 backdrop-blur lg:hidden">
        <Link to="/" className="focus-ring flex min-w-0 items-center gap-2 rounded-xl">
          <AuraMark className="h-8 w-8 shrink-0" />
          <span className="truncate font-display text-xl">Aura</span>
        </Link>
        <button
          type="button"
          aria-label={open ? "Close navigation" : "Open navigation"}
          onClick={() => setOpen((v) => !v)}
          className="focus-ring shrink-0 rounded-xl border border-border bg-card p-2 transition-colors duration-200 hover:bg-lime"
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {open ? (
        <div className="fixed inset-0 z-30 lg:hidden">
          <button
            aria-label="Close navigation overlay"
            onClick={() => setOpen(false)}
            className="absolute inset-0 bg-foreground/25"
          />
          <div className="absolute inset-y-0 left-0 w-72 max-w-[85vw] overflow-y-auto border-r border-border bg-sidebar pt-16 shadow-lift">
            <SidebarInner onNavigate={() => setOpen(false)} />
          </div>
        </div>
      ) : null}

      <main className="px-4 py-8 sm:px-8 lg:ml-64 lg:px-12 lg:py-12">
        <div className="mx-auto max-w-6xl">
          {children}
          <ResponsibleAiBanner />
          <footer className="mt-6 pb-4 text-xs text-muted-foreground">
            Aura Workspace — a local front-end prototype. Publishing is simulated; no data leaves
            this browser.
          </footer>
        </div>
      </main>
    </div>
  );
}
