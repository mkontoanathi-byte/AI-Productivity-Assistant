import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import {
  CalendarDays,
  Columns3,
  Table2,
  Send,
  MessageSquare,
  CheckCircle2,
  Linkedin,
  Instagram,
  Music2,
  Globe,
  Twitter,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { AppShell } from "@/components/aura/app-shell";
import { Card, CardTitle, SectionHeading, Button, Tabs, Tag } from "@/components/aura/kit";
import { StatusBadge, STATUSES, type Status } from "@/components/aura/status";

export const Route = createFileRoute("/master-grid")({
  head: () => ({
    meta: [
      { title: "The Master Grid — Aura Social Workspace" },
      {
        name: "description",
        content:
          "Bulk-edit your social content calendar as a spreadsheet, or switch to Kanban and calendar views to manage the publishing pipeline across LinkedIn, Instagram, TikTok and X.",
      },
      { property: "og:title", content: "The Master Grid — Aura Social Workspace" },
      {
        property: "og:description",
        content:
          "A spreadsheet, Kanban board and content calendar in one view, with approvals and publishing status.",
      },
    ],
  }),
  component: MasterGrid,
});

type Row = {
  id: string;
  title: string;
  platform: string;
  date: string;
  tags: string;
  status: Status;
  comments: { who: string; text: string }[];
  approved: string[];
};

const seed: Row[] = [
  {
    id: "r1",
    title: "Behind the build: how our design team ships weekly",
    platform: "LinkedIn",
    date: "2026-09-07",
    tags: "culture, employer brand",
    status: "In Review",
    comments: [{ who: "Lerato (Comms)", text: "Soften the third line — sounds too salesy." }],
    approved: ["Sipho (Brand)"],
  },
  {
    id: "r2",
    title: "3 hooks that stopped the scroll last month",
    platform: "TikTok",
    date: "2026-09-08",
    tags: "trend, hook test",
    status: "Scheduled",
    comments: [],
    approved: ["Lerato (Comms)", "Sipho (Brand)"],
  },
  {
    id: "r3",
    title: "Carousel: 5 signs your content calendar is broken",
    platform: "Instagram",
    date: "2026-09-09",
    tags: "education, carousel",
    status: "Draft",
    comments: [],
    approved: [],
  },
  {
    id: "r4",
    title: "Quarterly product note from the CEO",
    platform: "X",
    date: "2026-09-04",
    tags: "corporate, exec",
    status: "Published",
    comments: [{ who: "Nomsa (Legal)", text: "Approved with the revised disclaimer." }],
    approved: ["Nomsa (Legal)", "Lerato (Comms)"],
  },
  {
    id: "r5",
    title: "Client spotlight: 40% lift in reach in six weeks",
    platform: "LinkedIn",
    date: "2026-09-11",
    tags: "case study, proof",
    status: "In Review",
    comments: [{ who: "Sipho (Brand)", text: "Add the logo lockup to the hero image." }],
    approved: [],
  },
];

const platformIcon: Record<string, typeof Globe> = {
  LinkedIn: Linkedin,
  Instagram: Instagram,
  TikTok: Music2,
  X: Twitter,
};

function MasterGrid() {
  const [view, setView] = useState("grid");
  const [rows, setRows] = useState<Row[]>(seed);
  const [selected, setSelected] = useState<string[]>([]);

  const update = (id: string, patch: Partial<Row>) =>
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));

  const toggleSelect = (id: string) =>
    setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

  const publish = (label: string) => {
    toast.success("Success: Content queued for publishing to selected platforms.", {
      description: `${label} — ${selected.length || rows.length} item(s) sent to the pipeline.`,
    });
    setRows((prev) =>
      prev.map((r) =>
        selected.length === 0 || selected.includes(r.id)
          ? { ...r, status: label === "Publish Now" ? "Published" : "Scheduled" }
          : r,
      ),
    );
  };

  const byStatus = useMemo(
    () => STATUSES.map((s) => ({ status: s, items: rows.filter((r) => r.status === s) })),
    [rows],
  );

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Module 01"
        title="The Master Grid"
        sub="Bulk-edit like a spreadsheet, then flip to Kanban or calendar when you need to see the pipeline. Everything stays editable until it publishes."
        action={
          <div className="flex flex-wrap gap-2">
            <Button variant="ghost" onClick={() => publish("Schedule")}>
              <CalendarDays className="h-4 w-4" /> Schedule
            </Button>
            <Button variant="cta" onClick={() => publish("Publish Now")}>
              <Send className="h-4 w-4" /> Publish Now
            </Button>
          </div>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Tabs
          value={view}
          onChange={setView}
          tabs={[
            { id: "grid", label: "Spreadsheet" },
            { id: "kanban", label: "Kanban" },
            { id: "calendar", label: "Calendar" },
          ]}
        />
        <p className="text-xs text-muted-foreground">
          {selected.length ? `${selected.length} row(s) selected` : "No rows selected — actions apply to all"}
        </p>
      </div>

      {view === "grid" ? (
        <Card className="mt-6 overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[880px] border-collapse text-sm">
              <thead>
                <tr className="bg-blue/40 text-left">
                  <th className="w-10 p-3">
                    <Table2 className="h-4 w-4" />
                  </th>
                  <th className="p-3 font-semibold">Post copy</th>
                  <th className="p-3 font-semibold">Platform</th>
                  <th className="p-3 font-semibold">Date</th>
                  <th className="p-3 font-semibold">Tags</th>
                  <th className="p-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr
                    key={r.id}
                    className="border-t border-border transition-colors duration-200 hover:bg-lime/40"
                  >
                    <td className="p-3 align-top">
                      <input
                        type="checkbox"
                        aria-label={`Select ${r.title}`}
                        checked={selected.includes(r.id)}
                        onChange={() => toggleSelect(r.id)}
                        className="focus-ring h-4 w-4 rounded border-border accent-terracotta"
                      />
                    </td>
                    <td className="min-w-[280px] p-2 align-top">
                      <input
                        value={r.title}
                        onChange={(e) => update(r.id, { title: e.target.value })}
                        aria-label="Post copy"
                        className="focus-ring w-full rounded-lg border border-transparent bg-transparent px-2 py-1.5 font-semibold transition-colors duration-200 hover:border-border focus:border-border"
                      />
                      {r.comments.length ? (
                        <p className="mt-1 flex items-start gap-1.5 px-2 text-xs text-muted-foreground">
                          <MessageSquare className="mt-0.5 h-3 w-3 shrink-0" />
                          <span>
                            <strong>{r.comments[0]!.who}:</strong> {r.comments[0]!.text}
                          </span>
                        </p>
                      ) : null}
                    </td>
                    <td className="p-2 align-top">
                      <select
                        value={r.platform}
                        onChange={(e) => update(r.id, { platform: e.target.value })}
                        aria-label="Platform"
                        className="focus-ring rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm"
                      >
                        {["LinkedIn", "Instagram", "TikTok", "X"].map((p) => (
                          <option key={p}>{p}</option>
                        ))}
                      </select>
                    </td>
                    <td className="p-2 align-top">
                      <input
                        type="date"
                        value={r.date}
                        onChange={(e) => update(r.id, { date: e.target.value })}
                        aria-label="Publish date"
                        className="focus-ring rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <input
                        value={r.tags}
                        onChange={(e) => update(r.id, { tags: e.target.value })}
                        aria-label="Tags"
                        className="focus-ring w-full min-w-[140px] rounded-lg border border-transparent bg-transparent px-2 py-1.5 transition-colors duration-200 hover:border-border focus:border-border"
                      />
                    </td>
                    <td className="p-2 align-top">
                      <select
                        value={r.status}
                        onChange={(e) => update(r.id, { status: e.target.value as Status })}
                        aria-label="Publishing status"
                        className="focus-ring rounded-lg border border-border bg-background/70 px-2 py-1.5 text-sm"
                      >
                        {STATUSES.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      ) : null}

      {view === "kanban" ? (
        <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {byStatus.map((col) => (
            <Card key={col.status} className="flex flex-col gap-3">
              <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                <StatusBadge status={col.status} />
                <span className="text-xs text-muted-foreground">{col.items.length}</span>
              </div>
              {col.items.map((r) => (
                <article
                  key={r.id}
                  className="rounded-xl border border-border bg-background/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-lime/40"
                >
                  <p className="text-sm font-semibold">{r.title}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {r.platform} · {r.date}
                  </p>
                  {r.approved.length ? (
                    <p className="mt-2 flex flex-wrap items-center gap-1.5 text-xs">
                      {r.approved.map((a) => (
                        <Tag key={a} tone="success">
                          <CheckCircle2 className="h-3 w-3" /> {a}
                        </Tag>
                      ))}
                    </p>
                  ) : null}
                  {r.comments.length ? (
                    <p className="mt-2 text-xs text-muted-foreground">
                      <strong>{r.comments[0]!.who}:</strong> {r.comments[0]!.text}
                    </p>
                  ) : null}
                  <div className="mt-3 flex flex-wrap gap-2">
                    <Button
                      variant="quiet"
                      className="px-2.5 py-1 text-xs"
                      onClick={() => update(r.id, { status: "In Review" })}
                    >
                      Flag for review
                    </Button>
                    <Button
                      variant="ghost"
                      className="px-2.5 py-1 text-xs"
                      onClick={() => {
                        update(r.id, { status: "Scheduled" });
                        toast.success("Success: Content queued for publishing to selected platforms.");
                      }}
                    >
                      Schedule
                    </Button>
                  </div>
                </article>
              ))}
            </Card>
          ))}
        </div>
      ) : null}

      {view === "calendar" ? (
        <Card className="mt-6">
          <CardTitle hint="September 2026 — each date is a cell and scheduled posts stack inside their day.">
            Content calendar
          </CardTitle>
          <div className="overflow-x-auto">
            <div className="min-w-[720px]">
              <div className="grid grid-cols-7 gap-2">
                {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map((d) => (
                  <div
                    key={d}
                    className="rounded-lg bg-indigo/25 px-2 py-1.5 text-center text-[0.7rem] font-bold uppercase tracking-[0.12em]"
                  >
                    {d}
                  </div>
                ))}
              </div>
              <div className="mt-2 grid grid-cols-7 gap-2">
                {Array.from({ length: 35 }).map((_, cell) => {
                  // 1 September 2026 is a Tuesday → offset one leading blank cell.
                  const dayNum = cell - 1 + 1;
                  const inMonth = dayNum >= 1 && dayNum <= 30;
                  const dayRows = inMonth
                    ? rows.filter((r) => Number(r.date.slice(-2)) === dayNum)
                    : [];
                  return (
                    <div
                      key={cell}
                      className={cn(
                        "min-h-28 rounded-xl border border-border p-2 transition-colors duration-200",
                        inMonth ? "bg-background/60 hover:bg-lime/30" : "bg-muted/40 opacity-50",
                      )}
                    >
                      {inMonth ? (
                        <>
                          <p className="text-xs font-bold text-muted-foreground">{dayNum}</p>
                          <div className="mt-1.5 flex flex-col gap-1.5">
                            {dayRows.map((r) => {
                              const Icon = platformIcon[r.platform] ?? Globe;
                              return (
                                <article
                                  key={r.id}
                                  className="rounded-lg border border-border bg-card p-2 shadow-soft"
                                >
                                  <p className="flex items-center gap-1.5 text-[0.65rem] font-semibold text-muted-foreground">
                                    <Icon className="h-3 w-3 shrink-0" /> {r.platform}
                                  </p>
                                  <p className="mt-1 line-clamp-2 text-xs font-semibold leading-snug">
                                    {r.title}
                                  </p>
                                  <StatusBadge
                                    status={r.status}
                                    className="mt-1.5 px-1.5 py-0.5 text-[0.6rem]"
                                  />
                                </article>
                              );
                            })}
                          </div>
                        </>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </Card>
      ) : null}
    </AppShell>
  );
}
