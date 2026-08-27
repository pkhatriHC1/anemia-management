import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  ArrowRight,
  FileText,
  Layers,
  Search,
} from "lucide-react";
import { Pagination } from "../../components/pagination";
import type { PaginationSize } from "../../components/pagination";
import { Table } from "../../components/table";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

const SIZES: PaginationSize[] = ["sm", "md", "lg"];

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function PaginationDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <SizesBlock />
      <FeaturesBlock />
      <StatesBlock />
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
      title="The canonical HC1 Pagination"
      lead="Pagination is the canonical navigation primitive for paged data in the HC1 design system. Patient lists, user lists, reports, search results, orders, audit logs, and every Table with more than one page compose this Pagination rather than reimplementing button sizing, current-page treatment, ellipsis rhythm, or the 'X of Y' summary. It owns the visual language, the ARIA landmark, and the page-window algorithm — so a paged list in one product reads exactly like a paged list in another."
    />
  );
}

/* ══════ Anatomy ══════════════════════════════════════════════════ */

function AnatomyBlock() {
  const [page, setPage] = useState(3);
  return (
    <DocBlock
      title="Anatomy"
      lead="A Pagination is a compound of six subcomponents. Root positions Info / PageList / PageSize with a flex row; Previous and Next typically sit inside PageList."
    >
      <div
        style={{
          padding: t.space.section.sm,
          border: `1px dashed ${t.color.border.strong}`,
          borderRadius: t.radius.control,
          background: t.color.background.subtle,
        }}
      >
        <Pagination
          page={page}
          pageCount={12}
          onPageChange={setPage}
          pageSize={25}
          totalItems={287}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageSizeChange={() => {}}
        >
          <Pagination.Info />
          <Pagination.PageList>
            <li className="hc-pagination__item"><Pagination.Previous /></li>
            {/* PageList auto-generates when it has no children — this block
                shows all parts side by side. */}
            <li className="hc-pagination__item"><Pagination.Page page={1} /></li>
            <li className="hc-pagination__item"><Pagination.Page page={2} /></li>
            <li className="hc-pagination__item"><Pagination.Page page={3} /></li>
            <li className="hc-pagination__item"><Pagination.Page page={4} /></li>
            <li className="hc-pagination__item"><span className="hc-pagination__ellipsis" aria-hidden="true">…</span></li>
            <li className="hc-pagination__item"><Pagination.Page page={12} /></li>
            <li className="hc-pagination__item"><Pagination.Next /></li>
          </Pagination.PageList>
          <Pagination.PageSize />
        </Pagination>
      </div>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Pagination"          desc="Root <nav aria-label='Pagination'>. Owns page, pageCount, size, siblings, boundaries, disabled, and loading." />
        <Part name="Pagination.Info"     desc="Results summary — 'Showing 51–75 of 287' when pageSize + totalItems, else 'Page X of Y'." />
        <Part name="Pagination.PageList" desc="<ul> of page buttons. Auto-generates the page window when it has no children; otherwise renders the authored children." />
        <Part name="Pagination.Page"     desc="Individual page <button>. Marks the active page with aria-current='page' and a brand fill." />
        <Part name="Pagination.Previous" desc="Prev-page control. Disabled at page 1. Chevron + optional label." />
        <Part name="Pagination.Next"     desc="Next-page control. Disabled at the last page. Label + chevron." />
        <Part name="Pagination.PageSize" desc="Optional 'Per page' selector — renders nothing unless pageSizeOptions + onPageSizeChange are provided." />
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

/* ══════ Composition ═══════════════════════════════════════════════ */

function CompositionBlock() {
  return (
    <DocBlock
      title="Composition"
      lead="Pagination is controlled — the consumer owns `page` and reacts to `onPageChange`. The primitive never remembers state across renders. Compose the subcomponents you need; leave the rest out."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: t.space.inline.md }}>
        <CodeCard title="Do — one Pagination, controlled page">
{`const [page, setPage] = useState(1);

<Pagination
  page={page}
  pageCount={12}
  onPageChange={setPage}
>
  <Pagination.PageList>
    <li><Pagination.Previous /></li>
    {/* auto-window here */}
    <li><Pagination.Next /></li>
  </Pagination.PageList>
</Pagination>`}
        </CodeCard>
        <CodeCard title="Do — with results summary + page size">
{`<Pagination
  page={page}
  pageCount={12}
  pageSize={25}
  totalItems={287}
  pageSizeOptions={[10, 25, 50, 100]}
  onPageChange={setPage}
  onPageSizeChange={setSize}
>
  <Pagination.Info />
  <Pagination.PageList />
  <Pagination.PageSize />
</Pagination>`}
        </CodeCard>
      </div>

      <Callout tone="info" title="Pagination is stateless — the surface owns the data">
        Pagination does not fetch, cache, or transform data. It navigates.
        The consumer holds <code style={codeInline}>page</code> +{" "}
        <code style={codeInline}>pageSize</code> in state, decides how to
        slice or refetch data, and re-renders with new props. The
        primitive stays minimal so it composes cleanly inside Tables,
        Cards, and dedicated list views.
      </Callout>
    </DocBlock>
  );
}

const codeInline: React.CSSProperties = {
  fontFamily: t.font.mono,
  background: t.color.background.muted,
  padding: "0 4px",
  borderRadius: 3,
  fontSize: 12,
};

