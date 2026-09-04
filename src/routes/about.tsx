import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowUpRight, CalendarRange, Sparkles, FolderSync } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import { Card, CardTitle, SectionHeading, Button } from "@/components/aura/kit";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Aura — Social Media Workspace" },
      {
        name: "description",
        content:
          "Aura is a workspace built exclusively for modern social media managers, unifying content calendars, asset management, AI insights and scheduling in one platform.",
      },
      { property: "og:title", content: "About Aura — Social Media Workspace" },
      {
        property: "og:description",
        content:
          "Bridging the gap between creative strategy and seamless execution for social media and corporate comms teams.",
      },
    ],
  }),
  component: About,
});

function About() {
  return (
    <AppShell>
      <SectionHeading
        eyebrow="About"
        title="About Aura"
        sub="Why this workspace exists, and who we built it for."
        action={
          <Link to="/master-grid" className="focus-ring rounded-xl">
            <Button variant="cta">
              Open the Master Grid <ArrowUpRight className="h-4 w-4" />
            </Button>
          </Link>
        }
      />

      <Card tone="rose" className="mt-8">
        <p className="max-w-3xl text-base leading-relaxed sm:text-lg">
          Aura is a pioneering workspace designed exclusively for modern social media managers. We
          recognized that digital storytelling often gets lost in chaotic spreadsheets and
          fragmented apps. Our objective is simple: to streamline your entire social media ecosystem
          into one intelligent, unified platform. From dynamic content calendars and asset
          management to AI-driven insights and scheduling, Aura bridges the gap between creative
          strategy and seamless execution.
        </p>
      </Card>

      <div className="mt-6 grid gap-5 sm:grid-cols-3">
        {[
          {
            icon: CalendarRange,
            title: "One pipeline",
            copy: "Spreadsheet, Kanban and calendar views over the same content — no exports, no drift.",
          },
          {
            icon: FolderSync,
            title: "Creative in place",
            copy: "Drive-synced assets attach to drafts, with approvals and rights tracked alongside.",
          },
          {
            icon: Sparkles,
            title: "AI that suggests",
            copy: "Trend reads, hooks and platform-specific captions — always drafts you can edit.",
          },
        ].map(({ icon: Icon, title, copy }) => (
          <Card key={title}>
            <Icon className="h-5 w-5" />
            <CardTitle>{title}</CardTitle>
            <p className="-mt-2 text-sm text-muted-foreground">{copy}</p>
          </Card>
        ))}
      </div>
    </AppShell>
  );
}
