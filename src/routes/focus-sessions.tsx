import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { Play, Pause, RotateCcw } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import { Card, CardTitle, SectionHeading, Button, Tag, Tabs, Toggle } from "@/components/aura/kit";

export const Route = createFileRoute("/focus-sessions")({
  head: () => ({
    meta: [
      { title: "Focus Sessions — Aura Workspace" },
      {
        name: "description",
        content:
          "Protected deep-work blocks with a session timer, intention setting and a gentle record of the focus time you've reclaimed.",
      },
      { property: "og:title", content: "Focus Sessions — Aura Workspace" },
      {
        property: "og:description",
        content: "Deep-work timers, intentions and a calm record of reclaimed focus time.",
      },
    ],
  }),
  component: FocusSessions;
});

const presets = [
  { id: "25", label: "25 min" },
  { id: "50", label: "50 min" },
  { id: "90", label: "90 min" },
];

function FocusSessions() {
  const [preset, setPreset] = useState("50");
  const [remaining, setRemaining] = useState(50 * 60);
  const [running, setRunning] = useState(false);
  const [dnd, setDnd] = useState(true);
  const [intention, setIntention] = useState("Finish the Q4 budget narrative");
  const total = Number(preset) * 60;
  const tick = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    setRemaining(Number(preset) * 60);
    setRunning(false);
  }, [preset]);

  useEffect(() => {
    if (!running) return;
    tick.current = setInterval(() => setRemaining((r) => (r > 0 ? r - 1 : 0)), 1000);
    return () => {
      if (tick.current) clearInterval(tick.current);
    };
  }, [running]);

  const mm = String(Math.floor(remaining / 60)).padStart(2, "0");
  const ss = String(remaining % 60).padStart(2, "0");
  const pct = Math.round(((total - remaining) / total) * 100);

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Module 04"
        title="Focus Sessions"
        sub="One intention, one block, no notifications. I'll hold the noise and give you a soft landing at the end."
        action={<Tabs tabs={presets} value={preset} onChange={setPreset} />}
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.3fr_1fr]">
        <Card className="text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-muted-foreground">
            Current intention
          </p>
          <input
            value={intention}
            onChange={(e) => setIntention(e.target.value)}
            aria-label="Session intention"
            className="focus-ring mt-3 w-full rounded-xl border border-border bg-background/70 px-4 py-3 text-center text-sm font-semibold transition-colors duration-200 hover:border-lime"
          />
          <p className="mt-8 font-display text-6xl tabular-nums sm:text-7xl">
            {mm}:{ss}
          </p>
          <div className="mx-auto mt-6 h-2 w-full max-w-md overflow-hidden rounded-full bg-blue">
            <div
              className="h-full rounded-full bg-terracotta transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <Button variant="cta" onClick={() => setRunning((v) => !v)}>
              {running ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              {running ? "Pause session" : "Start session"}
            </Button>
            <Button
              variant="quiet"
              onClick={() => {
                setRunning(false);
                setRemaining(total);
              }}
            >
              <RotateCcw className="h-4 w-4" /> Reset
            </Button>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card tone="rose">
            <Toggle
              checked={dnd}
              onChange={setDnd}
              label="Hold my notifications"
              hint="I'll queue everything non-urgent until the block ends."
            />
          </Card>
          <Card tone="lime">
            <CardTitle>This week</CardTitle>
            <p className="font-display text-3xl">6 sessions · 5h 20m</p>
            <p className="mt-2 text-sm text-muted-foreground">
              Your most productive block starts at 08:30. I'll keep defending it.
            </p>
          </Card>
          <Card>
            <CardTitle>Recent sessions</CardTitle>
            <ul className="flex flex-col gap-3">
              {[
                { t: "Budget narrative", d: "50 min", tag: "Completed", tone: "success" as const },
                { t: "Hiring scorecards", d: "25 min", tag: "Completed", tone: "success" as const },
                { t: "Roadmap draft", d: "90 min", tag: "Interrupted", tone: "important" as const },
              ].map((s) => (
                <li
                  key={s.t}
                  className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors duration-200 hover:bg-lime/50"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">{s.t}</p>
                    <p className="text-xs text-muted-foreground">{s.d}</p>
                  </div>
                  <Tag tone={s.tone}>{s.tag}</Tag>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
