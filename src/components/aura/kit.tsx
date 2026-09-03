import { useState, type ReactNode, type TextareaHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  sub,
  action,
}: {
  eyebrow?: string;
  title: string;
  sub?: string;
  action?: ReactNode;
}) {
  return (
    <header className="grid grid-cols-[minmax(0,1fr)_auto] items-end gap-4 sm:flex sm:flex-wrap sm:justify-between">
      <div className="min-w-0">
        {eyebrow ? (
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="mt-1 truncate text-2xl sm:text-3xl">{title}</h1>
        {sub ? <p className="mt-2 max-w-2xl text-sm text-muted-foreground">{sub}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function Card({
  className,
  children,
  tone = "default",
}: {
  className?: string;
  children: ReactNode;
  tone?: "default" | "rose" | "blue" | "lime";
}) {
  const tones = {
    default: "",
    rose: "bg-rose/45",
    blue: "bg-blue/45",
    lime: "bg-lime/45",
  } as const;
  return <section className={cn("card-surface p-5 sm:p-6", tones[tone], className)}>{children}</section>;
}

export function CardTitle({ children, hint }: { children: ReactNode; hint?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-lg">{children}</h2>
      {hint ? <p className="mt-1 text-sm text-muted-foreground">{hint}</p> : null}
    </div>
  );
}

const tagTones = {
  urgent: "bg-terracotta/70 text-foreground",
  important: "bg-rose text-foreground",
  calm: "bg-blue text-foreground",
  success: "bg-lime text-foreground",
  muted: "bg-muted text-muted-foreground",
} as const;

export function Tag({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: keyof typeof tagTones;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-semibold",
        tagTones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Button({
  children,
  variant = "ghost",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "cta" | "ghost" | "quiet" }) {
  const variants = {
    cta: "bg-terracotta text-foreground hover:brightness-105 shadow-soft",
    ghost: "bg-blue/60 text-foreground hover:bg-lime",
    quiet: "bg-transparent text-muted-foreground hover:text-foreground hover:bg-lime/60",
  } as const;
  return (
    <button
      {...props}
      className={cn(
        "focus-ring inline-flex items-center justify-center gap-2 rounded-xl border border-border px-4 py-2 text-sm font-semibold transition-all duration-200 active:scale-[0.98] disabled:opacity-50",
        variants[variant],
        className,
      )}
    >
      {children}
    </button>
  );
}

export function EditableArea({
  className,
  ...props
}: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={cn(
        "focus-ring w-full resize-y rounded-xl border border-border bg-background/70 p-3 text-sm leading-relaxed text-foreground transition-colors duration-200 placeholder:text-muted-foreground hover:border-lime",
        className,
      )}
    />
  );
}

export function Toggle({
  checked,
  onChange,
  label,
  hint,
}: {
  checked: boolean;
  onChange: (v: boolean) => void;
  label: string;
  hint?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className="focus-ring grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 text-left transition-colors duration-200 hover:bg-lime/50"
    >
      <span className="min-w-0">
        <span className="block text-sm font-semibold">{label}</span>
        {hint ? <span className="block text-xs text-muted-foreground">{hint}</span> : null}
      </span>
      <span
        className={cn(
          "relative h-6 w-11 shrink-0 rounded-full transition-colors duration-200",
          checked ? "bg-terracotta" : "bg-blue",
        )}
      >
        <span
          className={cn(
            "absolute top-0.5 h-5 w-5 rounded-full bg-card shadow-soft transition-all duration-200",
            checked ? "left-[1.4rem]" : "left-0.5",
          )}
        />
      </span>
    </button>
  );
}

export function Tabs({
  tabs,
  value,
  onChange,
}: {
  tabs: { id: string; label: string }[];
  value: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-2xl border border-border bg-background/70 p-1">
      {tabs.map((t) => (
        <button
          key={t.id}
          type="button"
          onClick={() => onChange(t.id)}
          className={cn(
            "focus-ring rounded-xl px-3.5 py-1.5 text-sm font-semibold transition-all duration-200",
            value === t.id
              ? "bg-card text-foreground shadow-soft"
              : "text-muted-foreground hover:bg-lime/60 hover:text-foreground",
          )}
        >
          {t.label}
        </button>
      ))}
    </div>
  );
}

export function PromptTemplates({
  templates,
  onPick,
}: {
  templates: string[];
  onPick: (t: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {templates.map((t) => (
        <button
          key={t}
          type="button"
          onClick={() => onPick(t)}
          className="focus-ring rounded-full border border-border bg-blue/50 px-3 py-1.5 text-xs font-semibold transition-all duration-200 hover:-translate-y-0.5 hover:bg-lime"
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/** Small helper for editable list blocks used across modules. */
export function useEditableList(initial: string[]) {
  const [items, setItems] = useState(initial);
  const update = (i: number, v: string) =>
    setItems((prev) => prev.map((item, idx) => (idx === i ? v : item)));
  return { items, update, setItems };
}
