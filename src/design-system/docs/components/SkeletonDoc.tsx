import { useState } from "react";
import type { ReactNode } from "react";
import { ArrowRight, FileText } from "lucide-react";
import { Skeleton } from "../../components/skeleton";
import type { SkeletonVariant } from "../../components/skeleton";
import { Card } from "../../components/card";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const VARIANTS: SkeletonVariant[] = ["text", "title", "circle", "rectangle", "rounded"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function SkeletonDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <VariantsBlock />
      <FeaturesBlock />
      <A11yBlock />
      <BestPracticesBlock />
      <CommonMistakesBlock />
      <PlaygroundBlock />
      <ExamplesBlock />
      <PropsTableBlock />
      <TokensUsedBlock />
      <NotesBlock />
      <BuiltOnBlock />
      <UsedByBlock />
      <MigrationTargetsBlock />
      <ComponentStatusBlock />
    </DocPage>
  );
}

/* ══════ Purpose ═══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Skeleton"
      lead="Skeleton is the canonical loading-placeholder primitive of the HC1 design system. Table loaders, card loaders, dialog loaders, form loaders, dashboard loaders, profile loaders, chart loaders, and detail-page loaders all compose this Skeleton rather than reimplementing shimmer treatments. One flexible primitive — five shape presets — the same subtle shimmer everywhere."
    />
  );
}

/* ══════ Anatomy ══════════════════════════════════════════════════ */

function AnatomyBlock() {
  return (
    <DocBlock
      title="Anatomy"
      lead="A Skeleton is a single inline block with a variant, a width, and a height. Everything else is composition — compose multiple Skeletons in a wrapper to match the shape of the final UI."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.lg }}>
          <Skeleton variant="circle" width={48} height={48} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
            <Skeleton variant="title" width="40%" />
            <Skeleton variant="text" lines={2} />
          </div>
          <Skeleton variant="rounded" width={96} height={36} />
        </div>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Skeleton"      desc="Root <span>. Owns variant, width, height, radius, animated, and lines." />
        <Part name="variant='text'"  desc="A line of body-text height. Pass `lines={N}` for a stack; the last bar drops to 60% for realism." />
        <Part name="variant='title'" desc="A heavier headline bar. Same chip radius as text; taller." />
        <Part name="variant='circle'" desc="Perfect circle — avatars, dots. Width defaults to match height." />
        <Part name="variant='rectangle'" desc="A block with no radius — hero images, full-bleed slots." />
        <Part name="variant='rounded'"   desc="A block with control radius — cards, buttons, inputs." />
      </div>
    </DocBlock>
  );
}

function Part({ name, desc }: { name: string; desc: string }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
      <code style={{ fontWeight: 600, color: t.color.text.primary, fontFamily: t.font.mono, fontSize: 13 }}>
        {name}
      </code>
      <span style={{ ...t.type.caption, color: t.color.text.secondary }}>{desc}</span>
    </div>
  );
}

/* ══════ Variants ═════════════════════════════════════════════════ */

const VARIANT_META: Record<SkeletonVariant, { title: string; usage: string; example: ReactNode }> = {
  text:      { title: "Text",      usage: "A line of body-text height. Pair with `lines` for paragraphs.",
    example: <Skeleton variant="text" lines={2} /> },
  title:     { title: "Title",     usage: "A headline bar — 24px tall, 60% wide by default.",
    example: <Skeleton variant="title" /> },
  circle:    { title: "Circle",    usage: "Perfect circle. Great for avatars and dot placeholders.",
    example: (
      <div style={{ display: "flex", gap: t.space.inline.sm }}>
        <Skeleton variant="circle" width={24} height={24} />
        <Skeleton variant="circle" width={32} height={32} />
        <Skeleton variant="circle" width={48} height={48} />
      </div>
    ) },
  rectangle: { title: "Rectangle", usage: "A block with no radius. Hero images, full-bleed thumbnails.",
    example: <Skeleton variant="rectangle" height={120} /> },
  rounded:   { title: "Rounded",   usage: "A block with control radius. Cards, buttons, inputs.",
    example: <Skeleton variant="rounded" height={80} /> },
};

