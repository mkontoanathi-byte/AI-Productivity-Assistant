import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Sparkles, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import {
  Card,
  CardTitle,
  SectionHeading,
  Button,
  EditableArea,
  PromptTemplates,
  Toggle,
  Tabs,
  Tag,
} from "@/components/aura/kit";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Trend & Hook Analyzer — Aura Social Workspace" },
      {
        name: "description",
        content:
          "Analyze emerging social trends, generate scroll-stopping hooks and draft platform-specific captions for TikTok, LinkedIn and Instagram — all editable before publishing.",
      },
      { property: "og:title", content: "AI Trend & Hook Analyzer — Aura Social Workspace" },
      {
        property: "og:description",
        content: "Trend reads, hooks and platform-native captions you can edit before scheduling.",
      },
    ],
  }),
  component: TrendAnalyzer,
});

const templates = [
  "What's trending for B2B this week?",
  "Give me 5 scroll-stopping hooks",
  "Rewrite for LinkedIn thought leadership",
  "Turn this into a TikTok script",
];

const trends = [
  { name: "Founder-led POV video", lift: "+38% reach", tone: "success" as const },
  { name: "Unpolished 'work in progress' posts", lift: "+22% saves", tone: "calm" as const },
  { name: "Carousel teardowns", lift: "+17% shares", tone: "important" as const },
];

const captions: Record<string, { plain: string; simple: string }> = {
  tiktok: {
    plain:
      "Hook (0-2s): 'Your content calendar isn't broken — your approval chain is.' Cut to screen recording of five comment threads. Close on the one-grid fix. Caption: POV: the post was ready Tuesday. It went live Friday. #socialmediamanager",
    simple:
      "Start with: 'Your calendar isn't the problem — the approvals are.' Show the messy comments, then the fix. Caption: The post was ready Tuesday. It went out Friday.",
  },
  linkedin: {
    plain:
      "Most comms teams don't have a content problem — they have a coordination problem. Last quarter we tracked 41 posts from draft to live: the average post spent 3.4 days waiting on a decision, not on creative. Here's the workflow change that cut that to under a day.",
    simple:
      "Most teams aren't short on ideas — they're stuck waiting for approvals. We tracked 41 posts: each waited 3.4 days for a decision. Here's what fixed it.",
  },
  instagram: {
    plain:
      "Swipe → 5 signs your content calendar is quietly costing you reach (and the fix for each). Save this for your next planning session. 📌 #socialmediamanagement #contentstrategy",
    simple:
      "Swipe for 5 signs your calendar is costing you reach — plus the fix for each. Save it for planning day. 📌",
  },
};

function TrendAnalyzer() {
  const [simplify, setSimplify] = useState(false);
  const [platform, setPlatform] = useState("linkedin");
  const [input, setInput] = useState(
    "Paste a campaign brief, competitor post, comment thread or performance export. Aura will read the trend, suggest hooks and draft platform-native captions.",
  );
  const [prompt, setPrompt] = useState("What's trending for B2B this week?");
  const [edits, setEdits] = useState<Record<string, string>>({});

  const key = `${platform}-${simplify}`;
  const base = captions[platform]!;
  const caption = edits[key] ?? (simplify ? base.simple : base.plain);

  const hooks = [
    "Your content calendar isn't broken — your approval chain is.",
    "We tracked 41 posts from draft to live. Here's where they got stuck.",
    "The best-performing post last month took 9 minutes to make.",
  ];

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Module 03"
        title="AI Trend & Hook Analyzer"
        sub="Read the moment, then write for it. Aura drafts hooks and platform-specific captions — treat every line as a suggestion, not a fact."
        action={
          <Button variant="cta" onClick={() => toast.success("Fresh trend read generated from the last 7 days.")}>
            <Sparkles className="h-4 w-4" /> Analyse trends
          </Button>
        }
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardTitle hint="Nothing leaves your browser in this prototype.">Source material</CardTitle>
          <EditableArea
            rows={10}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Trend input"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="cta" onClick={() => toast.success("Hooks and captions drafted.")}>
              <Sparkles className="h-4 w-4" /> Generate
            </Button>
            <Button variant="quiet" onClick={() => setInput("")}>
              Clear
            </Button>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card tone="blue">
            <CardTitle>Prompt templates</CardTitle>
            <PromptTemplates templates={templates} onPick={setPrompt} />
            <EditableArea
              className="mt-4"
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              aria-label="Analyzer prompt"
            />
          </Card>
          <Card>
            <Toggle
              checked={simplify}
              onChange={setSimplify}
              label="Simplify complex language"
              hint="Rewrite outputs in plain, jargon-free English."
            />
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-[1fr_1.4fr]">
        <Card tone="lime">
          <CardTitle hint="Signals from the last 7 days across your channels.">
            Trends rising
          </CardTitle>
          <ul className="flex flex-col gap-3">
            {trends.map((t) => (
              <li
                key={t.name}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background/60 px-3 py-2.5"
              >
                <span className="min-w-0">
                  <TrendingUp className="mr-1.5 inline h-3.5 w-3.5" />
                  <span className="text-sm font-semibold">{t.name}</span>
                </span>
                <Tag tone={t.tone}>{t.lift}</Tag>
              </li>
            ))}
          </ul>
          <div className="mt-5">
            <p className="text-sm font-semibold">Suggested hooks</p>
            <ul className="mt-2 flex flex-col gap-2">
              {hooks.map((h) => (
                <li
                  key={h}
                  className="rounded-xl border border-border bg-card px-3 py-2 text-sm transition-colors duration-200 hover:bg-lime/50"
                >
                  {h}
                </li>
              ))}
            </ul>
          </div>
        </Card>

        <Card>
          <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
            <CardTitle hint="Editable draft — tuned to the platform's native voice.">
              Platform caption
            </CardTitle>
            <Tag tone="muted">Draft</Tag>
          </div>
          <Tabs
            value={platform}
            onChange={setPlatform}
            tabs={[
              { id: "tiktok", label: "TikTok" },
              { id: "linkedin", label: "LinkedIn" },
              { id: "instagram", label: "Instagram" },
            ]}
          />
          <EditableArea
            className="mt-4"
            rows={9}
            value={caption}
            onChange={(e) => setEdits((p) => ({ ...p, [key]: e.target.value }))}
            aria-label="Platform caption"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button
              variant="cta"
              onClick={() =>
                toast.success("Success: Content queued for publishing to selected platforms.")
              }
            >
              Schedule
            </Button>
            <Button variant="ghost" onClick={() => toast("Caption pushed to the Master Grid as a draft.")}>
              Send to Master Grid
            </Button>
          </div>
        </Card>
      </div>
    </AppShell>
  );
}
