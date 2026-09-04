import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { CloudCheck, FileImage, FileVideo, RefreshCw, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import { Card, CardTitle, SectionHeading, Button, Tag, EditableArea } from "@/components/aura/kit";
import { StatusBadge } from "@/components/aura/status";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Asset & Drive Hub — Aura Social Workspace" },
      {
        name: "description",
        content:
          "Sync creative from cloud storage and drag high-res images or video straight into draft social posts, with approval states and publishing status.",
      },
      { property: "og:title", content: "Asset & Drive Hub — Aura Social Workspace" },
      {
        property: "og:description",
        content: "Digital asset management that plugs your creative library into every draft post.",
      },
    ],
  }),
  component: Assets,
});

type Asset = { id: string; name: string; kind: "image" | "video"; size: string; folder: string };

const library: Asset[] = [
  { id: "a1", name: "brand-hero-4k.jpg", kind: "image", size: "6.2 MB", folder: "Brand / Q3" },
  { id: "a2", name: "founder-interview.mp4", kind: "video", size: "184 MB", folder: "Video / Raw" },
  { id: "a3", name: "carousel-slide-01.png", kind: "image", size: "2.1 MB", folder: "Campaigns" },
  { id: "a4", name: "product-loop-9x16.mp4", kind: "video", size: "42 MB", folder: "TikTok" },
  { id: "a5", name: "team-offsite-03.jpg", kind: "image", size: "5.4 MB", folder: "Culture" },
  { id: "a6", name: "stat-card-reach.png", kind: "image", size: "1.3 MB", folder: "Reports" },
];

function Assets() {
  const [attached, setAttached] = useState<Asset[]>([library[2]!]);
  const [over, setOver] = useState(false);
  const [caption, setCaption] = useState(
    "Draft: five signs your content calendar is quietly costing you reach. Swipe for the fixes.",
  );

  const attach = (asset: Asset) => {
    setAttached((prev) => (prev.some((a) => a.id === asset.id) ? prev : [...prev, asset]));
    toast.success(`${asset.name} attached to the draft post.`);
  };

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Module 02"
        title="Integrated Asset & Drive Hub"
        sub="Your cloud drive, mirrored beside the draft. Drag any high-res file onto the post and Aura keeps the version, folder and rights notes with it."
        action={
          <Button variant="ghost" onClick={() => toast.success("Drive re-synced — 6 assets up to date.")}>
            <RefreshCw className="h-4 w-4" /> Sync drive
          </Button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Tag tone="success">
          <CloudCheck className="h-3 w-3" /> Google Drive connected
        </Tag>
        <Tag tone="calm">Last sync 4 minutes ago</Tag>
        <Tag tone="muted">Simulated in this prototype</Tag>
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-[1.2fr_1fr]">
        <Card>
          <CardTitle hint="Drag a card onto the draft, or press attach.">Drive library</CardTitle>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {library.map((a) => (
              <article
                key={a.id}
                draggable
                onDragStart={(e) => e.dataTransfer.setData("text/plain", a.id)}
                className="focus-ring cursor-grab rounded-xl border border-border bg-background/60 p-3 transition-all duration-200 hover:-translate-y-0.5 hover:bg-lime/40 active:cursor-grabbing"
              >
                <div className="grid h-24 place-items-center rounded-lg border border-border bg-blue/40">
                  {a.kind === "image" ? (
                    <FileImage className="h-7 w-7" />
                  ) : (
                    <FileVideo className="h-7 w-7" />
                  )}
                </div>
                <p className="mt-2 truncate text-sm font-semibold">{a.name}</p>
                <p className="text-xs text-muted-foreground">
                  {a.folder} · {a.size}
                </p>
                <Button variant="quiet" className="mt-2 px-2.5 py-1 text-xs" onClick={() => attach(a)}>
                  Attach to draft
                </Button>
              </article>
            ))}
          </div>
        </Card>

        <div className="flex flex-col gap-6">
          <Card tone="rose">
            <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
              <CardTitle>Draft post</CardTitle>
              <StatusBadge status="In Review" />
            </div>
            <EditableArea
              rows={4}
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              aria-label="Draft caption"
            />
            <div
              onDragOver={(e) => {
                e.preventDefault();
                setOver(true);
              }}
              onDragLeave={() => setOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setOver(false);
                const id = e.dataTransfer.getData("text/plain");
                const asset = library.find((a) => a.id === id);
                if (asset) attach(asset);
              }}
              className={cn(
                "mt-4 grid place-items-center rounded-xl border-2 border-dashed border-border p-6 text-center transition-colors duration-200",
                over ? "border-terracotta bg-lime/50" : "bg-background/50",
              )}
            >
              <UploadCloud className="h-6 w-6" />
              <p className="mt-2 text-sm font-semibold">Drop high-res media here</p>
              <p className="text-xs text-muted-foreground">JPG, PNG, MP4 — or drag from the library</p>
            </div>
            <ul className="mt-4 flex flex-col gap-2">
              {attached.map((a) => (
                <li
                  key={a.id}
                  className="grid grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-2 rounded-xl border border-border bg-card px-3 py-2"
                >
                  {a.kind === "image" ? (
                    <FileImage className="h-4 w-4 shrink-0" />
                  ) : (
                    <FileVideo className="h-4 w-4 shrink-0" />
                  )}
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-semibold">{a.name}</span>
                    <span className="block text-xs text-muted-foreground">{a.size}</span>
                  </span>
                  <button
                    type="button"
                    onClick={() => setAttached((p) => p.filter((x) => x.id !== a.id))}
                    className="focus-ring rounded-lg px-2 py-1 text-xs font-semibold text-muted-foreground hover:text-foreground"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex flex-wrap gap-2">
              <Button
                variant="cta"
                onClick={() =>
                  toast.success("Success: Content queued for publishing to selected platforms.")
                }
              >
                Publish Now
              </Button>
              <Button variant="quiet" onClick={() => toast("Sent to Lerato and Sipho for approval.")}>
                Request approval
              </Button>
            </div>
          </Card>

          <Card>
            <CardTitle hint="Stakeholder activity on this asset set.">Approvals</CardTitle>
            <ul className="flex flex-col gap-3 text-sm">
              <li className="rounded-xl border border-border bg-background/60 p-3">
                <strong>Sipho (Brand)</strong> approved the hero crop.
              </li>
              <li className="rounded-xl border border-border bg-background/60 p-3">
                <strong>Nomsa (Legal)</strong> waiting on usage rights for founder-interview.mp4.
              </li>
            </ul>
          </Card>
        </div>
      </div>
    </AppShell>
  );
}
