import { createFileRoute, Link } from "@tanstack/react-router";
import { toast } from "sonner";
import { ArrowUpRight, Table2, FolderSync, Sparkles, Send, TrendingUp } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import { Card, CardTitle, SectionHeading, Tag, Button } from "@/components/aura/kit";
import { StatusBadge } from "@/components/aura/status";
import { ConnectedPlatforms } from "@/components/aura/platforms";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aura — Social Media Management Workspace" },
      {
        name: "description",
        content:
          "Aura unites content calendars, a spreadsheet-Kanban master grid, asset management, AI trend analysis and cross-platform analytics for social media and comms teams.",
      },
      { property: "og:title", content: "Aura — Social Media Management Workspace" },
      {
        property: "og:description",
        content:
          "Plan, approve, schedule and publish across LinkedIn, Instagram, TikTok and X from one intelligent workspace.",
      },
    ],
  }),
  component: Dashboard,
});

const modules = [
  {
    to: "/master-grid" as const,
    icon: Table2,
    title: "The Master Grid",
    copy: "Spreadsheet, Kanban and calendar over one content pipeline.",
    tone: "blue" as const,
  },
  {
    to: "/assets" as const,
    icon: FolderSync,
    title: "Asset & Drive Hub",
    copy: "Drive-synced creative, dragged straight into draft posts.",
    tone: "rose" as const,
  },
  {
    to: "/research" as const,
    icon: Sparkles,
    title: "Trend & Hook AI",
    copy: "Trend reads, hooks and platform-native captions.",
    tone: "lime" as const,
  },
  {
    to: "/about" as const,
    icon: ArrowUpRight,
    title: "About Aura",
    copy: "Why we built a workspace only for social teams.",
    tone: "default" as const,
  },
];

const analytics = [
  { label: "Engagement rate", value: "5.8%", delta: "+1.2 pts", bars: [40, 55, 48, 70, 82, 76, 91] },
  { label: "Reach (7d)", value: "412k", delta: "+18%", bars: [30, 42, 60, 52, 68, 74, 88] },
  { label: "Conversions", value: "1,284", delta: "+9%", bars: [55, 48, 62, 58, 66, 71, 80] },
];

const week = [
  { day: "Mon 7", title: "Behind the build", platform: "LinkedIn", status: "In Review" as const },
  { day: "Tue 8", title: "3 hooks that stopped the scroll", platform: "TikTok", status: "Scheduled" as const },
  { day: "Wed 9", title: "Carousel: broken calendars", platform: "Instagram", status: "Draft" as const },
  { day: "Thu 10", title: "Open slot", platform: "—", status: "Draft" as const },
  { day: "Fri 11", title: "Client spotlight", platform: "LinkedIn", status: "In Review" as const },
];

function Dashboard() {
  return (
    <AppShell>
      <SectionHeading
        eyebrow="Thursday, 3 September"
        title="Good morning, Anathi"
        sub="Two posts need approval before 11:00, TikTok reach is climbing, and this week's grid is 80% filled. Nothing publishes until you say so."
        action={
          <Button
            variant="cta"
            onClick={() =>
              toast.success("Success: Content queued for publishing to selected platforms.")
            }
          >
            <Send className="h-4 w-4" /> Publish Now
          </Button>
        }
      />

      <div className="mt-8 grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: "Scheduled this week", value: "14", tone: "lime" as const },
          { label: "Awaiting approval", value: "2", tone: "rose" as const },
          { label: "Assets synced", value: "312", tone: "blue" as const },
          { label: "Channels active", value: "3 / 4", tone: "default" as const },
        ].map((s) => (
          <Card key={s.label} tone={s.tone}>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
              {s.label}
            </p>
            <p className="mt-2 font-display text-3xl">{s.value}</p>
          </Card>
        ))}
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.5fr_1fr]">
        <Card>
          <CardTitle hint="Week of 7 September — pulled from the Master Grid.">
            Planning calendar
          </CardTitle>
          <ul className="flex flex-col gap-3">
            {week.map((row) => (
              <li
                key={row.day}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 rounded-xl border border-border bg-background/60 px-4 py-3 transition-colors duration-200 hover:bg-lime/50"
              >
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold">{row.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {row.day} · {row.platform}
                  </p>
                </div>
                <StatusBadge status={row.status} />
              </li>
            ))}
          </ul>
          <div className="mt-4">
            <Link to="/master-grid" className="focus-ring rounded-xl">
              <Button variant="ghost">
                Open the Master Grid <ArrowUpRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card tone="blue">
            <CardTitle hint="Last 7 days across all connected channels.">
              Cross-platform analytics
            </CardTitle>
            <div className="flex flex-col gap-5">
              {analytics.map((a) => (
                <div key={a.label}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-3">
                    <p className="truncate text-sm font-semibold">{a.label}</p>
                    <Tag tone="success">
                      <TrendingUp className="h-3 w-3" /> {a.delta}
                    </Tag>
                  </div>
                  <p className="font-display text-2xl">{a.value}</p>
                  <div className="mt-2 flex h-14 items-end gap-1.5">
                    {a.bars.map((b, i) => (
                      <span
                        key={i}
                        style={{ height: `${b}%` }}
                        className="flex-1 rounded-t-md bg-terracotta/70 transition-all duration-300 hover:bg-terracotta"
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </Card>
          <ConnectedPlatforms />
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
