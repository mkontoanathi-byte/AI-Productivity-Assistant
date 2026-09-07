import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CloudCheck, FileVideo, ImagePlus, RefreshCw, Trash2, UploadCloud } from "lucide-react";
import { AppShell } from "@/components/aura/app-shell";
import { Card, CardTitle, SectionHeading, Button, Tag, EditableArea } from "@/components/aura/kit";
import { StatusBadge, STATUSES, type Status } from "@/components/aura/status";
import { PLATFORMS } from "@/components/aura/platforms";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/assets")({
  head: () => ({
    meta: [
      { title: "Asset & Drive Hub — Aura Social Workspace" },
      {
        name: "description",
        content:
          "Upload creative, preview thumbnails, write captions and pick the platforms each asset is destined for — all in one social asset gallery.",
      },
      { property: "og:title", content: "Asset & Drive Hub — Aura Social Workspace" },
      {
        property: "og:description",
        content: "Upload, caption and route creative to LinkedIn, Instagram, TikTok and X.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Assets,
});

type Asset = {
  id: string;
  name: string;
  kind: "image" | "video";
  size: string;
  folder: string;
  url?: string;
  caption: string;
  platforms: string[];
  status: Status;
};

const seeded: Asset[] = [
  {
    id: "a1",
    name: "brand-hero-4k.jpg",
    kind: "image",
    size: "6.2 MB",
    folder: "Brand / Q3",
    caption: "Hero frame for the Q3 brand refresh announcement.",
    platforms: ["linkedin", "instagram"],
    status: "In Review",
  },
  {
    id: "a2",
    name: "founder-interview.mp4",
    kind: "video",
    size: "184 MB",
    folder: "Video / Raw",
    caption: "Founder interview — pull a 45s vertical cut for TikTok.",
    platforms: ["tiktok"],
    status: "Draft",
  },
  {
    id: "a3",
    name: "carousel-slide-01.png",
    kind: "image",
    size: "2.1 MB",
    folder: "Campaigns",
    caption: "Slide one: five signs your calendar is costing you reach.",
    platforms: ["instagram", "linkedin"],
    status: "Scheduled",
  },
];

const fmtSize = (bytes: number) =>
  bytes > 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} MB` : `${Math.max(1, Math.round(bytes / 1024))} KB`;

function AssetCard({
  asset,
  onChange,
  onRemove,
}: {
  asset: Asset;
  onChange: (patch: Partial<Asset>) => void;
  onRemove: () => void;
}) {
  const togglePlatform = (id: string) =>
    onChange({
      platforms: asset.platforms.includes(id)
        ? asset.platforms.filter((p) => p !== id)
        : [...asset.platforms, id],
    });

  return (
    <article className="flex flex-col rounded-2xl border border-border bg-background/60 p-3 transition-all duration-200 hover:border-lime">
      <div className="relative grid h-36 place-items-center overflow-hidden rounded-xl border border-border bg-blue/40">
        {asset.url && asset.kind === "image" ? (
          <img src={asset.url} alt={asset.caption || asset.name} className="h-full w-full object-cover" />
        ) : asset.url && asset.kind === "video" ? (
          <video src={asset.url} muted playsInline className="h-full w-full object-cover" />
        ) : asset.kind === "video" ? (
          <FileVideo className="h-7 w-7" />
        ) : (
          <ImagePlus className="h-7 w-7" />
        )}
        <button
          type="button"
          aria-label={`Remove ${asset.name}`}
          onClick={onRemove}
          className="focus-ring absolute right-2 top-2 rounded-lg border border-border bg-card/90 p-1.5 transition-colors duration-200 hover:bg-terracotta"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </button>
      </div>

      <div className="mt-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-2">
        <div className="min-w-0">
          <p className="truncate text-sm font-semibold">{asset.name}</p>
          <p className="text-xs text-muted-foreground">
            {asset.folder} · {asset.size}
          </p>
        </div>
        <StatusBadge status={asset.status} />
      </div>

      <EditableArea
        rows={2}
        className="mt-3"
        value={asset.caption}
        placeholder="Write a caption for this asset…"
        aria-label={`Caption for ${asset.name}`}
        onChange={(e) => onChange({ caption: e.target.value })}
      />

      <p className="mt-3 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        Publish to
      </p>
      <div className="mt-2 flex flex-wrap gap-1.5">
        {PLATFORMS.map(({ id, label, icon: Icon }) => {
          const on = asset.platforms.includes(id);
          return (
            <button
              key={id}
              type="button"
              aria-pressed={on}
              onClick={() => togglePlatform(id)}
              className={cn(
                "focus-ring inline-flex items-center gap-1.5 rounded-full border border-border px-2.5 py-1 text-xs font-semibold transition-all duration-200",
                on ? "bg-terracotta text-foreground" : "bg-card text-muted-foreground hover:bg-lime/60",
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          );
        })}
      </div>

      <label className="mt-3 flex items-center gap-2 text-xs font-semibold text-muted-foreground">
        Status
        <select
          value={asset.status}
          onChange={(e) => onChange({ status: e.target.value as Status })}
          className="focus-ring flex-1 rounded-xl border border-border bg-background/70 px-2 py-1.5 text-xs font-semibold text-foreground"
        >
          {STATUSES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </label>
    </article>
  );
}

function Assets() {
  const [assets, setAssets] = useState<Asset[]>(seeded);
  const [over, setOver] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const urlsRef = useRef<string[]>([]);

  useEffect(() => () => urlsRef.current.forEach((u) => URL.revokeObjectURL(u)), []);

  const addFiles = (files: FileList | null) => {
    const list = Array.from(files ?? []).filter((f) => /^(image|video)\//.test(f.type));
    if (!list.length) {
      toast("Only images and videos can be added to the gallery.");
      return;
    }
    const next = list.map((file) => {
      const url = URL.createObjectURL(file);
      urlsRef.current.push(url);
      return {
        id: `${Date.now()}-${file.name}`,
        name: file.name,
        kind: file.type.startsWith("video") ? ("video" as const) : ("image" as const),
        size: fmtSize(file.size),
        folder: "Uploads",
        url,
        caption: "",
        platforms: [],
        status: "Draft" as Status,
      };
    });
    setAssets((prev) => [...next, ...prev]);
    toast.success(`${next.length} file${next.length > 1 ? "s" : ""} added to your gallery.`);
  };

  const patch = (id: string, p: Partial<Asset>) =>
    setAssets((prev) => prev.map((a) => (a.id === id ? { ...a, ...p } : a)));

  const readyCount = assets.filter((a) => a.platforms.length > 0 && a.caption.trim()).length;

  return (
    <AppShell>
      <SectionHeading
        eyebrow="Module 02"
        title="Integrated Asset & Drive Hub"
        sub="Upload your creative, see it as a real thumbnail, caption it once and choose exactly which channels it goes out on."
        action={
          <Button variant="ghost" onClick={() => toast.success("Drive re-synced — gallery up to date.")}>
            <RefreshCw className="h-4 w-4" /> Sync drive
          </Button>
        }
      />

      <div className="mt-6 flex flex-wrap items-center gap-2">
        <Tag tone="success">
          <CloudCheck className="h-3 w-3" /> Google Drive connected
        </Tag>
        <Tag tone="calm">{assets.length} assets in gallery</Tag>
        <Tag tone="muted">{readyCount} ready to queue</Tag>
      </div>

      <Card className="mt-6">
        <CardTitle hint="Drop files here or browse — images and video preview instantly.">
          Upload creative
        </CardTitle>
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setOver(true);
          }}
          onDragLeave={() => setOver(false)}
          onDrop={(e) => {
            e.preventDefault();
            setOver(false);
            addFiles(e.dataTransfer.files);
          }}
          className={cn(
            "grid place-items-center rounded-2xl border-2 border-dashed border-border p-8 text-center transition-colors duration-200",
            over ? "border-terracotta bg-lime/50" : "bg-background/50",
          )}
        >
          <UploadCloud className="h-7 w-7" />
          <p className="mt-2 text-sm font-semibold">Drop high-res media here</p>
          <p className="text-xs text-muted-foreground">JPG, PNG, GIF, MP4, MOV</p>
          <input
            ref={inputRef}
            type="file"
            accept="image/*,video/*"
            multiple
            className="sr-only"
            onChange={(e) => {
              addFiles(e.target.files);
              e.target.value = "";
            }}
          />
          <Button variant="cta" className="mt-4" onClick={() => inputRef.current?.click()}>
            <ImagePlus className="h-4 w-4" /> Browse files
          </Button>
        </div>
      </Card>

      <Card className="mt-6">
        <div className="mb-4 grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
          <CardTitle hint="Caption and route each asset, then queue the selected ones.">
            Asset gallery
          </CardTitle>
          <Button
            variant="cta"
            onClick={() =>
              readyCount
                ? toast.success("Success: Content queued for publishing to selected platforms.")
                : toast("Add a caption and pick at least one platform first.")
            }
          >
            Publish Now
          </Button>
        </div>
        {assets.length === 0 ? (
          <p className="rounded-xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Your gallery is empty — upload something to get started.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {assets.map((a) => (
              <AssetCard
                key={a.id}
                asset={a}
                onChange={(p) => patch(a.id, p)}
                onRemove={() => {
                  setAssets((prev) => prev.filter((x) => x.id !== a.id));
                  toast(`${a.name} removed from the gallery.`);
                }}
              />
            ))}
          </div>
        )}
      </Card>
    </AppShell>
  );
}
