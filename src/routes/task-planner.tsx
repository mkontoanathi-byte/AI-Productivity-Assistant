import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Wand2, Clock } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import {
  Card,
  CardTitle,
  SectionHeading,
  Tag,
  Button,
  Tabs,
  EditableArea,
  PromptTemplates,
  useEditableList,
} from "@/components/aura/kit";

export const Route = createFileRoute("/task-planner")({
  head: () => ({
    meta: [
      { title: "AI Task Planner & Scheduler — Aura Workspace" },
      {
        name: "description",
        content:
          "Draft daily and weekly schedules with urgency and importance tags, AI time-optimisation suggestions and fully editable outputs.",
      },
      { property: "og:title", content: "AI Task Planner & Scheduler — Aura Workspace" },
      {
        property: "og:description",
        content:
          "Daily and weekly planning with urgency tags, AI time optimisation and editable drafts.",
      },
    ],
  }),
  component: TaskPlanner,
});

const daily = [
  { time: "08:30", task: "Deep work — Q4 budget narrative", tag: "Urgent + Important", tone: "urgent" as const },
  { time: "10:15", task: "Review research digest", tag: "Important", tone: "important" as const },
  { time: "11:30", task: "Inbox + approvals sweep", tag: "Urgent", tone: "urgent" as const },
  { time: "14:00", task: "1:1 with Thabo", tag: "Scheduled", tone: "calm" as const },
  { time: "16:00", task: "Team retro prep", tag: "Can defer", tone: "muted" as const },
];

const weekly = [
  { time: "Mon", task: "Budget narrative + finance sync", tag: "Heavy", tone: "urgent" as const },
  { time: "Tue", task: "Research sprint & customer calls", tag: "Important", tone: "important" as const },
  { time: "Wed", task: "No-meeting morning — deep work", tag: "Protected", tone: "success" as const },
  { time: "Thu", task: "Reviews, 1:1s, hiring loop", tag: "People", tone: "calm" as const },
  { time: "Fri", task: "Retro, planning, admin close-out", tag: "Light", tone: "muted" as const },
];

const templates = [
  "Plan my day around two deep-work blocks",
  "Rebalance this week — I'm overloaded",
  "Protect time for the hiring loop",
  "What can I safely defer?",
];

function TaskPlanner() {
  const [view, setView] = useState("daily");
  const [prompt, setPrompt] = useState("Plan my day around two deep-work blocks");
  const rows = view === "daily" ? daily : weekly;
  const { items, update } = useEditableList([
    "Move the supplier contract review to tomorrow 09:00 — your afternoon is already three meetings deep.",
    "Cluster approvals into one 25-minute sweep at 11:30 instead of six context switches.",
    "Hold 16:30–17:00 as a soft landing so tomorrow starts from a clean desk.",
  ]);

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Module 01"
        title="AI Task Planner & Scheduler"
        sub="Tell me the shape of your week and I'll draft a realistic plan. Every block is editable — you always have the last word."
        action={<Tabs tabs={[{ id: "daily", label: "Daily" }, { id: "weekly", label: "Weekly" }]} value={view} onChange={setView} />}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardTitle hint="Tags reflect urgency and importance, so you can see trade-offs at a glance.">
            {view === "daily" ? "Today's schedule" : "This week at a glance"}
          </CardTitle>
          <ul className="flex flex-col gap-3">
            {rows.map((r) => (
              <li
                key={r.time}
                className="grid grid-cols-[auto_minmax(0,1fr)] items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors duration-200 hover:bg-lime/50 sm:grid-cols-[4.5rem_minmax(0,1fr)_auto]"
              >
                <span className="shrink-0 text-sm font-semibold text-muted-foreground">{r.time}</span>
                <span className="min-w-0 truncate text-sm font-semibold">{r.task}</span>
                <span className="col-span-2 sm:col-span-1">
                  <Tag tone={r.tone}>{r.tag}</Tag>
                </span>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card tone="blue">
            <CardTitle hint="Start from a template, then edit freely.">Prompt templates</CardTitle>
            <PromptTemplates templates={templates} onPick={setPrompt} />
            <EditableArea
              className="mt-4"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Planner prompt"
            />
            <Button variant="cta" className="mt-3 w-full">
              <Wand2 className="h-4 w-4" /> Draft a plan
            </Button>
          </Card>
          <Card tone="lime">
            <CardTitle>Time reclaimed</CardTitle>
            <p className="flex items-center gap-2 font-display text-3xl">
              <Clock className="h-6 w-6" /> 1h 45m
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              Estimated saving if you accept today's optimisations.
            </p>
          </Card>
        </div>
      </div>

      <Card className="mt-6">
        <CardTitle hint="Editable drafts — adjust the wording before you commit anything.">
          AI time-optimisation suggestions
        </CardTitle>
        <div className="grid gap-4 lg:grid-cols-3">
          {items.map((text, i) => (
            <EditableArea
              key={i}
              rows={4}
              value={text}
              onChange={(e) => update(i, e.target.value)}
              aria-label={`Optimisation suggestion ${i + 1}`}
            />
          ))}
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button variant="cta">Apply to schedule</Button>
          <Button variant="quiet">Regenerate suggestions</Button>
        </div>
      </Card>
    </AppShell>
  );
}