function CodeCard({ title, children }: { title: string; children: string }) {
  return (
    <div style={{
      display: "flex", flexDirection: "column", gap: t.space.stack.sm,
      padding: t.space.inline.lg,
      border: `1px solid ${t.color.border.subtle}`,
      borderRadius: t.radius.control,
      background: t.color.background.default,
    }}>
      <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
      <pre style={{
        margin: 0, padding: t.space.inline.md,
        background: t.color.background.inverse,
        color: t.color.text.inverse,
        borderRadius: t.radius.control,
        fontFamily: t.font.mono, fontSize: 12, lineHeight: 1.6,
        whiteSpace: "pre", overflowX: "auto",
      }}>{children}</pre>
    </div>
  );
}

/* ══════ Sizes ═════════════════════════════════════════════════════ */

function SizesBlock() {
  const SIZE_NOTE: Record<PaginationSize, string> = {
    sm: "Compact — 28×28 buttons + 12px text. For dense list surfaces and Table footers where an inline sm Button also fits.",
    md: "Default — 36×36 buttons + 14px text. Matches Button md and Table row height.",
    lg: "Comfortable — 44×44 buttons + 16px text. For touch surfaces and hero pagination bars.",
  };
  return (
    <DocBlock
      title="Sizes"
      lead="Three sizes that map 1:1 to the Button ladder — sm=28, md=36, lg=44 — so an inline Button sits flush with a page button."
    >
      <div style={{ display: "grid", gap: t.space.section.sm }}>
        {SIZES.map((s) => (
          <div key={s}>
            <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.sm, marginBottom: t.space.stack.sm }}>
              <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>
                size=&quot;{s}&quot;
              </code>
              <span style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>— {SIZE_NOTE[s]}</span>
            </div>
            <div style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
              <StaticPagination page={3} pageCount={12} size={s} />
            </div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

function StaticPagination({ page, pageCount, size }: { page: number; pageCount: number; size?: PaginationSize }) {
  const [p, setP] = useState(page);
  return (
    <Pagination page={p} pageCount={pageCount} onPageChange={setP} size={size}>
      <Pagination.PageList>
        <li className="hc-pagination__item"><Pagination.Previous /></li>
        <PageWindowChildren page={p} pageCount={pageCount} />
        <li className="hc-pagination__item"><Pagination.Next /></li>
      </Pagination.PageList>
    </Pagination>
  );
}

/**
 * Renders the auto page window inline as <li> children — used by the
 * example composition above so the Previous/Next bookend the window.
 */
function PageWindowChildren({ page, pageCount, siblingCount = 1, boundaryCount = 1 }: { page: number; pageCount: number; siblingCount?: number; boundaryCount?: number }) {
  const items = useMemo(() => buildPageWindowLocal(page, pageCount, siblingCount, boundaryCount), [page, pageCount, siblingCount, boundaryCount]);
  return (
    <>
      {items.map((item, i) =>
        item.type === "ellipsis" ? (
          <li key={`e-${item.key}-${i}`} className="hc-pagination__item">
            <span className="hc-pagination__ellipsis" aria-hidden="true">…</span>
          </li>
        ) : (
          <li key={`p-${item.page}`} className="hc-pagination__item">
            <Pagination.Page page={item.page} />
          </li>
        ),
      )}
    </>
  );
}

// Local re-export of the algorithm for use inside custom PageList compositions.
// Mirrors the primitive's `buildPageWindow` — kept as a doc-local helper so
// the doc file doesn't import from a deep component internal.
function buildPageWindowLocal(
  page: number,
  pageCount: number,
  siblingCount: number,
  boundaryCount: number,
): Array<{ type: "page"; page: number } | { type: "ellipsis"; key: "start" | "end" }> {
  const safePageCount = Math.max(1, Math.floor(pageCount));
  const safePage      = Math.min(Math.max(1, Math.floor(page)), safePageCount);
  const sibling       = Math.max(0, Math.floor(siblingCount));
  const boundary      = Math.max(0, Math.floor(boundaryCount));

  const startPages = range(1, Math.min(boundary, safePageCount));
  const endPages   = range(Math.max(safePageCount - boundary + 1, boundary + 1), safePageCount);

  const siblingsStart = Math.max(Math.min(safePage - sibling, safePageCount - boundary - sibling * 2 - 1), boundary + 2);
  const siblingsEnd   = Math.min(Math.max(safePage + sibling, boundary + sibling * 2 + 2), endPages.length > 0 ? endPages[0] - 2 : safePageCount - 1);

  const items: Array<{ type: "page"; page: number } | { type: "ellipsis"; key: "start" | "end" }> = [];
  for (const p of startPages) items.push({ type: "page", page: p });
  if (siblingsStart > boundary + 2) items.push({ type: "ellipsis", key: "start" });
  else if (boundary + 1 < safePageCount - boundary) items.push({ type: "page", page: boundary + 1 });

  for (const p of range(siblingsStart, siblingsEnd)) items.push({ type: "page", page: p });

  if (siblingsEnd < safePageCount - boundary - 1) items.push({ type: "ellipsis", key: "end" });
  else if (safePageCount - boundary > boundary) items.push({ type: "page", page: safePageCount - boundary });

  for (const p of endPages) items.push({ type: "page", page: p });

  // Dedupe adjacent
  const out: typeof items = [];
  const seen = new Set<number>();
  for (const it of items) {
    if (it.type === "page") {
      if (seen.has(it.page)) continue;
      seen.add(it.page);
    }
    const prev = out[out.length - 1];
    if (prev && prev.type === "ellipsis" && it.type === "ellipsis") continue;
    out.push(it);
  }
  return out;
}

function range(a: number, b: number): number[] {
  const out: number[] = [];
  for (let i = a; i <= b; i++) out.push(i);
  return out;
}

/* ══════ Features ═════════════════════════════════════════════════ */

function FeaturesBlock() {
  return (
    <DocBlock
      title="Features"
      lead="Every feature is a one-prop opt-in. Compose the subcomponents you need — nothing more."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(340px, 1fr))", gap: t.space.inline.md }}>
        <FeatureTile title="Prev + Next" hint="<Pagination.Previous /> + Next">
          <StaticPagination page={3} pageCount={12} />
        </FeatureTile>

        <FeatureTile title="Page numbers + ellipsis" hint="<Pagination.PageList />">
          <StaticPagination page={7} pageCount={50} />
        </FeatureTile>

        <FeatureTile title="Current page" hint="aria-current='page'">
          <StaticPagination page={5} pageCount={8} />
        </FeatureTile>

        <FeatureTile title="Results summary" hint="<Pagination.Info />">
          <PaginationWithInfo />
        </FeatureTile>

        <FeatureTile title="Page size selector" hint="<Pagination.PageSize />">
          <PaginationWithSize />
        </FeatureTile>

        <FeatureTile title="Compact (icon-only nav)" hint="labelHidden">
          <CompactPagination />
        </FeatureTile>
      </div>
    </DocBlock>
  );
}

function FeatureTile({ title, hint, children }: { title: string; hint: string; children: ReactNode }) {
  return (
    <div style={{
      padding: t.space.inline.lg,
      border: `1px solid ${t.color.border.subtle}`,
      borderRadius: t.radius.control,
      background: t.color.background.default,
      display: "flex",
      flexDirection: "column",
      gap: t.space.stack.sm,
    }}>
      <div style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: t.space.inline.sm }}>
        <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
        <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{hint}</code>
      </div>
      <div style={{ padding: t.space.inline.sm, background: t.color.background.subtle, borderRadius: t.radius.control }}>
        {children}
      </div>
    </div>
  );
}

