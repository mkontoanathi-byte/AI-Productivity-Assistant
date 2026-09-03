import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Sparkles } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import {
  Card,
  CardTitle,
  SectionHeading,
  Button,
  EditableArea,
  PromptTemplates,
  Toggle,
  Tag,
} from "@/components/aura/kit";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "AI Research Assistant — Aura Workspace" },
      {
        name: "description",
        content:
          "Paste dense material and get an editable summary, key insights and a clear recommendation, with a simplify-complex-language toggle.",
      },
      { property: "og:title", content: "AI Research Assistant — Aura Workspace" },
      {
        property: "og:description",
        content: "Summaries, key insights and recommendations you can edit before sharing.",
      },
    ],
  }),
  component: Research,
});

const templates = [
  "Summarise for an exec audience",
  "Pull out the risks",
  "What should we do next?",
  "Compare against our current approach",
];

const plain = {
  summary:
    "The report argues that hybrid teams lose most of their productivity to fragmented communication, not to remote work itself. Teams with clear async norms outperformed co-located teams on delivery predictability.",
  insight:
    "Meeting load correlates more strongly with missed deadlines than headcount does. The three worst-performing teams in the study each held over 18 recurring meetings a week.",
  recommendation:
    "Pilot a no-meeting Wednesday with written status updates for one quarter, and measure delivery predictability rather than hours logged.",
};

const simplified = {
  summary:
    "Hybrid teams struggle because messages get scattered, not because people work from home. Teams with clear rules for written updates delivered work more reliably.",
  insight:
    "Too many meetings, not too few people, is what makes teams miss deadlines. The weakest teams had more than 18 repeat meetings each week.",
  recommendation:
    "Try one meeting-free day a week for three months. Ask for short written updates instead, and check whether work lands on time.",
};

function Research() {
  const [simplify, setSimplify] = useState(false);
  const [input, setInput] = useState(
    "Paste an article, report extract, RFP section or long email thread here. Aura will draft a summary, surface key insights and suggest a next step.",
  );
  const [prompt, setPrompt] = useState("Summarise for an exec audience");
  const source = simplify ? simplified : plain;
  const [edits, setEdits] = useState<Record<string, string>>({});
  const value = (k: keyof typeof plain) => edits[`${simplify}-${k}`] ?? source[k];
  const setValue = (k: keyof typeof plain, v: string) =>
    setEdits((p) => ({ ...p, [`${simplify}-${k}`]: v }));

  const cards = [
    { k: "summary" as const, title: "Summary", tone: "blue" as const, tag: "Draft" },
    { k: "insight" as const, title: "Key insight", tone: "rose" as const, tag: "Verify" },
    { k: "recommendation" as const, title: "Recommendation", tone: "lime" as const, tag: "Your call" },
  ];

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Module 02"
        title="AI Research Assistant"
        sub="Give me the dense material and I'll hand back something you can actually use in a meeting. Read it critically — I can be confidently wrong."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.4fr_1fr]">
        <Card>
          <CardTitle hint="Paste up to a few pages. Nothing leaves your browser in this prototype.">
            Source material
          </CardTitle>
          <EditableArea
            rows={12}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            aria-label="Research input"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="cta">
              <Sparkles className="h-4 w-4" /> Analyse
            </Button>
            <Button variant="quiet">Clear</Button>
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
              aria-label="Research prompt"
            />
          </Card>
          <Card>
            <Toggle
              checked={simplify}
              onChange={setSimplify}
              label="Simplify complex language"
              hint="Rewrite the outputs in plain, jargon-free English."
            />
          </Card>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-3">
        {cards.map((c) => (
          <Card key={c.k} tone={c.tone}>
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <h2 className="truncate text-lg">{c.title}</h2>
              <Tag tone="muted">{c.tag}</Tag>
            </div>
            <EditableArea
              className="mt-3"
              rows={7}
              value={value(c.k)}
              onChange={(e) => setValue(c.k, e.target.value)}
              aria-label={c.title}
            />
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
