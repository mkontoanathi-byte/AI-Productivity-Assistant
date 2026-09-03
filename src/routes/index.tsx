import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { ArrowUpRight, CalendarCheck, Sparkles, NotebookPen, Timer } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import { Card, CardTitle, SectionHeading, Tag, Button, Toggle } from "@/components/aura/kit";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura Workspace — Your AI Chief of Staff Dashboard" },
      {
        name: "description",
        content:
          "Aura Workspace brings task planning, research, meeting notes and focus sessions into one calm AI-assisted workplace dashboard.",
      },
      { property: "og:title", content: "Aura Workspace — Your AI Chief of Staff Dashboard" },
      {
        property: "og:description",
        content:
          "Plan, research, summarise and focus — Aura drafts, you decide. A calm productivity dashboard for modern teams.",
      },
    ],
  }),
  component: Dashboard,
});

const modules = [
  {
    to: "/task-planner" as const,
    icon: CalendarCheck,
    title: "AI Task Planner",
    copy: "A schedule shaped around your energy, not just your calendar.",
    tone: "blue" as const,
  },
  {
    to: "/research" as const,
    icon: Sparkles,
    title: "Research Assistant",
    copy: "Paste anything dense. Get summary, insight and a recommendation.",
    tone: "rose" as const,
  },
  {
    to: "/meeting-notes" as const,
    icon: NotebookPen,
    title: "Meeting Notes",
    copy: "Raw notes in, decisions and owners out — all editable.",
    tone: "lime" as const,
  },
  {
    to: "/focus-sessions" as const,
    icon: Timer,
    title: "Focus Sessions",
    copy: "Protected deep-work blocks with gentle re-entry.",
    tone: "default" as const,
  },
];

function Dashboard() {
  const [quietMode, setQuietMode] = useState(true);

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Thursday, 3 September"
        title="Good morning, Anathi"
        sub="Three things genuinely need you today. I've moved the rest and drafted what I could — nothing is sent until you say so."
        action={
          <Button variant="cta">
            Plan my day <ArrowUpRight className="h-4 w-4" />
          </Button>
        }
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Focus time protected", value: "3h 40m", tone: "lime" as const },
          { label: "Tasks needing you", value: "3", tone: "rose" as const },
          { label: "Drafts awaiting review", value: "5", tone: "blue" as const },
          { label: "Meetings summarised", value: "8", tone: "default" as const },
        ].map((s) => (
          <Card key={s.label} tone={s.tone}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 font-display text-3xl">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <Card>
          <CardTitle hint="Ordered by what only you can do.">Today's shortlist</CardTitle>
          <ul className="flex flex-col gap-3">
            {[
              { t: "Sign off Q4 budget narrative", when: "09:30", tag: "Urgent", tone: "urgent" as const },
              { t: "Review Aura onboarding research", when: "11:00", tag: "Important", tone: "important" as const },
              { t: "1:1 with Thabo — growth plan", when: "14:00", tag: "Scheduled", tone: "calm" as const },
              { t: "Approve supplier contract summary", when: "16:15", tag: "Drafted", tone: "success" as const },
            ].map((row) => (
              <li
                key={row.t}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors duration-200 hover:bg-lime/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{row.t}</p>
                  <p className="text-xs text-muted-foreground">{row.when}</p>
                </div>
                <Tag tone={row.tone}>{row.tag}</Tag>
              </li>
            ))}
          </ul>
        </Card>

        <div className="flex flex-col gap-6">
          <Card tone="rose">
            <CardTitle>Aura's nudge</CardTitle>
            <p className="text-sm leading-relaxed">
              You have four back-to-back calls after lunch. I can shift the supplier review to
              tomorrow 09:00 and hold 15 minutes to reset between meetings.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="cta">Accept</Button>
              <Button variant="quiet">Not today</Button>
            </div>
          </Card>
          <Card>
            <Toggle
              checked={quietMode}
              onChange={setQuietMode}
              label="Quiet hours"
              hint="Hold non-urgent nudges until 15:00."
            />
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {modules.map(({ to, icon: Icon, title, copy, tone }) => (
          <Link key={to} to={to} className="focus-ring rounded-2xl">
            <Card tone={tone} className="h-full">
              <Icon className="h-5 w-5" />
              <h2 className="mt-3 text-lg">{title}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{copy}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold">
                Open <ArrowUpRight className="h-4 w-4" />
              </span>
            </Card>
          </Link>
        ))}
      </div>
    </AppShell>
  );
}
