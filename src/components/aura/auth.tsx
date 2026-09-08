import { useEffect, useRef, useState } from "react";
import { LogOut, Mail, Lock, ChevronDown } from "lucide-react";
import { AuraMark } from "./logo";
import { Button } from "./kit";
import { cn } from "@/lib/utils";

const KEY = "aura-session";

export type Session = { name: string; email: string };

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(KEY);
      if (raw) setSession(JSON.parse(raw) as Session);
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signIn = (email: string) => {
    const name = email.split("@")[0]?.replace(/[._-]+/g, " ") || "Lela member";
    const next: Session = { name, email };
    window.localStorage.setItem(KEY, JSON.stringify(next));
    setSession(next);
  };

  const signOut = () => {
    window.localStorage.removeItem(KEY);
    setSession(null);
  };

  return { session, ready, signIn, signOut };
}

function Field({
  id,
  label,
  type,
  placeholder,
  icon: Icon,
  value,
  onChange,
}: {
  id: string;
  label: string;
  type: string;
  placeholder: string;
  icon: typeof Mail;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </label>
      <div className="mt-1.5 grid grid-cols-[auto_minmax(0,1fr)] items-center gap-2 rounded-xl border border-border bg-background/70 px-3 py-2.5 transition-colors duration-200 focus-within:border-terracotta">
        <Icon className="h-4 w-4 shrink-0 text-muted-foreground" />
        <input
          id={id}
          type={type}
          required
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="min-w-0 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>
    </div>
  );
}

export function SignInScreen({ onSignIn }: { onSignIn: (email: string) => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-10">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-lift sm:p-8">
        <div className="flex items-center gap-3">
          <AuraMark />
          <span className="font-sans text-2xl font-bold leading-none">Lela</span>
        </div>
        <h1 className="mt-6 text-2xl">Welcome back</h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Sign in to your social command centre. Your calendar, assets and approvals are waiting.
        </p>

        <form
          className="mt-6 flex flex-col gap-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (email.trim()) onSignIn(email.trim());
          }}
        >
          <Field
            id="email"
            label="Work email"
            type="email"
            placeholder="you@company.com"
            icon={Mail}
            value={email}
            onChange={setEmail}
          />
          <Field
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            icon={Lock}
            value={password}
            onChange={setPassword}
          />
          <Button variant="cta" type="submit" className="w-full">
            Sign In
          </Button>
        </form>

        <div className="my-5 grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3">
          <span className="h-px bg-border" />
          <span className="text-xs uppercase tracking-[0.14em] text-muted-foreground">or</span>
          <span className="h-px bg-border" />
        </div>

        <div className="flex flex-col gap-2">
          <Button variant="ghost" className="w-full" onClick={() => onSignIn("alex@company.com")}>
            Continue with Google
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => onSignIn("alex@company.com")}>
            Continue with Microsoft
          </Button>
        </div>

        <p className="mt-5 text-center text-xs text-muted-foreground">
          Prototype sign-in — no account is created and nothing leaves this browser.
        </p>
      </div>
    </div>
  );
}

export function ProfileMenu({
  session,
  onSignOut,
}: {
  session: Session;
  onSignOut: () => void;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const initials = session.name
    .split(" ")
    .map((p) => p[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="focus-ring grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 rounded-2xl border border-border bg-background/60 px-3 py-2.5 text-left transition-colors duration-200 hover:bg-lime/50"
      >
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-terracotta text-xs font-bold">
          {initials || "AU"}
        </span>
        <span className="min-w-0">
          <span className="block truncate text-sm font-semibold capitalize">{session.name}</span>
          <span className="block truncate text-xs text-muted-foreground">{session.email}</span>
        </span>
        <ChevronDown
          className={cn("h-4 w-4 shrink-0 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open ? (
        <div
          role="menu"
          className="absolute bottom-full left-0 z-50 mb-2 w-full rounded-2xl border border-border bg-card p-2 shadow-lift"
        >
          <button
            type="button"
            role="menuitem"
            onClick={onSignOut}
            className="focus-ring flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm font-semibold transition-colors duration-200 hover:bg-lime/60"
          >
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      ) : null}
    </div>
  );
}