function VariantsBlock() {
  return (
    <DocBlock
      title="Variants"
      lead="Five variants — text, title, circle, rectangle, rounded. Each sets sensible defaults for height and radius; every dimension can still be overridden."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        {VARIANTS.map((v) => (
          <div
            key={v}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
              display: "flex",
              flexDirection: "column",
              gap: t.space.stack.sm,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
                variant=&quot;{v}&quot;
              </code>
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>{VARIANT_META[v].usage}</div>
            <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, minHeight: 60, display: "flex", alignItems: "center" }}>
              {VARIANT_META[v].example}
            </div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Features ═════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock
      title="Features"
      lead="Every feature is a one-prop opt-in. No compound API, no configuration explosion — pick the dimensions you need."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: t.space.inline.md }}>
        <FeatureTile title="Width + height" hint="width / height">
          <Skeleton variant="rounded" width={160} height={40} />
        </FeatureTile>

        <FeatureTile title="Multi-line text" hint="lines={N}">
          <Skeleton variant="text" lines={3} />
        </FeatureTile>

        <FeatureTile title="Custom radius" hint="radius">
          <Skeleton variant="rectangle" height={40} radius={20} />
        </FeatureTile>

        <FeatureTile title="Static (no animation)" hint="animated={false}">
          <Skeleton variant="rounded" height={40} animated={false} />
        </FeatureTile>
      </div>
    </DocBlock>
  );
}

function FeatureTile({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div
      style={{
        padding: t.space.inline.lg,
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        display: "flex",
        flexDirection: "column",
        gap: t.space.stack.sm,
      }}
    >
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: t.space.inline.sm }}>
        <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
        <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{hint}</code>
      </div>
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control }}>
        {children}
      </div>
    </div>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "Skeletons are decorative — the root is aria-hidden='true' by default. Screen readers skip individual bars." },
          { tone: "must", text: "Guard the *parent* surface with aria-busy='true' + aria-live='polite' so the loading state is announced once, not per skeleton bar. Once the real data mounts, remove aria-busy so the surface returns to normal." },
          { tone: "must", text: "Do not put text, buttons, links, or focusable elements inside a Skeleton — it sets pointer-events: none and user-select: none so anything nested becomes inert. Compose Skeletons *next to* real content, not around it." },
          { tone: "must", text: "prefers-reduced-motion: reduce disables the shimmer animation entirely. The skeleton settles on its base surface — no residual motion, no low-contrast fallback." },
          { tone: "must", text: "The shimmer contrast (bg.subtle vs bg.muted) is deliberately gentle — it stays under the WCAG animation-brightness thresholds for photosensitive users." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Best practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <Callout tone="info" title="Skeletons represent structure — not content">
        A skeleton is a shape hint, not a fake preview. Compose the same
        layout as the real UI (avatar circle + title + two text lines →
        actual avatar + name + two-line bio). Do not draw a decorative
        pattern that has nothing to do with what will land there.
      </Callout>

      <DoDontGrid
        dos={[
          { title: "Match the final layout closely",       description: "Same number of lines, roughly the same widths, same relative positions. When the real UI mounts, the surface should feel like the skeleton just filled in." },
          { title: "Show for the load window that matters", description: "Under ~200ms → nothing (avoid flash). ~200ms–1s → skeleton. >1s → skeleton + a helpful message. Never skeleton-load a synchronous state." },
          { title: "Use `lines` for paragraphs",           description: "Passing `lines={3}` renders a 3-bar text stack with the last bar at 60% width — one prop, no manual stack." },
          { title: "Nest inside real containers",          description: "Wrap skeletons in the same Card / Panel / Row as the real content so padding and rhythm carry across the swap." },
        ]}
        donts={[
          { title: "Animate loudly",                       description: "The shimmer is deliberately subtle. Do not swap it for a bouncing spinner or a pulsing color — those live in Spinner / ProgressBar (out of scope)." },
          { title: "Fake content shapes",                  description: "Drawing a house or a chart illustration inside a skeleton is decoration, not structure. The user needs a hint of the layout, not a scene." },
          { title: "Nest interactive elements",            description: "A button inside a skeleton doesn't work — the skeleton disables pointer events. Show a skeleton for the button, then swap in the real Button." },
          { title: "Ship a specialized wrapper per surface", description: "ProfileSkeleton, CardSkeleton, TableRowSkeleton all reimplement the same primitive. Compose Skeletons directly inside the real surface's shell." },
        ]}
      />
    </DocBlock>
  );
}

