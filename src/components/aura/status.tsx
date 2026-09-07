import { cn } from "@/lib/utils";

export const STATUSES = ["Draft", "In Review", "Scheduled", "Published"] as const;
export type Status = (typeof STATUSES)[number];

const styles: Record<Status, string> = {
  Draft: "bg-muted text-muted-foreground",
  "In Review": "bg-amber/35 text-foreground",
  Scheduled: "bg-indigo/30 text-foreground",
  Published: "bg-emerald/35 text-foreground",
};

export function StatusBadge({ status, className }: { status: Status; className?: string }) {
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-semibold",
        styles[status],
        className,
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-foreground/50" />
      {status}
    </span>
  );
}
