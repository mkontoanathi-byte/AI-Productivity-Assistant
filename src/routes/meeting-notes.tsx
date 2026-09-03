import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Send, ListChecks } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import {
  Card,
  CardTitle,
  SectionHeading,
  Button,
  EditableArea,
  PromptTemplates,
  Tag,
  useEditableList,
} from "@/components/aura/kit";

export const Route = createFileRoute("/meeting-notes")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer — Aura Workspace" },
      {
        name: "description",
        content:
          "Turn raw meeting notes into editable key points, decisions and action items with owners and deadlines, plus a workplace assistant chat.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer — Aura Workspace" },
      {
        property: "og:description",
        content: "Key points, decisions and owned action items extracted from raw notes.",
      },
    ],
  }),
  component: MeetingNotes,
});

const templates = [
  "Summarise for people who missed it",
  "Extract decisions only",
  "List action items with owners",
  "Draft a follow-up email",
];

const actions = [
  { text: "Circulate revised budget narrative to finance", who: "Anathi", due: "Fri 5 Sep", tone: "urgent" as const },
  { text: "Book customer interviews for onboarding research", who: "Thabo", due: "Mon 8 Sep", tone: "important" as const },
  { text: "Update the pricing one-pager with new tiers", who: "Lerato", due: "Wed 10 Sep", tone: "calm" as const },
];

type Msg = { role: "you" | "aura"; text: string };

const replies = [
  "Here's a draft follow-up: thank everyone, restate the two decisions, and flag that the pricing one-pager lands Wednesday. Want it shorter or warmer?",
  "I'd flag one risk: the customer interviews depend on finance signing off first. Shall I add a dependency note to Thabo's action item?",
  "Drafted. I've kept it to five lines and left the deadline blank so you can confirm it with Lerato.",
];

function MeetingNotes() {
  const [raw, setRaw] = useState(
    "Weekly leadership sync — attendees: Anathi, Thabo, Lerato, Sipho.\n\nBudget narrative still needs the finance framing reworked. Agreed to ship revised version Friday. Onboarding research: we need five customer interviews before we commit to the new flow. Pricing tiers signed off in principle, one-pager to follow.",
  );
  const [prompt, setPrompt] = useState("Summarise for people who missed it");
  const keyPoints = useEditableList([
    "Budget narrative needs a clearer finance framing before it goes to the board.",
    "Onboarding redesign is blocked on customer evidence, not on design capacity.",
    "New pricing tiers are agreed in principle; collateral is the remaining gap.",
  ]);
  const decisions = useEditableList([
    "Ship the revised budget narrative on Friday, finance framing first.",
    "Do not commit to the new onboarding flow until five customer interviews are done.",
  ]);

  const [messages, setMessages] = useState<Msg[]>([
    { role: "aura", text: "I've read the notes. Want a follow-up email, a risk check, or just the action items?" },
  ]);
  const [draft, setDraft] = useState("");
  const [turn, setTurn] = useState(0);

  const send = () => {
    const text = draft.trim();
    if (!text) return;
    setDraft("");
    setMessages((m) => [...m, { role: "you", text }]);
    const reply = replies[turn % replies.length] ?? replies[0]!;
    setTurn((t) => t + 1);
    setTimeout(() => setMessages((m) => [...m, { role: "aura", text: reply }]), 500);
  };

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Module 03"
        title="Meeting Notes Summarizer"
        sub="Drop the messy notes in. I'll pull out what was decided and who owes what — then you correct me where I'm off."
      />

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardTitle hint="Bullet points, transcript fragments, half sentences — all fine.">
            Raw notes
          </CardTitle>
          <EditableArea
            rows={11}
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            aria-label="Raw meeting notes"
          />
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="cta">
              <ListChecks className="h-4 w-4" /> Summarise notes
            </Button>
            <Button variant="quiet">Clear</Button>
          </div>
        </Card>
        <Card tone="blue">
          <CardTitle>Prompt templates</CardTitle>
          <PromptTemplates templates={templates} onPick={setPrompt} />
          <EditableArea
            className="mt-4"
            rows={3}
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            aria-label="Meeting notes prompt"
          />
        </Card>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        <Card>
          <CardTitle hint="Editable — trim anything that misses the room's intent.">Key points</CardTitle>
          <div className="flex flex-col gap-3">
            {keyPoints.items.map((t, i) => (
              <EditableArea
                key={i}
                rows={3}
                value={t}
                onChange={(e) => keyPoints.update(i, e.target.value)}
                aria-label={`Key point ${i + 1}`}
              />
            ))}
          </div>
        </Card>
        <Card tone="rose">
          <CardTitle hint="Confirm these before they're treated as final.">Decisions</CardTitle>
          <div className="flex flex-col gap-3">
            {decisions.items.map((t, i) => (
              <EditableArea
                key={i}
                rows={3}
                value={t}
                onChange={(e) => decisions.update(i, e.target.value)}
                aria-label={`Decision ${i + 1}`}
              />
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6">
        <CardTitle hint="Owners and deadlines are suggestions — reassign as needed.">
          Action items
        </CardTitle>
        <ul className="flex flex-col gap-3">
          {actions.map((a) => (
            <li
              key={a.text}
              className="grid gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors duration-200 hover:bg-lime/50 sm:grid-cols-[minmax(0,1fr)_auto] sm:items-center"
            >
              <p className="min-w-0 text-sm font-semibold">{a.text}</p>
              <div className="flex shrink-0 flex-wrap gap-2">
                <Tag tone="success">{a.who}</Tag>
                <Tag tone={a.tone}>{a.due}</Tag>
              </div>
            </li>
          ))}
        </ul>
      </Card>

      <Card className="mt-6">
        <CardTitle hint="Multi-turn, context-aware, and always a draft.">
          Workplace assistant
        </CardTitle>
        <div className="flex max-h-96 flex-col gap-3 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div
              key={i}
              className={
                m.role === "you"
                  ? "ml-auto max-w-[85%] rounded-2xl rounded-br-md bg-terracotta/70 px-4 py-3 text-sm"
                  : "mr-auto max-w-[85%] rounded-2xl rounded-bl-md bg-blue/70 px-4 py-3 text-sm"
              }
            >
              <p className="mb-1 text-[0.65rem] font-bold uppercase tracking-[0.14em] text-muted-foreground">
                {m.role === "you" ? "You" : "Aura"}
              </p>
              {m.text}
            </div>
          ))}
        </div>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
          className="mt-4 grid grid-cols-[minmax(0,1fr)_auto] gap-2"
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder="Ask Aura to draft, check or rewrite something…"
            aria-label="Message Aura"
            className="focus-ring min-w-0 rounded-xl border border-border bg-background/70 px-4 py-2.5 text-sm transition-colors duration-200 hover:border-lime"
          />
          <Button variant="cta" type="submit" className="shrink-0">
            <Send className="h-4 w-4" /> Send
          </Button>
        </form>
      </Card>
    </AppShell>
  );
}