function CommonMistakesBlock() {
  return (
    <DocBlock title="Common mistakes">
      <RuleList
        rules={[
          { tone: "must-not", text: "Don't render a Skeleton with `variant='circle'` and only pass width — a circle needs equal width + height, or the CSS default (40×40) applies. If you pass only width, height falls back to 40 and you get an oval." },
          { tone: "must-not", text: "Don't pass `lines` on a circle / rectangle / rounded variant. The prop is only meaningful for text and title (documented in the type)." },
          { tone: "must-not", text: "Don't chain multiple Skeletons with `animated={true}` on a fast-refresh loop (e.g. inside a virtualized list re-rendering per scroll frame). Set `animated={false}` for those — the shimmer will thrash the paint budget without a visible benefit." },
          { tone: "must-not", text: "Don't reach for Skeleton when you actually need a Spinner (indeterminate progress) or a ProgressBar (determinate progress). Skeletons imply 'the shape of the content is known and coming' — not 'something is happening'." },
          { tone: "must-not", text: "Don't override the base or shimmer color inline. The two-tone contrast is a token contract; a hand-picked hex breaks the shared reading across the product." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [variant, setVariant]   = useState<SkeletonVariant>("text");
  const [width, setWidth]       = useState("100%");
  const [height, setHeight]     = useState("");
  const [lines, setLines]       = useState(1);
  const [animated, setAnimated] = useState(true);
  const [radius, setRadius]     = useState("");

  const parsedWidth  = width.trim()  === "" ? undefined : width;
  const parsedHeight = height.trim() === "" ? undefined : height;
  const parsedRadius = radius.trim() === "" ? undefined : radius;

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered Skeleton in real time. Live JSX is generated in the dark panel at the bottom.">
      <div
        style={{
          border: `1px solid ${t.color.border.default}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div
          style={{
            padding: t.space.section.sm,
            background: t.color.background.subtle,
            borderBottom: `1px solid ${t.color.border.subtle}`,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: 160,
          }}
        >
          <div style={{ width: "100%", maxWidth: 480 }}>
            <Skeleton
              variant={variant}
              width={parsedWidth}
              height={parsedHeight}
              lines={lines > 1 ? lines : undefined}
              animated={animated}
              radius={parsedRadius}
            />
          </div>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="variant" value={variant} options={VARIANTS} onChange={(v) => setVariant(v as SkeletonVariant)} />
          <TextControl   label="width"   value={width}   onChange={setWidth}   placeholder="100% or 200px" />
          <TextControl   label="height"  value={height}  onChange={setHeight}  placeholder="(variant default)" />
          <NumberControl label="lines"   value={lines}   onChange={setLines}   min={1} max={8} />
          <TextControl   label="radius"  value={radius}  onChange={setRadius}  placeholder="(variant default)" />
          <ToggleControl label="animated" value={animated} onChange={setAnimated} />
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            borderTop: `1px solid ${t.color.border.subtle}`,
            background: t.color.background.inverse,
          }}
        >
          <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: t.space.stack.sm }}>
            Rendered code
          </div>
          <pre style={{ margin: 0, fontFamily: t.font.mono, fontSize: 12, lineHeight: 1.6, color: t.color.text.inverse, whiteSpace: "pre", overflowX: "auto" }}>
{renderCode({ variant, width: parsedWidth, height: parsedHeight, lines, animated, radius: parsedRadius })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  variant: SkeletonVariant;
  width?: string;
  height?: string;
  lines: number;
  animated: boolean;
  radius?: string;
}) {
  const attrs: string[] = [];
  if (s.variant !== "text")  attrs.push(`variant="${s.variant}"`);
  if (s.width  != null)      attrs.push(`width="${s.width}"`);
  if (s.height != null)      attrs.push(`height="${s.height}"`);
  if (s.lines > 1)           attrs.push(`lines={${s.lines}}`);
  if (s.radius != null)      attrs.push(`radius="${s.radius}"`);
  if (!s.animated)           attrs.push(`animated={false}`);
  const attrStr = attrs.length ? " " + attrs.join(" ") : "";
  return `<Skeleton${attrStr} />`;
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Illustrative — not shipped as reusable components. Every example composes the same primitive to match the shape of the final UI."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: t.space.inline.md }}>
        <ExampleTile title="Loading Table">
          <TableSkeleton />
        </ExampleTile>

        <ExampleTile title="Loading Card">
          <CardSkeleton />
        </ExampleTile>

        <ExampleTile title="Loading Profile">
          <ProfileSkeleton />
        </ExampleTile>

        <ExampleTile title="Loading Form">
          <FormSkeleton />
        </ExampleTile>

        <ExampleTile title="Loading Dashboard">
          <DashboardSkeleton />
        </ExampleTile>

        <ExampleTile title="Loading Detail Page">
          <DetailPageSkeleton />
        </ExampleTile>

        <ExampleTile title="Loading List">
          <ListSkeleton />
        </ExampleTile>

        <ExampleTile title="Loading Analytics">
          <AnalyticsSkeleton />
        </ExampleTile>
      </div>
    </DocBlock>
  );
}

function ExampleTile({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary, marginBottom: t.space.stack.sm }}>
        {title}
      </div>
      <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default, padding: t.space.inline.lg }} aria-busy="true">
        {children}
      </div>
    </div>
  );
}

function TableSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px", gap: t.space.inline.md, padding: `${t.space.stack.sm} 0`, borderBottom: `1px solid ${t.color.border.default}` }}>
        <Skeleton variant="text" width="40%" />
        <Skeleton variant="text" width="60%" />
        <Skeleton variant="text" width="50%" />
        <Skeleton variant="text" width="60%" />
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: "grid", gridTemplateColumns: "2fr 1fr 1fr 80px", gap: t.space.inline.md, padding: `${t.space.stack.md} 0`, borderBottom: i === 4 ? "none" : `1px solid ${t.color.border.subtle}`, alignItems: "center" }}>
          <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm }}>
            <Skeleton variant="circle" width={24} height={24} />
            <Skeleton variant="text" width={`${60 + i * 4}%`} />
          </div>
          <Skeleton variant="text" />
          <Skeleton variant="text" width="80%" />
          <Skeleton variant="rounded" width={64} height={20} radius={4} />
        </div>
      ))}
    </div>
  );
}

function CardSkeleton() {
  return (
    <Card>
      <Card.Content>
        <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
          <Skeleton variant="rectangle" height={140} radius={t.radius.control} />
          <Skeleton variant="title" width="70%" />
          <Skeleton variant="text" lines={2} />
          <div style={{ display: "flex", gap: t.space.inline.sm, marginTop: t.space.stack.sm }}>
            <Skeleton variant="rounded" width={96} height={36} />
            <Skeleton variant="rounded" width={80} height={36} />
          </div>
        </div>
      </Card.Content>
    </Card>
  );
}

function ProfileSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: t.space.stack.md }}>
      <Skeleton variant="circle" width={72} height={72} />
      <Skeleton variant="title" width="45%" />
      <Skeleton variant="text" width="30%" />
      <div style={{ width: "100%", display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: t.space.inline.md, marginTop: t.space.stack.md }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, alignItems: "center" }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="title" width="40%" height={20} />
          </div>
        ))}
      </div>
    </div>
  );
}

function FormSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.lg }}>
      {["Name", "Email", "Role"].map((label) => (
        <div key={label} style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
          <Skeleton variant="text" width="20%" />
          <Skeleton variant="rounded" height={36} />
        </div>
      ))}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: t.space.inline.sm, marginTop: t.space.stack.sm }}>
        <Skeleton variant="rounded" width={88} height={36} />
        <Skeleton variant="rounded" width={112} height={36} />
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.lg }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: t.space.inline.md }}>
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} style={{ padding: t.space.inline.md, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
            <Skeleton variant="text" width="60%" />
            <Skeleton variant="title" width="40%" height={28} />
          </div>
        ))}
      </div>
      <Skeleton variant="rounded" height={160} />
    </div>
  );
}

function DetailPageSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.lg }}>
      <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.md }}>
        <Skeleton variant="circle" width={56} height={56} />
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
          <Skeleton variant="title" width="40%" />
          <Skeleton variant="text" width="30%" />
        </div>
        <Skeleton variant="rounded" width={120} height={36} />
      </div>
      <Skeleton variant="text" lines={4} />
      <Skeleton variant="rounded" height={140} />
    </div>
  );
}

function ListSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} style={{ display: "flex", alignItems: "center", gap: t.space.inline.md }}>
          <Skeleton variant="circle" width={32} height={32} />
          <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
            <Skeleton variant="text" width={`${70 - i * 6}%`} />
            <Skeleton variant="text" width={`${45 - i * 4}%`} />
          </div>
        </div>
      ))}
    </div>
  );
}

function AnalyticsSkeleton() {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Skeleton variant="title" width="30%" />
        <Skeleton variant="rounded" width={100} height={28} radius={14} />
      </div>
      <Skeleton variant="rectangle" height={180} radius={8} />
      <div style={{ display: "flex", gap: t.space.inline.lg, justifyContent: "center" }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: t.space.inline.xs }}>
            <Skeleton variant="circle" width={10} height={10} />
            <Skeleton variant="text" width={40} />
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS: PropRow[] = [
  { name: "variant",  type: "'text' | 'title' | 'circle' | 'rectangle' | 'rounded'", def: "'text'",  desc: "Visual variant — sets default height + radius." },
  { name: "width",    type: "number | string",                                        def: "—",       desc: "Width. Number → px. String → CSS length. Omit for variant default." },
  { name: "height",   type: "number | string",                                        def: "—",       desc: "Height. Number → px. String → CSS length. Omit for variant default." },
  { name: "lines",    type: "number",                                                 def: "1",       desc: "Stacked bars for text/title. Last bar renders at 60% width. Ignored on other variants." },
  { name: "animated", type: "boolean",                                                def: "true",    desc: "Shimmer on / off. Turn off for very fast re-render loops." },
  { name: "radius",   type: "number | string",                                        def: "—",       desc: "Explicit border-radius override. Number → px. String → CSS length." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "140px 1.6fr 80px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
          <HeaderCell>Prop</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Default</HeaderCell>
          <HeaderCell>Description</HeaderCell>
        </div>
        {PROPS.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: "140px 1.6fr 80px 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === PROPS.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "start",
              gap: t.space.inline.md,
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontSize: 13, color: t.color.action.primary, fontWeight: 600 }}>{row.name}</code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary, wordBreak: "break-word" }}>{row.type}</code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{row.def}</code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.desc}</span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

function HeaderCell({ children }: { children: ReactNode }) {
  return (
    <span style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.14em", color: t.color.text.tertiary }}>
      {children}
    </span>
  );
}

/* ══════ Tokens used ═══════════════════════════════════════════════ */

function TokensUsedBlock() {
  const tokens: { role: string; alias: string }[] = [
    { role: "Base surface",     alias: "aliases.color.background.subtle (quiet on every HC1 background)" },
    { role: "Shimmer highlight", alias: "aliases.color.background.muted (a hair brighter — subtle contrast)" },
    { role: "Text radius",      alias: "aliases.radius.chip (subtle line rounding)" },
    { role: "Title radius",     alias: "aliases.radius.chip" },
    { role: "Circle radius",    alias: "aliases.radius.full (9999)" },
    { role: "Rectangle radius", alias: "0 — no radius, hero images and full-bleed slots" },
    { role: "Rounded radius",   alias: "aliases.radius.control (matches Button + Input + Select)" },
    { role: "Line stack gap",   alias: "aliases.spacing.stack.sm (8 — matches body-text rhythm)" },
    { role: "Shimmer cycle",    alias: "1400ms linear infinite — slow enough to feel unhurried" },
    { role: "Reduced motion",   alias: "prefers-reduced-motion: reduce disables animation entirely; surface stays on the base color" },
  ];

  return (
    <DocBlock title="Tokens used">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        {tokens.map((row, i) => (
          <div
            key={row.role}
            style={{
              display: "grid",
              gridTemplateColumns: "220px 1fr",
              padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
              borderBottom: i === tokens.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <span style={{ ...t.type.bodyS, fontWeight: 600, color: t.color.text.primary }}>{row.role}</span>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary }}>{row.alias}</code>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Notes ═════════════════════════════════════════════════════ */

function NotesBlock() {
  return (
    <DocBlock title="Implementation notes">
      <RuleList
        rules={[
          { tone: "note", text: "The root is a <span> so a Skeleton can sit inline next to text without forcing a new line. Consumers can override display via className / style if they need a block layout." },
          { tone: "note", text: "The shimmer is a 200%-wide horizontal gradient sweeping left → right via background-position. Only background-position animates — no width/height changes — so the paint cost is one composited layer per skeleton." },
          { tone: "note", text: "When `lines` > 1 on a text/title variant, the component renders a <span class='hc-skeleton-group'> wrapper with N inner skeletons. The last bar drops to 60% width for realism. Consumers who want per-line widths should render individual Skeletons in their own stack." },
          { tone: "note", text: "Every Skeleton is aria-hidden by default. The pattern for consumers is: (a) wrap the loading region in a container with aria-busy='true'; (b) render Skeletons inside; (c) remove aria-busy when the real content mounts. One announcement per state change, not per bar." },
          { tone: "note", text: "The base + shimmer colors are a token contract (bg.subtle → bg.muted). Do not override them inline — the whole point of a canonical skeleton is that every product's loading state reads at the same intensity." },
          { tone: "note", text: "prefers-reduced-motion: reduce disables the shimmer entirely. There's no low-contrast fallback — the base surface reads as a static block, which is the correct behavior when animation is suppressed (motion hint → static hint)." },
        ]}
      />

      <Callout tone="info" title="When to reach for a Spinner or Progress Bar instead">
        Skeleton = "the shape of the content is known and coming". Use a
        Spinner (indeterminate) for actions like save/submit where the
        surface is already visible. Use a Progress Bar (determinate) when
        a percentage is meaningful — a file upload, a batch job. Never
        mix the three inside one loading state.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "HC1 design tokens",  detail: "Every color, radius, and animation duration is a token alias — no hex, no raw pixels, no bespoke timings in the component." },
    { name: "HC1 surface language", detail: "Base surface is the same bg.subtle used by Table header, Badge soft, Card empty. A Skeleton reads as part of the same neutral wash family." },
    { name: "HC1 radius scale",    detail: "Variant radii pull from radius.chip / radius.control / radius.full — the same steps used by every other primitive." },
    { name: "prefers-reduced-motion", detail: "Native media query disables the shimmer entirely; no JavaScript motion detection needed. Consumers with vestibular sensitivity get a static block." },
    { name: "Native <span>",      detail: "The root is a real inline <span> — a Skeleton next to text does not force a new line. Consumers can restyle to block via className if needed." },
  ];
  return (
    <DocBlock title="Built on">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: t.space.inline.md }}>
        {rows.map((row) => (
          <div
            key={row.name}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
            }}
          >
            <div style={{ fontWeight: 600, color: t.color.text.primary, marginBottom: 4, display: "flex", alignItems: "center", gap: t.space.inline.xs }}>
              <FileText size={14} color={t.color.action.primary} />
              {row.name}
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.detail}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Used by ═══════════════════════════════════════════════════ */

function UsedByBlock() {
  const consumers = [
    { name: "Table loading",       detail: "Placeholder rows inside a Table body while data streams in. Composes Skeletons in the same grid layout as the real cells." },
    { name: "Card loading",        detail: "Content-area placeholder for asynchronous Card contents. Composes a Skeleton block that matches the final surface's rhythm." },
    { name: "Dialog loading",      detail: "Body-level placeholder inside a Dialog while its form initializes. Preferred over a spinner for forms — sets expectations for shape." },
    { name: "Form loading",        detail: "Field-shaped placeholders for a form that hasn't finished mounting. Composes label + input Skeletons per row." },
    { name: "Dashboard loading",   detail: "Widget grid placeholders. Composes metric-card Skeletons + a chart Skeleton in the real layout." },
    { name: "Profile loading",     detail: "Avatar + name + stats placeholder. Composes circle + title + text Skeletons at the real profile's positions." },
    { name: "Chart loading",       detail: "A single tall rounded Skeleton at the chart's dimensions. Legend + labels get their own small text Skeletons underneath." },
    { name: "Detail Page loading", detail: "Header + body + sidebar placeholders that mirror the final page structure. Composes multiple Skeletons in the page grid." },
    { name: "List loading",        detail: "Repeated avatar + two-line Skeletons for chat / activity / notification lists." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every loading surface in HC1 should compose this Skeleton. These are the anticipated consumers — none are shipped yet."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: t.space.inline.md }}>
        {consumers.map((c) => (
          <div
            key={c.name}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
            }}
          >
            <div style={{ fontWeight: 600, color: t.color.text.primary, marginBottom: 4, display: "flex", alignItems: "center", gap: t.space.inline.xs }}>
              <FileText size={14} color={t.color.action.primary} />
              {c.name}
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{c.detail}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Migration targets ═════════════════════════════════════════ */

function MigrationTargetsBlock() {
  const targets = [
    { name: "ClinicalIQ loading states",     detail: "Bloodhealth + HerCare panels currently render bespoke pulsing gray blocks. Migrate to Skeleton — same intent, unified shimmer + tokens." },
    { name: "SourceIQ pipeline loaders",     detail: "SourceIQ pipeline lists use a divergent gray-teal placeholder. Migrate to Skeleton — same shape, unified base surface." },
    { name: "Ad-hoc pulsing divs",           detail: "Any prototype rendering `<div class=\"pulse\">` should switch to Skeleton for the shared shimmer + reduced-motion support." },
    { name: "Empty-state loading blocks",    detail: "EmptyState.Loading skeleton currently renders its own bars. Migrate to compose Skeleton inside EmptyState for one canonical shimmer across both primitives." },
    { name: "Card content placeholders",     detail: "Ad-hoc `<div style=\"background: #eee\">` blocks inside Card content while data loads. Migrate to Skeleton variant='rounded' so radius + color both come from tokens." },
    { name: "Chart pre-render placeholders", detail: "Bare gray rectangles behind Recharts / analytics widgets while data loads. Migrate to Skeleton variant='rectangle' or 'rounded' at the chart's dimensions." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="The HC1 Skeleton is the intended replacement for every loading placeholder across the HC1 ecosystem. Do not redesign — standardize."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: t.space.inline.md }}>
        {targets.map((c) => (
          <div
            key={c.name}
            style={{
              padding: t.space.inline.lg,
              border: `1px solid ${t.color.border.subtle}`,
              borderRadius: t.radius.control,
              background: t.color.background.default,
            }}
          >
            <div style={{ fontWeight: 600, color: t.color.text.primary, marginBottom: 4, display: "flex", alignItems: "center", gap: t.space.inline.xs }}>
              <ArrowRight size={14} color={t.color.action.primary} />
              {c.name}
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{c.detail}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Component status ══════════════════════════════════════════ */

function ComponentStatusBlock() {
  const rows: { label: string; ok: boolean }[] = [
    { label: "HC1 Design Tokens only",  ok: true },
    { label: "Semantic aliases only",   ok: true },
    { label: "Accessible",              ok: true },
    { label: "Reduced-motion support",  ok: true },
    { label: "Responsive",              ok: true },
    { label: "Composable API",          ok: true },
    { label: "Production ready",        ok: true },
  ];
  return (
    <DocBlock title="Component status">
      <div
        style={{
          border: `1px solid ${t.color.status.success.border}`,
          borderRadius: t.radius.control,
          background: t.color.status.success.bg,
          padding: t.space.inline.lg,
        }}
      >
        <div style={{ ...t.type.bodyS, fontWeight: 700, color: t.color.status.success.fg, marginBottom: t.space.stack.sm, textTransform: "uppercase", letterSpacing: "0.14em" }}>
          Shipped · Quality checklist
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: t.space.inline.sm }}>
          {rows.map((r) => (
            <div key={r.label} style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm, color: t.color.status.success.fg, fontSize: 14 }}>
              <span aria-hidden="true">✓</span>
              <span>{r.label}</span>
            </div>
          ))}
        </div>
      </div>
    </DocBlock>
  );
}

/* ══════ Playground control primitives ═════════════════════════════ */

function SelectControl({ label, value, options, onChange }: { label: string; value: string; options: readonly string[]; onChange: (v: string) => void }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        style={{
          height: 36, padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default, color: t.color.text.primary,
          fontFamily: t.font.sans, fontSize: 14,
        }}
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </label>
  );
}

function TextControl({ label, value, onChange, placeholder, disabled }: { label: string; value: string; onChange: (v: string) => void; placeholder?: string; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="text"
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        style={{
          height: 36, padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default, color: t.color.text.primary,
          fontFamily: t.font.sans, fontSize: 14,
        }}
      />
    </label>
  );
}

function NumberControl({ label, value, onChange, min, max, disabled }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number; disabled?: boolean }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs, opacity: disabled ? 0.5 : 1 }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 1}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
        disabled={disabled}
        style={{
          height: 36, padding: `0 ${t.space.inline.md}`,
          borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
          background: t.color.background.default, color: t.color.text.primary,
          fontFamily: t.font.sans, fontSize: 14,
        }}
      />
    </label>
  );
}

function ToggleControl({ label, value, onChange, disabled }: { label: string; value: boolean; onChange: (v: boolean) => void; disabled?: boolean }) {
  return (
    <label
      style={{
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: t.space.inline.md, padding: `${t.space.stack.sm} ${t.space.inline.md}`,
        borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default,
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <ControlLabel>{label}</ControlLabel>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
    </label>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return <span style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{children}</span>;
}