function PaginationWithInfo() {
  const [page, setPage] = useState(3);
  return (
    <Pagination page={page} pageCount={12} onPageChange={setPage} pageSize={25} totalItems={287}>
      <Pagination.Info />
      <Pagination.PageList />
    </Pagination>
  );
}

function PaginationWithSize() {
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(25);
  return (
    <Pagination page={page} pageCount={20} onPageChange={setPage} pageSize={size} pageSizeOptions={[10, 25, 50, 100]} onPageSizeChange={setSize}>
      <Pagination.PageList />
      <Pagination.PageSize />
    </Pagination>
  );
}

function CompactPagination() {
  const [page, setPage] = useState(3);
  return (
    <Pagination page={page} pageCount={20} onPageChange={setPage} size="sm">
      <Pagination.PageList>
        <li className="hc-pagination__item"><Pagination.Previous labelHidden /></li>
        <PageWindowChildren page={page} pageCount={20} />
        <li className="hc-pagination__item"><Pagination.Next labelHidden /></li>
      </Pagination.PageList>
    </Pagination>
  );
}

/* ══════ States ═══════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock
      title="States"
      lead="Three lifecycle states — default, disabled, and loading. Every state uses native semantics so screen readers announce the right thing."
    >
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: t.space.inline.md }}>
        <StateTile label="Default" description="Interactive. Prev/Next disable at the ends; the current page carries aria-current='page'.">
          <StaticPagination page={3} pageCount={12} />
        </StateTile>
        <StateTile label="Disabled" description="Every button renders disabled. Root emits aria-disabled='true'. Clicks are ignored.">
          <Pagination page={3} pageCount={12} disabled onPageChange={() => {}}>
            <Pagination.PageList />
          </Pagination>
        </StateTile>
        <StateTile label="Loading" description="Root emits aria-busy='true' and dims the surface. Controls disable so users can't fire duplicate fetches.">
          <Pagination page={3} pageCount={12} loading onPageChange={() => {}}>
            <Pagination.PageList />
          </Pagination>
        </StateTile>
      </div>
    </DocBlock>
  );
}

function StateTile({ label, description, children }: { label: string; description: string; children: ReactNode }) {
  return (
    <div style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default, display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>{label}</div>
      <div style={{ padding: t.space.inline.sm, background: t.color.background.subtle, borderRadius: t.radius.control }}>{children}</div>
      <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{description}</div>
    </div>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The root is a <nav> landmark with aria-label='Pagination' by default. Consumers can pass their own aria-label if there are multiple paginations on the page (e.g. 'Patient list pagination')." },
          { tone: "must", text: "The current page carries aria-current='page' — screen readers announce it as the active page. All other page buttons render as regular <button type='button'> with a descriptive aria-label ('Go to page 4')." },
          { tone: "must", text: "Previous / Next disable natively when at the first / last page (or when the parent is disabled / loading). Disabled buttons use the native `disabled` attribute so keyboard tab-through skips them and screen readers announce them as unavailable." },
          { tone: "must", text: "Every button uses the same 2px brand focus ring as Button, Input, Select, Card, Dialog, Table, Badge, Alert, and Toast. Tab / Shift+Tab move linearly through the visible controls; Enter / Space activate." },
          { tone: "must", text: "Pagination.Info renders inside an aria-live='polite' region so the summary announces when it changes (e.g. after a page change). Consumers who want silent updates can wrap Info in a container with aria-live='off'." },
          { tone: "must", text: "The ellipsis renders as a <span aria-hidden='true'> — visual separator only. Screen readers hear the surrounding page numbers directly." },
          { tone: "must", text: "Pagination.PageSize renders a real <label> + <select> pair with an id linkage — screen readers announce 'Per page, combobox, 25'." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses the hover / focus transitions to 0ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Best practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <DoDontGrid
        dos={[
          { title: "Show pagination when there is more than one page", description: "If the entire dataset fits on one page, do not render Pagination — an empty control is noise, not clarity." },
          { title: "Prefer clarity over density",                       description: "Show Prev + Next + the current window (siblingCount=1, boundaryCount=1). Jumping straight to a page 42 pages away is rare and should not dominate the UI." },
          { title: "Pair with a results summary",                       description: "Add Pagination.Info to answer 'where am I in this dataset'. It's a small addition that dramatically lowers cognitive load on long lists." },
          { title: "Reset to page 1 when filters change",               description: "A filter change usually invalidates the current page (page 12 of a 5-page result set is meaningless). The consumer is responsible for resetting — the primitive can't know." },
        ]}
        donts={[
          { title: "Roll pagination + infinite scroll into one surface", description: "Pick one navigation model. Mixing them is confusing — the user doesn't know if scrolling loads more or if they should click Next." },
          { title: "Show every page button",                            description: "Displaying 1..2..3..4..5..6..7..8..9..10..11..12..13..14..15..16..17..18..19..20 is a wall of chips. The window + ellipsis is standard for a reason." },
          { title: "Hide Prev/Next when at the ends",                   description: "Layout jumps confuse users. Keep them present but disabled — same width, same rhythm, no surprise." },
          { title: "Use Pagination for a wizard or a slideshow",        description: "Those are step controls with their own semantics (aria-current='step', linear flow). Reach for a Stepper primitive, not Pagination." },
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
          { tone: "must-not", text: "Don't build a data grid on top of this. Column sorting, resizing, virtualization, and inline editing belong in a future DataGrid primitive that composes Table + Pagination, not in this component." },
          { tone: "must-not", text: "Don't build infinite scroll or virtual scrolling here. Those are separate navigation primitives — they invalidate pagination semantics (no discrete pages, no total count, no 'go to page 5')." },
          { tone: "must-not", text: "Don't ship server-side data-fetching hooks bundled with Pagination. The primitive stays presentational — how the consumer fetches, caches, or refetches data is out of scope." },
          { tone: "must-not", text: "Don't make the current-page button clickable. It's a no-op that confuses users and duplicates focus. The primitive skips onPageChange when the target page is the current page." },
          { tone: "must-not", text: "Don't override the focus ring or the current-page color inline. The primary tint is the same as Button primary — that consistency is the whole point of a canonical primitive." },
          { tone: "must-not", text: "Don't render Pagination without also rendering Prev + Next — even on short lists. The pattern is: bookend controls + numbered window. Skipping either half breaks the mental model." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

function PlaygroundBlock() {
  const [page, setPage] = useState(3);
  const [pageCount, setPageCount] = useState(24);
  const [pageSize, setPageSize] = useState(25);
  const [totalItems, setTotalItems] = useState(587);
  const [size, setSize] = useState<PaginationSize>("md");
  const [showInfo, setShowInfo] = useState(true);
  const [showPageSize, setShowPageSize] = useState(true);
  const [disabled, setDisabled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [siblingCount, setSiblingCount] = useState(1);
  const [boundaryCount, setBoundaryCount] = useState(1);

  // Clamp page whenever the count changes.
  const safePage = Math.min(page, Math.max(1, pageCount));

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered Pagination in real time. Live JSX is generated in the dark panel at the bottom.">
      <div style={{
        border: `1px solid ${t.color.border.default}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        overflow: "hidden",
      }}>
        <div style={{
          padding: t.space.section.sm,
          background: t.color.background.subtle,
          borderBottom: `1px solid ${t.color.border.subtle}`,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: 120,
        }}>
          <Pagination
            page={safePage}
            pageCount={pageCount}
            onPageChange={setPage}
            pageSize={showPageSize ? pageSize : undefined}
            pageSizeOptions={showPageSize ? [10, 25, 50, 100] : undefined}
            onPageSizeChange={showPageSize ? setPageSize : undefined}
            totalItems={showInfo ? totalItems : undefined}
            size={size}
            siblingCount={siblingCount}
            boundaryCount={boundaryCount}
            disabled={disabled}
            loading={loading}
          >
            {showInfo && <Pagination.Info />}
            <Pagination.PageList>
              <li className="hc-pagination__item"><Pagination.Previous /></li>
              <PageWindowChildren page={safePage} pageCount={pageCount} siblingCount={siblingCount} boundaryCount={boundaryCount} />
              <li className="hc-pagination__item"><Pagination.Next /></li>
            </Pagination.PageList>
            {showPageSize && <Pagination.PageSize />}
          </Pagination>
        </div>

        <div style={{
          padding: t.space.inline.xl,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
          gap: t.space.inline.lg,
        }}>
          <NumberControl label="page"         value={safePage}      min={1} max={Math.max(1, pageCount)} onChange={setPage} />
          <NumberControl label="pageCount"    value={pageCount}     min={1} max={200}                    onChange={setPageCount} />
          <NumberControl label="pageSize"     value={pageSize}      min={1} max={500}                    onChange={setPageSize} />
          <NumberControl label="totalItems"   value={totalItems}    min={0} max={100000}                 onChange={setTotalItems} />
          <NumberControl label="siblingCount" value={siblingCount}  min={0} max={4}                      onChange={setSiblingCount} />
          <NumberControl label="boundaryCount" value={boundaryCount} min={0} max={4}                     onChange={setBoundaryCount} />
          <SelectControl label="size"         value={size} options={SIZES}                                onChange={(v) => setSize(v as PaginationSize)} />
          <ToggleControl label="show summary"  value={showInfo}      onChange={setShowInfo} />
          <ToggleControl label="show page size" value={showPageSize} onChange={setShowPageSize} />
          <ToggleControl label="disabled"      value={disabled}      onChange={setDisabled} />
          <ToggleControl label="loading"       value={loading}       onChange={setLoading} />
        </div>

        <div style={{
          padding: t.space.inline.xl,
          borderTop: `1px solid ${t.color.border.subtle}`,
          background: t.color.background.inverse,
        }}>
          <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: "rgba(255,255,255,0.6)", marginBottom: t.space.stack.sm }}>
            Rendered code
          </div>
          <pre style={{ margin: 0, fontFamily: t.font.mono, fontSize: 12, lineHeight: 1.6, color: t.color.text.inverse, whiteSpace: "pre", overflowX: "auto" }}>
{renderCode({ page: safePage, pageCount, pageSize, totalItems, size, siblingCount, boundaryCount, showInfo, showPageSize, disabled, loading })}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  page: number; pageCount: number; pageSize: number; totalItems: number;
  size: PaginationSize; siblingCount: number; boundaryCount: number;
  showInfo: boolean; showPageSize: boolean; disabled: boolean; loading: boolean;
}) {
  const attrs: string[] = [];
  attrs.push(`page={${s.page}}`);
  attrs.push(`pageCount={${s.pageCount}}`);
  if (s.showInfo || s.showPageSize) attrs.push(`pageSize={${s.pageSize}}`);
  if (s.showPageSize)               attrs.push(`pageSizeOptions={[10, 25, 50, 100]}`);
  if (s.showPageSize)               attrs.push(`onPageSizeChange={setSize}`);
  if (s.showInfo)                   attrs.push(`totalItems={${s.totalItems}}`);
  if (s.size !== "md")              attrs.push(`size="${s.size}"`);
  if (s.siblingCount !== 1)         attrs.push(`siblingCount={${s.siblingCount}}`);
  if (s.boundaryCount !== 1)        attrs.push(`boundaryCount={${s.boundaryCount}}`);
  if (s.disabled)                   attrs.push(`disabled`);
  if (s.loading)                    attrs.push(`loading`);
  attrs.push(`onPageChange={setPage}`);

  const lines: string[] = [];
  lines.push(`<Pagination`);
  for (const a of attrs) lines.push(`  ${a}`);
  lines.push(`>`);
  if (s.showInfo)      lines.push(`  <Pagination.Info />`);
  lines.push(`  <Pagination.PageList />`);
  if (s.showPageSize)  lines.push(`  <Pagination.PageSize />`);
  lines.push(`</Pagination>`);
  return lines.join("\n");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Illustrative — not shipped as reusable components. Every example composes the same primitive at different scales."
    >
      <div style={{ display: "grid", gap: t.space.section.sm }}>
        <ExampleBlock title="Patient List" description="Long paginated list inside a Table footer. Comfortable md size + full Info + page size selector.">
          <PatientListExample />
        </ExampleBlock>

        <ExampleBlock title="Orders" description="Mid-size result set. Info summary only, no page-size selector.">
          <OrdersExample />
        </ExampleBlock>

        <ExampleBlock title="Audit Log" description="High-volume log. Small size for density; page-size choices tuned for scanning.">
          <AuditLogExample />
        </ExampleBlock>

        <ExampleBlock title="Users" description="Directory list. Standard md pagination inside a Card.">
          <UsersExample />
        </ExampleBlock>

        <ExampleBlock title="Reports" description="Short list — 3 pages. Simple Prev + numbers + Next.">
          <ReportsExample />
        </ExampleBlock>

        <ExampleBlock title="Search Results" description="Search-result footer with visible query context. Icon-labeled summary.">
          <SearchResultsExample />
        </ExampleBlock>
      </div>
    </DocBlock>
  );
}

function ExampleBlock({ title, description, children }: { title: string; description: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: t.space.stack.sm }}>
        <div style={{ fontWeight: 600, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
        <div style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>{description}</div>
      </div>
      <div style={{ border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default, padding: t.space.inline.lg }}>
        {children}
      </div>
    </div>
  );
}

function PatientListExample() {
  const [page, setPage] = useState(4);
  const [size, setSize] = useState(25);
  const totalItems = 1287;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.md }}>
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>[ … Table body renders 25 patient rows here … ]</div>
      <Table.Pagination>
        <Pagination
          page={page}
          pageCount={Math.ceil(totalItems / size)}
          onPageChange={setPage}
          pageSize={size}
          pageSizeOptions={[10, 25, 50, 100]}
          onPageSizeChange={setSize}
          totalItems={totalItems}
          aria-label="Patient list pagination"
        >
          <Pagination.Info />
          <Pagination.PageList>
            <li className="hc-pagination__item"><Pagination.Previous /></li>
            <PageWindowChildren page={page} pageCount={Math.ceil(totalItems / size)} />
            <li className="hc-pagination__item"><Pagination.Next /></li>
          </Pagination.PageList>
          <Pagination.PageSize />
        </Pagination>
      </Table.Pagination>
    </div>
  );
}

function OrdersExample() {
  const [page, setPage] = useState(2);
  return (
    <Pagination page={page} pageCount={8} onPageChange={setPage} pageSize={20} totalItems={148} aria-label="Orders pagination">
      <Pagination.Info />
      <Pagination.PageList>
        <li className="hc-pagination__item"><Pagination.Previous /></li>
        <PageWindowChildren page={page} pageCount={8} />
        <li className="hc-pagination__item"><Pagination.Next /></li>
      </Pagination.PageList>
    </Pagination>
  );
}

function AuditLogExample() {
  const [page, setPage] = useState(14);
  const [size, setSize] = useState(50);
  const totalItems = 32871;
  return (
    <Pagination
      page={page}
      pageCount={Math.ceil(totalItems / size)}
      onPageChange={setPage}
      pageSize={size}
      pageSizeOptions={[25, 50, 100, 200]}
      onPageSizeChange={setSize}
      totalItems={totalItems}
      size="sm"
      aria-label="Audit log pagination"
    >
      <Pagination.Info />
      <Pagination.PageList>
        <li className="hc-pagination__item"><Pagination.Previous /></li>
        <PageWindowChildren page={page} pageCount={Math.ceil(totalItems / size)} />
        <li className="hc-pagination__item"><Pagination.Next /></li>
      </Pagination.PageList>
      <Pagination.PageSize />
    </Pagination>
  );
}

function UsersExample() {
  const [page, setPage] = useState(1);
  return (
    <Pagination page={page} pageCount={5} onPageChange={setPage} pageSize={20} totalItems={87} aria-label="Users pagination">
      <Pagination.Info />
      <Pagination.PageList />
    </Pagination>
  );
}

function ReportsExample() {
  const [page, setPage] = useState(1);
  return (
    <Pagination page={page} pageCount={3} onPageChange={setPage} aria-label="Reports pagination">
      <Pagination.PageList>
        <li className="hc-pagination__item"><Pagination.Previous /></li>
        <PageWindowChildren page={page} pageCount={3} />
        <li className="hc-pagination__item"><Pagination.Next /></li>
      </Pagination.PageList>
    </Pagination>
  );
}

function SearchResultsExample() {
  const [page, setPage] = useState(3);
  const totalItems = 429;
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ display: "flex", alignItems: "center", gap: t.space.inline.xs, color: t.color.text.tertiary, ...t.type.bodyS }}>
        <Search size={14} />
        <span>Query: <strong style={{ color: t.color.text.primary }}>&ldquo;anticoagulant&rdquo;</strong></span>
      </div>
      <Pagination
        page={page}
        pageCount={Math.ceil(totalItems / 20)}
        onPageChange={setPage}
        pageSize={20}
        totalItems={totalItems}
        aria-label="Search results pagination"
      >
        <Pagination.Info />
        <Pagination.PageList>
          <li className="hc-pagination__item"><Pagination.Previous /></li>
          <PageWindowChildren page={page} pageCount={Math.ceil(totalItems / 20)} />
          <li className="hc-pagination__item"><Pagination.Next /></li>
        </Pagination.PageList>
      </Pagination>
    </div>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS_ROOT: PropRow[] = [
  { name: "page",             type: "number",                      def: "—",       desc: "Current page (1-based). Clamped to [1, pageCount] internally." },
  { name: "pageCount",        type: "number",                      def: "—",       desc: "Total number of pages. Must be ≥ 1." },
  { name: "onPageChange",     type: "(page: number) => void",      def: "—",       desc: "Fires when the user selects a different page." },
  { name: "pageSize",         type: "number",                      def: "—",       desc: "Current page size (rows per page). Enables item-range summaries in Pagination.Info." },
  { name: "pageSizeOptions",  type: "number[]",                    def: "—",       desc: "Available page-size choices. When provided with onPageSizeChange, Pagination.PageSize renders a Select." },
  { name: "onPageSizeChange", type: "(size: number) => void",      def: "—",       desc: "Fires when the user selects a different page size." },
  { name: "totalItems",       type: "number",                      def: "—",       desc: "Total item count across all pages. Enables 'Showing X-Y of Z' summary." },
  { name: "size",             type: "'sm' | 'md' | 'lg'",          def: "'md'",    desc: "Size ladder — matches Button sm/md/lg (28/36/44 heights)." },
  { name: "siblingCount",     type: "number",                      def: "1",       desc: "Number of page buttons on each side of the current page." },
  { name: "boundaryCount",    type: "number",                      def: "1",       desc: "Number of page buttons at the start and end (the 'book ends')." },
  { name: "disabled",         type: "boolean",                     def: "false",   desc: "Disable every control. Clicks are ignored. Root emits aria-disabled." },
  { name: "loading",          type: "boolean",                     def: "false",   desc: "Disable controls + emit aria-busy. Use while the underlying data is refetching." },
  { name: "aria-label",       type: "string",                      def: "'Pagination'", desc: "Accessible name for the nav landmark. Override when multiple paginations sit on the same page." },
  { name: "children",         type: "ReactNode",                   def: "—",       desc: "Compose with Pagination.Info, Pagination.PageList, Pagination.Previous, Pagination.Next, Pagination.PageSize." },
];

const PROPS_PAGE_LIST: PropRow[] = [
  { name: "children", type: "ReactNode", def: "auto", desc: "Author your own <li> children to replace the auto-generated window; omit to get the default window from `page` / `pageCount`." },
];

const PROPS_PAGE: PropRow[] = [
  { name: "page",     type: "number",  def: "—", desc: "The 1-based page number this button navigates to." },
  { name: "disabled", type: "boolean", def: "—", desc: "Explicit disabled — falls back to the parent disabled/loading." },
];

const PROPS_NAV: PropRow[] = [
  { name: "label",       type: "string",  def: "'Previous' / 'Next'", desc: "Accessible name AND visible label. Pass an empty string for icon-only." },
  { name: "labelHidden", type: "boolean", def: "false",              desc: "Hide the label visually but keep it in the DOM for screen readers." },
  { name: "disabled",    type: "boolean", def: "—",                  desc: "Explicit disabled — combined with parent disabled/loading + auto-disable at ends." },
];

const PROPS_PAGE_SIZE: PropRow[] = [
  { name: "label",       type: "string",  def: "'Per page'", desc: "Visible label prefix. Combined with the <select> to form '{label} 25 ▼'." },
  { name: "labelHidden", type: "boolean", def: "false",      desc: "Hide the label visually but keep it in the DOM for screen readers." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Pagination"           rows={PROPS_ROOT} />
      <PropsSubsection title="Pagination.PageList"  rows={PROPS_PAGE_LIST} />
      <PropsSubsection title="Pagination.Page"      rows={PROPS_PAGE} />
      <PropsSubsection title="Pagination.Previous / Pagination.Next" rows={PROPS_NAV} />
      <PropsSubsection title="Pagination.PageSize"  rows={PROPS_PAGE_SIZE} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Pagination.Info has no props beyond a `render` callback for custom formatting, and standard HTML attributes.
      </div>
    </DocBlock>
  );
}

function PropsSubsection({ title, rows }: { title: string; rows: PropRow[] }) {
  return (
    <div style={{ marginTop: t.space.stack.md }}>
      <div style={{ ...t.type.bodyS, fontWeight: 700, color: t.color.text.primary, marginBottom: t.space.stack.sm, fontFamily: t.font.mono }}>
        {title}
      </div>
      <div style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        overflow: "hidden",
      }}>
        <div style={{ display: "grid", gridTemplateColumns: "180px 1.6fr 100px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
          <HeaderCell>Prop</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Default</HeaderCell>
          <HeaderCell>Description</HeaderCell>
        </div>
        {rows.map((row, i) => (
          <div key={row.name} style={{
            display: "grid",
            gridTemplateColumns: "180px 1.6fr 100px 2fr",
            padding: `${t.space.inline.md} ${t.space.inline.lg}`,
            borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
            alignItems: "start",
            gap: t.space.inline.md,
          }}>
            <code style={{ fontFamily: t.font.mono, fontSize: 13, color: t.color.action.primary, fontWeight: 600 }}>{row.name}</code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.secondary, wordBreak: "break-word" }}>{row.type}</code>
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{row.def}</code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.desc}</span>
          </div>
        ))}
      </div>
    </div>
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
    { role: "Button size ladder",   alias: "components.pagination.size.{sm|md|lg}.button (28 / 36 / 44 — matches Button)" },
    { role: "Button radius",        alias: "aliases.radius.control (8 — matches Button + Input + Select)" },
    { role: "Button surface",       alias: "aliases.color.background.default + border.default + text.primary" },
    { role: "Button hover",         alias: "aliases.color.background.subtle + border.strong" },
    { role: "Current page",         alias: "aliases.color.action.primary (brand) + text.inverse (ink) — same tint as Button primary" },
    { role: "Disabled state",       alias: "aliases.color.text.disabled + border.subtle (native disabled attr also set)" },
    { role: "Info text",            alias: "aliases.color.text.secondary + text.primary (strong)" },
    { role: "Ellipsis tone",        alias: "aliases.color.text.tertiary" },
    { role: "Page-size select",     alias: "aliases.color.background.default + border.default + radius.control (matches Select trigger)" },
    { role: "Focus ring",           alias: "aliases.color.border.focus (2px brand — identical to every other primitive)" },
    { role: "Outer gap",            alias: "aliases.spacing.inline.lg (16 — Info / List / PageSize)" },
    { role: "Item gap",             alias: "aliases.spacing.inline.xs (4 — between page buttons)" },
    { role: "Nav padding",          alias: "aliases.spacing.inline.{sm|md|lg} — Prev/Next horizontal padding per size" },
    { role: "Font size",            alias: "aliases.typography.bodyS (14, md) / body (16, lg) / font-size 12 (sm)" },
    { role: "Numeric alignment",    alias: "font-variant-numeric: tabular-nums (page numbers + Info range + PageSize select)" },
    { role: "Transition",           alias: "aliases.motion.hoverIn (150ms cubic-bezier(0.2,0,0,1))" },
  ];

  return (
    <DocBlock title="Tokens used">
      <div style={{
        border: `1px solid ${t.color.border.subtle}`,
        borderRadius: t.radius.control,
        background: t.color.background.default,
        overflow: "hidden",
      }}>
        {tokens.map((row, i) => (
          <div key={row.role} style={{
            display: "grid",
            gridTemplateColumns: "220px 1fr",
            padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
            borderBottom: i === tokens.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
            alignItems: "center",
            gap: t.space.inline.md,
          }}>
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
          { tone: "note", text: "Pagination is controlled — the consumer owns `page` in useState and reacts to `onPageChange`. The primitive is stateless (aside from an internal `useId` for label / select id wiring); this keeps it thin, testable, and safe to compose in Server Components once shipped as npm." },
          { tone: "note", text: "The page-window algorithm is the same book-end + siblings pattern used by MUI / Untitled UI / Ant Design. Bookends (`boundaryCount`) always show the first and last N pages; siblings (`siblingCount`) show N pages on each side of the current; gaps of ≥2 pages become ellipses; gaps of exactly 1 render the missing page (no ellipsis just to replace one number)." },
          { tone: "note", text: "Pagination.PageList auto-generates the window when it has no children; the same primitive supports authored children for custom compositions (e.g. adding Prev/Next as bookends inside the <ul>). Every example in this doc uses the authored form so Prev/Next sit inside the page list for aligned rhythm." },
          { tone: "note", text: "Pagination.Info renders inside an aria-live='polite' region so screen readers announce range changes without stealing focus. Consumers who want silent updates can wrap Info in a container with aria-live='off'." },
          { tone: "note", text: "Every page button uses `font-variant-numeric: tabular-nums` so column alignment stays clean when the current page toggles between 9 → 10 → 11. Same rule for Info + PageSize select." },
          { tone: "note", text: "Sizes map 1:1 to the Button ladder (28 / 36 / 44). An inline `<Button size='md'>` next to a `<Pagination size='md'>` sits flush without any custom margin — the whole footer row lines up on the same baseline." },
        ]}
      />

      <Callout tone="info" title="Extending Pagination">
        (1) A future <code style={codeInline}>DataGrid</code> primitive
        should compose Table + Pagination for its footer — not
        reimplement page-number rendering. (2) A jump-to-page input can
        be added by authoring custom children inside{" "}
        <code style={codeInline}>&lt;Pagination.PageList&gt;</code> —
        the algorithm and layout come for free. (3) Infinite scroll and
        virtualization are separate navigation primitives; do not add
        them to this component.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "HC1 design tokens",       detail: "Every color, radius, spacing, and motion value is a token alias — no hex, no raw pixels, no bespoke shadows." },
    { name: "HC1 Button ladder",       detail: "Size heights are 28 / 36 / 44 — the exact Button sm / md / lg. An inline Button next to a page button sits flush without adjustment." },
    { name: "HC1 Table",               detail: "Designed to drop into <Table.Pagination> — same radius, same padding rhythm, same tabular-nums treatment." },
    { name: "HC1 Card",                detail: "Sits cleanly inside a Card footer with no extra frame — the flex layout adapts to its container." },
    { name: "Native <nav> + <button>", detail: "Real HTML landmarks and controls — aria-current='page', aria-label, native disabled, native keyboard tab order." },
  ];
  return (
    <DocBlock title="Built on">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: t.space.inline.md }}>
        {rows.map((row) => (
          <div key={row.name} style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
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
    { name: "Patient List",       detail: "Long paginated patient rosters. Composes Pagination inside Table.Pagination with Info + PageSize." },
    { name: "User List",          detail: "Admin directory of users. Standard md pagination inside a Card body." },
    { name: "Reports",            detail: "Report library with 1–20 pages typical. Simple Prev + numbers + Next." },
    { name: "Search Results",     detail: "Global search + module search result footers. Info summary + numbered window." },
    { name: "Orders",             detail: "Orders list with medium-scale volumes. Info-only summary; no page size selector." },
    { name: "Activity Log",       detail: "High-volume audit / activity logs. Small size + page-size options tuned for scanning." },
    { name: "Table",              detail: "Every Table with more than one page composes Pagination inside Table.Pagination." },
    { name: "Future DataGrid",    detail: "A future DataGrid primitive should compose Pagination for its footer — not reimplement page-number rendering." },
  ];
  return (
    <DocBlock title="Used by (future)" lead="Every paged surface in HC1 should compose this Pagination. These are the anticipated consumers — none are shipped yet.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: t.space.inline.md }}>
        {consumers.map((c) => (
          <div key={c.name} style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
            <div style={{ fontWeight: 600, color: t.color.text.primary, marginBottom: 4, display: "flex", alignItems: "center", gap: t.space.inline.xs }}>
              <Layers size={14} color={t.color.action.primary} />
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
    { name: "ClinicalIQ patient list pagination",   detail: "Bloodhealth + HerCare patient rosters currently render bespoke pagination widgets. Migrate to Pagination — same intent, unified sizing + focus ring + tokens." },
    { name: "SourceIQ pipeline pagination",         detail: "SourceIQ pipeline lists use a divergent chip-style pagination. Migrate to Pagination — same shape, unified surface, one code path." },
    { name: "Ad-hoc Prev/Next only bars",           detail: "Prototype pages with only Prev/Next buttons and no page numbers should switch to Pagination with a minimal PageList — same visual language, no bespoke button styling." },
    { name: "Bespoke 'X of Y' summaries",            detail: "Various ad-hoc counters like 'Page 3 of 12' should switch to Pagination.Info — same message, tabular-nums, aria-live." },
    { name: "Page-size dropdowns",                   detail: "Ad-hoc 'Show 25 rows' dropdowns near tables should switch to Pagination.PageSize — real label + select pair, id linkage, disabled handling." },
    { name: "Loading-state pagination",              detail: "Existing implementations that hide pagination during refetch cause layout jump. Migrate to Pagination with `loading` — same width, dim + aria-busy, no jump." },
  ];
  return (
    <DocBlock title="Migration targets" lead="The HC1 Pagination is the intended replacement for every pagination implementation across the HC1 ecosystem. Do not redesign — standardize.">
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: t.space.inline.md }}>
        {targets.map((c) => (
          <div key={c.name} style={{ padding: t.space.inline.lg, border: `1px solid ${t.color.border.subtle}`, borderRadius: t.radius.control, background: t.color.background.default }}>
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
    { label: "Responsive",              ok: true },
    { label: "Composable API",          ok: true },
    { label: "Production ready",        ok: true },
  ];
  return (
    <DocBlock title="Component status">
      <div style={{
        border: `1px solid ${t.color.status.success.border}`,
        borderRadius: t.radius.control,
        background: t.color.status.success.bg,
        padding: t.space.inline.lg,
      }}>
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

function NumberControl({ label, value, onChange, min, max }: { label: string; value: number; onChange: (v: number) => void; min?: number; max?: number }) {
  return (
    <label style={{ display: "flex", flexDirection: "column", gap: t.space.stack.xs }}>
      <ControlLabel>{label}</ControlLabel>
      <input
        type="number"
        value={Number.isFinite(value) ? value : 0}
        min={min}
        max={max}
        onChange={(e) => onChange(Number(e.target.value))}
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
    <label style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      gap: t.space.inline.md, padding: `${t.space.stack.sm} ${t.space.inline.md}`,
      borderRadius: t.radius.control, border: `1px solid ${t.color.border.default}`,
      background: t.color.background.default,
      cursor: disabled ? "not-allowed" : "pointer",
      opacity: disabled ? 0.5 : 1,
    }}>
      <ControlLabel>{label}</ControlLabel>
      <input type="checkbox" checked={value} onChange={(e) => onChange(e.target.checked)} disabled={disabled} />
    </label>
  );
}

function ControlLabel({ children }: { children: ReactNode }) {
  return <span style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.text.tertiary }}>{children}</span>;
}
