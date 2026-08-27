import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import {
  Activity,
  AlertCircle,
  ArrowRight,
  Check,
  ClipboardList,
  Database,
  FileText,
  MoreHorizontal,
  Search,
  Shield,
  Users,
  X,
} from "lucide-react";
import { Table } from "../../components/table";
import type { SortDirection, TableDensity } from "../../components/table";
import { Button } from "../../components/button";
import {
  DocPage,
  DocBlock,
  RuleList,
  DoDontGrid,
  Callout,
  t,
} from "../standards/_shared";

/* ══════ Entry ═════════════════════════════════════════════════════ */

export function TableDoc() {
  return (
    <DocPage>
      <PurposeBlock />
      <AnatomyBlock />
      <CompositionBlock />
      <FeaturesBlock />
      <StatesBlock />
      <RowFeaturesBlock />
      <A11yBlock />
      <KeyboardBlock />
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
    </DocPage>
  );
}

/* ══════ Purpose ═══════════════════════════════════════════════════ */

function PurposeBlock() {
  return (
    <DocBlock
      eyebrow="Purpose"
      title="The canonical HC1 Table"
      lead="Table is the canonical data-presentation primitive of the HC1 design system. Patient lists, user lists, audit logs, activity feeds, search results, orders, inventory, transactions, and settings lists all compose this Table rather than reimplementing row and cell rhythm. It owns the surface frame, the header, the body, the density ladder, the sticky-header behavior, and the empty and loading states — so every downstream table reads as part of the same family."
    />
  );
}

/* ══════ Anatomy ═══════════════════════════════════════════════════ */

function AnatomyBlock() {
  const rows = useMemo(() => SAMPLE_USERS.slice(0, 3), []);
  return (
    <DocBlock
      title="Anatomy"
      lead="Every named part in this diagram maps 1:1 to a subcomponent. The outer wrapper is a <div> that owns the surface frame; the inner <table> is a real HTML table so assistive tech sees proper semantics."
    >
      <Table density="comfortable" ariaLabel="Anatomy example">
        <Table.Toolbar>
          <Table.Search>
            <FakeSearchInput placeholder="Search users…" />
          </Table.Search>
          <Table.Filters>
            <FakeFilterChip label="Active" />
            <FakeFilterChip label="Admin" />
          </Table.Filters>
        </Table.Toolbar>
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head numeric>Logins</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {rows.map((u) => (
              <Table.Row key={u.id}>
                <Table.Cell>{u.name}</Table.Cell>
                <Table.Cell>{u.role}</Table.Cell>
                <Table.Cell>
                  <FakeStatusChip tone={u.active ? "success" : "muted"}>
                    {u.active ? "Active" : "Inactive"}
                  </FakeStatusChip>
                </Table.Cell>
                <Table.Cell numeric>{u.logins}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
        <Table.Footer>
          <span>Showing 1–3 of 12</span>
          <Table.Pagination>
            <FakePagerButton>Prev</FakePagerButton>
            <FakePagerButton>Next</FakePagerButton>
          </Table.Pagination>
        </Table.Footer>
      </Table>

      <div
        style={{
          marginTop: t.space.section.sm,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <Part name="Table"            desc="Root wrapper. Owns density, striping, and the outer surface frame." />
        <Part name="Table.Toolbar"    desc="Top strip. Hosts search + filters + toolbar actions." />
        <Part name="Table.Search"     desc="A slot for the primary search control." />
        <Part name="Table.Filters"    desc="A slot for filter chips, filter Selects, or a filter menu button." />
        <Part name="Table.Content"    desc="Wraps the actual <table>. Owns sticky-header + maxHeight scroll." />
        <Part name="Table.Header"     desc="The <thead>. Composes rows of Table.Head cells." />
        <Part name="Table.Head"       desc="A <th> — supports sortable columns with aria-sort." />
        <Part name="Table.Body"       desc="The <tbody>. Composes rows of Table.Cell cells." />
        <Part name="Table.Row"        desc="A <tr>. Supports clickable / selected / disabled states." />
        <Part name="Table.Cell"       desc="A <td>. Supports numeric alignment, leading icons, truncation." />
        <Part name="Table.Empty"      desc="A body-level state block when the dataset is empty." />
        <Part name="Table.Loading"    desc="A body-level state block while data loads." />
        <Part name="Table.Footer"     desc="Bottom strip. Hosts summary text + pagination." />
        <Part name="Table.Pagination" desc="A slot for the pagination control." />
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
      lead="Table is a compound component. Prefer composing named subcomponents over configuring booleans. Only Table and Table.Content are structurally required."
    >
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: t.space.inline.lg }}>
        <CodeBlock
          title="Preferred"
          tone="do"
          code={`<Table>
  <Table.Toolbar>
    <Table.Search><Input /></Table.Search>
    <Table.Filters>…</Table.Filters>
  </Table.Toolbar>
  <Table.Content>
    <Table.Header>
      <Table.Row>
        <Table.Head>Name</Table.Head>
        <Table.Head numeric>Value</Table.Head>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      {rows.map((r) => (
        <Table.Row key={r.id}>
          <Table.Cell>{r.name}</Table.Cell>
          <Table.Cell numeric>{r.value}</Table.Cell>
        </Table.Row>
      ))}
    </Table.Body>
  </Table.Content>
  <Table.Footer>
    <Table.Pagination>…</Table.Pagination>
  </Table.Footer>
</Table>`}
        />
        <CodeBlock
          title="Avoid"
          tone="dont"
          code={`<Table
  columns={[
    { key: "name", label: "Name" },
    { key: "value", label: "Value", align: "right" },
  ]}
  rows={rows}
  showToolbar
  showFooter
  showPagination
  toolbarSearch={<Input />}
  toolbarFilters={<Filters />}
  emptyText="No results"
/>`}
        />
      </div>

      <RuleList
        rules={[
          { tone: "must",     text: "Only Table and Table.Content are required. Toolbar, Footer, Header, Body, Empty, and Loading are opt-in." },
          { tone: "should",   text: "Order matters visually — Toolbar → Content → Footer is the canonical rhythm." },
          { tone: "should",   text: "Nest Table.Pagination inside Table.Footer. Pagination belongs at the bottom-right of the surface." },
          { tone: "must-not", text: "Never introduce boolean props like `showToolbar` or `withFooter`. If a piece is needed, compose it." },
          { tone: "must-not", text: "Never define columns as a `columns` prop — that inverts the composition model. Columns are Table.Head elements the consumer authors directly." },
        ]}
      />
    </DocBlock>
  );
}

function CodeBlock({ title, tone, code }: { title: string; tone: "do" | "dont"; code: string }) {
  const fg = tone === "do" ? t.color.status.success.fg : t.color.status.error.fg;
  const bg = tone === "do" ? t.color.status.success.bg : t.color.status.error.bg;
  const border = tone === "do" ? t.color.status.success.border : t.color.status.error.border;
  return (
    <div style={{ border: `1px solid ${border}`, borderRadius: t.radius.control, background: bg, overflow: "hidden" }}>
      <div style={{ padding: `${t.space.stack.sm} ${t.space.inline.md}`, borderBottom: `1px solid ${border}`, color: fg, fontWeight: 700, fontSize: 12, textTransform: "uppercase", letterSpacing: "0.14em" }}>
        {tone === "do" ? "✓ Do" : "✗ Don't"} — {title}
      </div>
      <pre style={{ margin: 0, padding: t.space.inline.md, fontFamily: t.font.mono, fontSize: 12, lineHeight: 1.6, color: t.color.text.primary, whiteSpace: "pre", overflowX: "auto" }}>
        {code}
      </pre>
    </div>
  );
}

/* ══════ Features ══════════════════════════════════════════════════ */

function FeaturesBlock() {
  const rows: { name: string; desc: string }[] = [
    { name: "Header · Body · Footer", desc: "Structural building blocks that every table composes." },
    { name: "Toolbar",                desc: "Top strip for search, filters, and toolbar actions." },
    { name: "Search slot",            desc: "Compose any input inside Table.Search — the layout is provided." },
    { name: "Filter slot",            desc: "Compose chips, Selects, or a filter menu inside Table.Filters." },
    { name: "Pagination slot",        desc: "A footer slot for the pagination control." },
    { name: "Loading state",          desc: "Table.Loading dims the body and announces via aria-busy." },
    { name: "Empty state",            desc: "Table.Empty replaces the body with an illustration + message." },
    { name: "Sticky header",          desc: "Table.Content stickyHeader keeps the header pinned while the body scrolls." },
    { name: "Row selection",          desc: "Table.Row selected renders the selected-row treatment + aria-selected." },
    { name: "Clickable rows",         desc: "Table.Row onClick makes a row focusable + activatable via Enter/Space." },
    { name: "Striped rows",           desc: "Table striped enables optional zebra striping." },
    { name: "Density",                desc: "compact / comfortable / relaxed — row height maps to Button size ladder." },
    { name: "Sortable columns",       desc: "Table.Head sort + onSortChange enables sort controls with aria-sort." },
    { name: "Numeric alignment",      desc: "numeric prop on Head + Cell right-aligns and applies tabular-nums." },
    { name: "Leading icons",          desc: "leadingIcon prop on Table.Cell renders an icon before the cell content." },
    { name: "Trailing actions",       desc: "Compose a Button or icon-button inside the last Table.Cell of each row." },
  ];
  return (
    <DocBlock title="Features">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
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
              <Check size={14} color={t.color.action.primary} />
              {row.name}
            </div>
            <div style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.desc}</div>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ States ════════════════════════════════════════════════════ */

function StatesBlock() {
  return (
    <DocBlock title="Table states" lead="Every table-level state maps to a control. Row-level states are covered in the next section.">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
          gap: t.space.inline.md,
        }}
      >
        <StateTile name="Default" note="Header + body populated." >
          <MiniTable />
        </StateTile>
        <StateTile name="Loading" note="Body dimmed under a spinner. aria-busy set." >
          <MiniTableLoading />
        </StateTile>
        <StateTile name="Empty" note="Body replaced with icon + message." >
          <MiniTableEmpty />
        </StateTile>
      </div>
    </DocBlock>
  );
}

function StateTile({ name, note, children }: { name: string; note: string; children: ReactNode }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: t.space.stack.sm }}>
      <div style={{ ...t.type.caption, textTransform: "uppercase", letterSpacing: "0.14em", fontWeight: 700, color: t.color.text.tertiary }}>
        {name}
      </div>
      <div style={{ padding: t.space.inline.md, background: t.color.background.subtle, borderRadius: t.radius.control, minHeight: 180 }}>
        {children}
      </div>
      <div style={{ ...t.type.caption, color: t.color.text.tertiary }}>{note}</div>
    </div>
  );
}

function MiniTable() {
  return (
    <Table density="compact" ariaLabel="Default state">
      <Table.Content>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head numeric>Value</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row><Table.Cell>Alpha</Table.Cell><Table.Cell numeric>128</Table.Cell></Table.Row>
          <Table.Row><Table.Cell>Beta</Table.Cell><Table.Cell numeric>64</Table.Cell></Table.Row>
          <Table.Row><Table.Cell>Gamma</Table.Cell><Table.Cell numeric>32</Table.Cell></Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

function MiniTableLoading() {
  return (
    <Table density="compact" ariaLabel="Loading state">
      <Table.Content loading>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head numeric>Value</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={2} style={{ padding: 0 }}>
              <Table.Loading label="Loading…" />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

function MiniTableEmpty() {
  return (
    <Table density="compact" ariaLabel="Empty state">
      <Table.Content>
        <Table.Header>
          <Table.Row>
            <Table.Head>Name</Table.Head>
            <Table.Head numeric>Value</Table.Head>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          <Table.Row>
            <Table.Cell colSpan={2} style={{ padding: 0 }}>
              <Table.Empty
                icon={<Database />}
                title="No results"
                description="Try adjusting the filters above."
              />
            </Table.Cell>
          </Table.Row>
        </Table.Body>
      </Table.Content>
    </Table>
  );
}

/* ══════ Row features ══════════════════════════════════════════════ */

function RowFeaturesBlock() {
  return (
    <DocBlock
      title="Row features"
      lead="Rows carry the interaction model. Selection, clickability, and disabled state are row-level flags — the cell-level flags (numeric, leadingIcon, truncate) shape content presentation."
    >
      <Table density="comfortable" ariaLabel="Row features">
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Head width={40} />
              <Table.Head>Row treatment</Table.Head>
              <Table.Head>Notes</Table.Head>
              <Table.Head numeric width={120}>Value</Table.Head>
              <Table.Head width={72} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell><FakeCheckbox /></Table.Cell>
              <Table.Cell leadingIcon={<Activity />}>Default row</Table.Cell>
              <Table.Cell>Static row — no interaction.</Table.Cell>
              <Table.Cell numeric>128</Table.Cell>
              <Table.Cell><FakeIconButton /></Table.Cell>
            </Table.Row>
            <Table.Row onClick={() => {}}>
              <Table.Cell><FakeCheckbox /></Table.Cell>
              <Table.Cell leadingIcon={<Activity />}>Clickable row</Table.Cell>
              <Table.Cell>onClick prop — cursor pointer, keyboard focus, Enter/Space activates.</Table.Cell>
              <Table.Cell numeric>256</Table.Cell>
              <Table.Cell><FakeIconButton /></Table.Cell>
            </Table.Row>
            <Table.Row selected>
              <Table.Cell><FakeCheckbox checked /></Table.Cell>
              <Table.Cell leadingIcon={<Activity />}>Selected row</Table.Cell>
              <Table.Cell>selected prop — subtle wash + brand accent bar + aria-selected.</Table.Cell>
              <Table.Cell numeric>384</Table.Cell>
              <Table.Cell><FakeIconButton /></Table.Cell>
            </Table.Row>
            <Table.Row disabled>
              <Table.Cell><FakeCheckbox disabled /></Table.Cell>
              <Table.Cell leadingIcon={<Activity />}>Disabled row</Table.Cell>
              <Table.Cell>disabled prop — dimmed, non-interactive, aria-disabled.</Table.Cell>
              <Table.Cell numeric>—</Table.Cell>
              <Table.Cell><FakeIconButton disabled /></Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>
    </DocBlock>
  );
}

/* ══════ Accessibility ═════════════════════════════════════════════ */

function A11yBlock() {
  return (
    <DocBlock title="Accessibility">
      <RuleList
        rules={[
          { tone: "must", text: "The inner element is a real <table> so assistive tech gets proper table semantics — never render rows/cells as plain divs." },
          { tone: "must", text: "Every Table.Head renders a <th scope='col'> so screen readers announce the column name for each cell." },
          { tone: "must", text: "Sortable columns emit aria-sort='ascending' | 'descending' | 'none' and render the sort control as a real <button> inside the <th>." },
          { tone: "must", text: "Selected rows emit aria-selected='true' — pair with a checkbox in the first cell so mouse and keyboard users have symmetric affordances." },
          { tone: "must", text: "Disabled rows emit aria-disabled='true' and skip pointer + keyboard activation." },
          { tone: "must", text: "Clickable rows receive tabIndex=0, respond to Enter and Space, and show the same 2px brand focus ring used across Button / Input / Select / Card / Dialog." },
          { tone: "must", text: "loading sets aria-busy on the <table>. Table.Loading uses role='status' + aria-live='polite' so assistive tech announces the progress." },
          { tone: "must", text: "Table.Empty uses role='status' so the empty-state message is announced when the body updates." },
          { tone: "must", text: "The root wraps the table in a <div role='group'> so a table + toolbar + footer can share a single aria-label describing the whole surface." },
          { tone: "must", text: "prefers-reduced-motion: reduce collapses row hover transitions to 0ms and slows the loading spinner to 2500ms." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Keyboard interaction ══════════════════════════════════════ */

function KeyboardBlock() {
  const rows: { keys: string; effect: string }[] = [
    { keys: "Tab",           effect: "Move focus to the next focusable element — a clickable row, a sort button, a toolbar control, or a trailing-action button." },
    { keys: "Shift+Tab",     effect: "Move focus to the previous focusable element." },
    { keys: "Enter / Space", effect: "Activate the currently focused element — a clickable row fires onClick; a sort button cycles asc → desc → unsorted." },
    { keys: "Arrow keys",    effect: "Native scroll behavior inside a scrollable Table.Content (stickyHeader + maxHeight). Row navigation is not intercepted." },
  ];
  return (
    <DocBlock title="Keyboard interaction">
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        {rows.map((row, i) => (
          <div
            key={row.keys}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1fr",
              padding: `${t.space.inline.sm} ${t.space.inline.lg}`,
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
              alignItems: "center",
              gap: t.space.inline.md,
            }}
          >
            <code style={{ fontFamily: t.font.mono, fontSize: 12, color: t.color.action.primary, fontWeight: 600 }}>{row.keys}</code>
            <span style={{ ...t.type.bodyS, color: t.color.text.secondary }}>{row.effect}</span>
          </div>
        ))}
      </div>
    </DocBlock>
  );
}

/* ══════ Best practices ════════════════════════════════════════════ */

function BestPracticesBlock() {
  return (
    <DocBlock title="Best practices">
      <DoDontGrid
        dos={[
          { title: "Use tabular-nums for numeric columns", description: "Right-align + numeric prop on both Table.Head and Table.Cell so digit columns line up." },
          { title: "Match density to information density", description: "Dense clinical data → compact. Detail-oriented lists → comfortable. Broad settings → relaxed." },
          { title: "Compose the same Toolbar every time",   description: "Search on the left, filters + toolbar actions on the right. Consistent placement across products." },
          { title: "Pair selection with a checkbox column",  description: "aria-selected is invisible without a checkbox — put one in the first cell so mouse and keyboard users have symmetric affordances." },
        ]}
        donts={[
          { title: "Enable striping and hover together",     description: "Zebra + hover doubles the visual noise. Pick one — striping for scanning long lists, hover for interactive rows." },
          { title: "Style row height per row",               description: "Row heights come from the density prop. Overriding one row breaks the rhythm of the whole table." },
          { title: "Nest buttons inside a clickable row",    description: "Trailing-action buttons in a clickable row create ambiguous hit targets. Choose row-click OR per-row buttons, not both." },
          { title: "Wrap the table in a Card",               description: "Table already owns its surface frame. Wrapping in a Card doubles the border. Turn off `bordered` if embedding inside another surface." },
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
          { tone: "must-not", text: "Don't render rows/cells as <div>s to get flex layouts — screen readers, sorting, and keyboard navigation break." },
          { tone: "must-not", text: "Don't pass a `columns` array. Columns are Table.Head elements the consumer authors — the whole point of a compound API." },
          { tone: "must-not", text: "Don't manage sort state inside Table.Head — it's a controlled surface. The consumer holds the state and passes both sort + onSortChange." },
          { tone: "must-not", text: "Don't put a Table inside another scrolling container without setting stickyHeader + maxHeight — you'll lose the sticky header when the parent scrolls." },
          { tone: "must-not", text: "Don't build a specialized table (PatientTable, OrderTable) that clones this component. Compose Table + typed props for that surface's row shape." },
        ]}
      />
    </DocBlock>
  );
}

/* ══════ Playground ════════════════════════════════════════════════ */

const DENSITIES: TableDensity[] = ["compact", "comfortable", "relaxed"];

function PlaygroundBlock() {
  const [density, setDensity]         = useState<TableDensity>("comfortable");
  const [striped, setStriped]         = useState(false);
  const [stickyHeader, setStickyHeader] = useState(false);
  const [loading, setLoading]         = useState(false);
  const [empty, setEmpty]             = useState(false);
  const [rowSelection, setRowSelection] = useState(true);
  const [clickableRows, setClickableRows] = useState(false);
  const [showToolbar, setShowToolbar] = useState(true);
  const [showSearch, setShowSearch]   = useState(true);
  const [showFilters, setShowFilters] = useState(true);
  const [showPagination, setShowPagination] = useState(true);
  const [showFooter, setShowFooter]   = useState(true);

  const [sortDir, setSortDir] = useState<SortDirection>("asc");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set(["u2"]));
  const toggleSelected = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const sorted = useMemo(() => {
    if (sortDir === null) return SAMPLE_USERS;
    const dir = sortDir === "asc" ? 1 : -1;
    return [...SAMPLE_USERS].sort((a, b) => a.name.localeCompare(b.name) * dir);
  }, [sortDir]);

  return (
    <DocBlock title="Playground" lead="Every control below rebinds the rendered table in real time. Live JSX is generated in the dark panel at the bottom.">
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
          }}
        >
          <Table density={density} striped={striped} ariaLabel="Playground table">
            {showToolbar && (
              <Table.Toolbar>
                {showSearch && (
                  <Table.Search>
                    <FakeSearchInput placeholder="Search users…" />
                  </Table.Search>
                )}
                {showFilters && (
                  <Table.Filters>
                    <FakeFilterChip label="Active" />
                    <FakeFilterChip label="Admin" />
                  </Table.Filters>
                )}
              </Table.Toolbar>
            )}
            <Table.Content stickyHeader={stickyHeader} maxHeight={stickyHeader ? 260 : undefined} loading={loading}>
              <Table.Header>
                <Table.Row>
                  {rowSelection && <Table.Head width={40} />}
                  <Table.Head sort={sortDir} onSortChange={setSortDir}>Name</Table.Head>
                  <Table.Head>Role</Table.Head>
                  <Table.Head>Status</Table.Head>
                  <Table.Head numeric>Logins</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {empty || loading ? (
                  <Table.Row>
                    <Table.Cell colSpan={rowSelection ? 5 : 4} style={{ padding: 0 }}>
                      {loading ? (
                        <Table.Loading label="Loading users…" />
                      ) : (
                        <Table.Empty
                          icon={<Users />}
                          title="No users found"
                          description="Try adjusting the filters above, or invite someone new."
                          action={<Button variant="secondary" size="sm">Invite user</Button>}
                        />
                      )}
                    </Table.Cell>
                  </Table.Row>
                ) : (
                  sorted.map((u) => (
                    <Table.Row
                      key={u.id}
                      selected={selectedIds.has(u.id)}
                      onClick={clickableRows ? () => toggleSelected(u.id) : undefined}
                    >
                      {rowSelection && (
                        <Table.Cell>
                          <FakeCheckbox
                            checked={selectedIds.has(u.id)}
                            onChange={() => toggleSelected(u.id)}
                          />
                        </Table.Cell>
                      )}
                      <Table.Cell>{u.name}</Table.Cell>
                      <Table.Cell>{u.role}</Table.Cell>
                      <Table.Cell>
                        <FakeStatusChip tone={u.active ? "success" : "muted"}>
                          {u.active ? "Active" : "Inactive"}
                        </FakeStatusChip>
                      </Table.Cell>
                      <Table.Cell numeric>{u.logins}</Table.Cell>
                    </Table.Row>
                  ))
                )}
              </Table.Body>
            </Table.Content>
            {showFooter && (
              <Table.Footer>
                <span>Showing 1–{sorted.length} of {SAMPLE_USERS.length}</span>
                {showPagination && (
                  <Table.Pagination>
                    <FakePagerButton>Prev</FakePagerButton>
                    <FakePagerButton>Next</FakePagerButton>
                  </Table.Pagination>
                )}
              </Table.Footer>
            )}
          </Table>
        </div>

        <div
          style={{
            padding: t.space.inline.xl,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
            gap: t.space.inline.lg,
          }}
        >
          <SelectControl label="density" value={density} options={DENSITIES} onChange={(v) => setDensity(v as TableDensity)} />
          <ToggleControl label="striped"          value={striped}        onChange={setStriped} />
          <ToggleControl label="sticky header"    value={stickyHeader}   onChange={setStickyHeader} />
          <ToggleControl label="loading"          value={loading}        onChange={setLoading} />
          <ToggleControl label="empty"            value={empty}          onChange={setEmpty} />
          <ToggleControl label="row selection"    value={rowSelection}   onChange={setRowSelection} />
          <ToggleControl label="clickable rows"   value={clickableRows}  onChange={setClickableRows} />
          <ToggleControl label="toolbar"          value={showToolbar}    onChange={setShowToolbar} />
          <ToggleControl label="search"           value={showSearch}     onChange={setShowSearch} disabled={!showToolbar} />
          <ToggleControl label="filters"          value={showFilters}    onChange={setShowFilters} disabled={!showToolbar} />
          <ToggleControl label="footer"           value={showFooter}     onChange={setShowFooter} />
          <ToggleControl label="pagination"       value={showPagination} onChange={setShowPagination} disabled={!showFooter} />
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
{renderCode({
  density, striped, stickyHeader, loading, empty, rowSelection, clickableRows,
  showToolbar, showSearch, showFilters, showFooter, showPagination,
})}
          </pre>
        </div>
      </div>
    </DocBlock>
  );
}

function renderCode(s: {
  density: TableDensity;
  striped: boolean;
  stickyHeader: boolean;
  loading: boolean;
  empty: boolean;
  rowSelection: boolean;
  clickableRows: boolean;
  showToolbar: boolean;
  showSearch: boolean;
  showFilters: boolean;
  showFooter: boolean;
  showPagination: boolean;
}) {
  const rootAttrs: string[] = [];
  if (s.density !== "comfortable") rootAttrs.push(`density="${s.density}"`);
  if (s.striped)                   rootAttrs.push(`striped`);
  const rootOpen = rootAttrs.length ? `<Table ${rootAttrs.join(" ")}>` : `<Table>`;

  const contentAttrs: string[] = [];
  if (s.stickyHeader) contentAttrs.push(`stickyHeader maxHeight={260}`);
  if (s.loading)      contentAttrs.push(`loading`);
  const contentOpen = contentAttrs.length ? `  <Table.Content ${contentAttrs.join(" ")}>` : `  <Table.Content>`;

  const lines: string[] = [];
  lines.push(rootOpen);

  if (s.showToolbar) {
    lines.push(`  <Table.Toolbar>`);
    if (s.showSearch)  lines.push(`    <Table.Search><Input placeholder="Search…" /></Table.Search>`);
    if (s.showFilters) lines.push(`    <Table.Filters>{filters}</Table.Filters>`);
    lines.push(`  </Table.Toolbar>`);
  }

  lines.push(contentOpen);
  lines.push(`    <Table.Header>`);
  lines.push(`      <Table.Row>`);
  if (s.rowSelection) lines.push(`        <Table.Head width={40} />`);
  lines.push(`        <Table.Head sort={sortDir} onSortChange={setSortDir}>Name</Table.Head>`);
  lines.push(`        <Table.Head>Role</Table.Head>`);
  lines.push(`        <Table.Head>Status</Table.Head>`);
  lines.push(`        <Table.Head numeric>Logins</Table.Head>`);
  lines.push(`      </Table.Row>`);
  lines.push(`    </Table.Header>`);
  lines.push(`    <Table.Body>`);

  if (s.loading) {
    lines.push(`      <Table.Row>`);
    lines.push(`        <Table.Cell colSpan={${s.rowSelection ? 5 : 4}} style={{ padding: 0 }}>`);
    lines.push(`          <Table.Loading label="Loading users…" />`);
    lines.push(`        </Table.Cell>`);
    lines.push(`      </Table.Row>`);
  } else if (s.empty) {
    lines.push(`      <Table.Row>`);
    lines.push(`        <Table.Cell colSpan={${s.rowSelection ? 5 : 4}} style={{ padding: 0 }}>`);
    lines.push(`          <Table.Empty title="No users found" description="…" />`);
    lines.push(`        </Table.Cell>`);
    lines.push(`      </Table.Row>`);
  } else {
    lines.push(`      {rows.map((u) => (`);
    lines.push(`        <Table.Row`);
    lines.push(`          key={u.id}`);
    lines.push(`          selected={selectedIds.has(u.id)}`);
    if (s.clickableRows) lines.push(`          onClick={() => toggleSelected(u.id)}`);
    lines.push(`        >`);
    if (s.rowSelection) lines.push(`          <Table.Cell><Checkbox … /></Table.Cell>`);
    lines.push(`          <Table.Cell>{u.name}</Table.Cell>`);
    lines.push(`          <Table.Cell>{u.role}</Table.Cell>`);
    lines.push(`          <Table.Cell><StatusChip>{u.status}</StatusChip></Table.Cell>`);
    lines.push(`          <Table.Cell numeric>{u.logins}</Table.Cell>`);
    lines.push(`        </Table.Row>`);
    lines.push(`      ))}`);
  }

  lines.push(`    </Table.Body>`);
  lines.push(`  </Table.Content>`);

  if (s.showFooter) {
    lines.push(`  <Table.Footer>`);
    lines.push(`    <span>Showing 1–10 of 42</span>`);
    if (s.showPagination) lines.push(`    <Table.Pagination>{pager}</Table.Pagination>`);
    lines.push(`  </Table.Footer>`);
  }

  lines.push(`</Table>`);
  return lines.join("\n");
}

/* ══════ Real-world examples ═══════════════════════════════════════ */

function ExamplesBlock() {
  return (
    <DocBlock
      title="Real-world examples"
      lead="Eight sketches of how downstream surfaces compose the same Table. These are illustrative — not shipped as reusable components."
    >
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr",
          gap: t.space.section.sm,
        }}
      >
        <PatientListExample />
        <UserListExample />
        <OrdersExample />
        <ActivityLogExample />
        <AuditLogExample />
        <SettingsTableExample />
        <EmptyTableExample />
        <LoadingTableExample />
      </div>
    </DocBlock>
  );
}

function ExampleShell({ title, description, children }: { title: string; description?: string; children: ReactNode }) {
  return (
    <div>
      <div style={{ marginBottom: t.space.stack.sm }}>
        <div style={{ fontWeight: 700, color: t.color.text.primary, fontSize: 14 }}>{title}</div>
        {description && <div style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>{description}</div>}
      </div>
      {children}
    </div>
  );
}

function PatientListExample() {
  return (
    <ExampleShell title="Patient list" description="Compact density + numeric columns + status chips.">
      <Table density="compact" ariaLabel="Patient list">
        <Table.Toolbar>
          <Table.Search><FakeSearchInput placeholder="Search patients…" /></Table.Search>
          <Table.Filters>
            <FakeFilterChip label="All units" />
            <FakeFilterChip label="Priority" />
          </Table.Filters>
        </Table.Toolbar>
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>MRN</Table.Head>
              <Table.Head>Unit</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head numeric>BP</Table.Head>
              <Table.Head numeric>HR</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {SAMPLE_PATIENTS.map((p) => (
              <Table.Row key={p.id}>
                <Table.Cell>{p.name}</Table.Cell>
                <Table.Cell>{p.mrn}</Table.Cell>
                <Table.Cell>{p.unit}</Table.Cell>
                <Table.Cell><FakeStatusChip tone={p.tone}>{p.status}</FakeStatusChip></Table.Cell>
                <Table.Cell numeric>{p.bp}</Table.Cell>
                <Table.Cell numeric>{p.hr}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </ExampleShell>
  );
}

function UserListExample() {
  const [sel, setSel] = useState<Set<string>>(new Set(["u2"]));
  const toggle = (id: string) => setSel((p) => { const n = new Set(p); n.has(id) ? n.delete(id) : n.add(id); return n; });
  return (
    <ExampleShell title="User list" description="Selection + trailing action.">
      <Table density="comfortable" ariaLabel="User list">
        <Table.Toolbar>
          <Table.Search><FakeSearchInput placeholder="Search team…" /></Table.Search>
          <Table.Filters>
            <Button size="sm" variant="secondary">Invite user</Button>
          </Table.Filters>
        </Table.Toolbar>
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Head width={40} />
              <Table.Head>Name</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head numeric width={110}>Last seen</Table.Head>
              <Table.Head width={56} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {SAMPLE_USERS.slice(0, 5).map((u) => (
              <Table.Row key={u.id} selected={sel.has(u.id)}>
                <Table.Cell><FakeCheckbox checked={sel.has(u.id)} onChange={() => toggle(u.id)} /></Table.Cell>
                <Table.Cell>{u.name}</Table.Cell>
                <Table.Cell>{u.role}</Table.Cell>
                <Table.Cell><FakeStatusChip tone={u.active ? "success" : "muted"}>{u.active ? "Active" : "Inactive"}</FakeStatusChip></Table.Cell>
                <Table.Cell numeric>{u.lastSeen}</Table.Cell>
                <Table.Cell><FakeIconButton /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
        <Table.Footer>
          <span>{sel.size} selected</span>
          <Table.Pagination>
            <FakePagerButton>Prev</FakePagerButton>
            <FakePagerButton>Next</FakePagerButton>
          </Table.Pagination>
        </Table.Footer>
      </Table>
    </ExampleShell>
  );
}

function OrdersExample() {
  return (
    <ExampleShell title="Orders" description="Numeric-heavy table with striped rows.">
      <Table density="comfortable" striped ariaLabel="Orders">
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Head>Order</Table.Head>
              <Table.Head>Customer</Table.Head>
              <Table.Head>Status</Table.Head>
              <Table.Head numeric>Items</Table.Head>
              <Table.Head numeric>Total</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {SAMPLE_ORDERS.map((o) => (
              <Table.Row key={o.id}>
                <Table.Cell>{o.id}</Table.Cell>
                <Table.Cell>{o.customer}</Table.Cell>
                <Table.Cell><FakeStatusChip tone={o.tone}>{o.status}</FakeStatusChip></Table.Cell>
                <Table.Cell numeric>{o.items}</Table.Cell>
                <Table.Cell numeric>${o.total.toFixed(2)}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </ExampleShell>
  );
}

function ActivityLogExample() {
  return (
    <ExampleShell title="Activity log" description="Leading icons + timestamps. Comfortable density.">
      <Table density="comfortable" ariaLabel="Activity log">
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Head>Event</Table.Head>
              <Table.Head>Actor</Table.Head>
              <Table.Head numeric width={140}>When</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {SAMPLE_ACTIVITY.map((a) => (
              <Table.Row key={a.id}>
                <Table.Cell leadingIcon={a.icon}>{a.event}</Table.Cell>
                <Table.Cell>{a.actor}</Table.Cell>
                <Table.Cell numeric>{a.when}</Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </ExampleShell>
  );
}

function AuditLogExample() {
  return (
    <ExampleShell title="Audit log" description="Compact + sticky header for scrolling long logs.">
      <Table density="compact" ariaLabel="Audit log">
        <Table.Content stickyHeader maxHeight={220}>
          <Table.Header>
            <Table.Row>
              <Table.Head numeric width={130}>Timestamp</Table.Head>
              <Table.Head>Actor</Table.Head>
              <Table.Head>Action</Table.Head>
              <Table.Head>Resource</Table.Head>
              <Table.Head>Result</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {SAMPLE_AUDIT.map((a) => (
              <Table.Row key={a.id}>
                <Table.Cell numeric>{a.time}</Table.Cell>
                <Table.Cell>{a.actor}</Table.Cell>
                <Table.Cell>{a.action}</Table.Cell>
                <Table.Cell>{a.resource}</Table.Cell>
                <Table.Cell>
                  <FakeStatusChip tone={a.ok ? "success" : "error"}>
                    {a.ok ? "Success" : "Denied"}
                  </FakeStatusChip>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </ExampleShell>
  );
}

function SettingsTableExample() {
  return (
    <ExampleShell title="Settings table" description="Relaxed density with trailing controls.">
      <Table density="relaxed" ariaLabel="Settings">
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Head>Setting</Table.Head>
              <Table.Head>Description</Table.Head>
              <Table.Head width={90} />
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {SAMPLE_SETTINGS.map((s) => (
              <Table.Row key={s.id}>
                <Table.Cell leadingIcon={s.icon}>{s.name}</Table.Cell>
                <Table.Cell>{s.description}</Table.Cell>
                <Table.Cell><FakeSwitch on={s.on} /></Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Content>
      </Table>
    </ExampleShell>
  );
}

function EmptyTableExample() {
  return (
    <ExampleShell title="Empty table" description="Empty-state illustration + primary action.">
      <Table density="comfortable" ariaLabel="Empty">
        <Table.Content>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head numeric>Value</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={3} style={{ padding: 0 }}>
                <Table.Empty
                  icon={<ClipboardList />}
                  title="No entries yet"
                  description="Once someone adds an entry, it will show up here."
                  action={<Button size="sm">Add entry</Button>}
                />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>
    </ExampleShell>
  );
}

function LoadingTableExample() {
  return (
    <ExampleShell title="Loading table" description="aria-busy + spinner.">
      <Table density="comfortable" ariaLabel="Loading">
        <Table.Content loading>
          <Table.Header>
            <Table.Row>
              <Table.Head>Name</Table.Head>
              <Table.Head>Role</Table.Head>
              <Table.Head numeric>Value</Table.Head>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            <Table.Row>
              <Table.Cell colSpan={3} style={{ padding: 0 }}>
                <Table.Loading label="Contacting server…" />
              </Table.Cell>
            </Table.Row>
          </Table.Body>
        </Table.Content>
      </Table>
    </ExampleShell>
  );
}

/* ══════ Props table ═══════════════════════════════════════════════ */

type PropRow = { name: string; type: string; def: string; desc: string };

const PROPS_ROOT: PropRow[] = [
  { name: "density",         type: "'compact' | 'comfortable' | 'relaxed'", def: "'comfortable'", desc: "Row-height + cell-padding ladder." },
  { name: "striped",         type: "boolean",                                def: "false",         desc: "Zebra striping on body rows." },
  { name: "hover",           type: "boolean",                                def: "false",         desc: "Force hover feedback on non-clickable rows." },
  { name: "fullWidth",       type: "boolean",                                def: "true",          desc: "Grow to fill the parent width." },
  { name: "bordered",        type: "boolean",                                def: "true",          desc: "Draw the outer surface frame (border + radius)." },
  { name: "ariaLabel",       type: "string",                                 def: "—",             desc: "Accessible name for the whole table surface." },
  { name: "ariaLabelledBy",  type: "string",                                 def: "—",             desc: "Wire an existing heading's id for aria-labelledby." },
];

const PROPS_CONTENT: PropRow[] = [
  { name: "stickyHeader",    type: "boolean",                    def: "false", desc: "Pin the header row to the top of a scrolling content region." },
  { name: "maxHeight",       type: "number | string",            def: "—",     desc: "Cap the height of the content region and enable vertical scrolling." },
  { name: "loading",         type: "boolean",                    def: "false", desc: "Mark the table busy — sets aria-busy on the <table>." },
];

const PROPS_ROW: PropRow[] = [
  { name: "selected",        type: "boolean",                    def: "false", desc: "Render as selected — subtle wash + brand accent + aria-selected." },
  { name: "disabled",        type: "boolean",                    def: "false", desc: "Dim the row and reject interaction; sets aria-disabled." },
  { name: "onClick",         type: "(e) => void",                def: "—",     desc: "Provide to make the row focusable + keyboard-activatable." },
];

const PROPS_HEAD: PropRow[] = [
  { name: "sort",            type: "'asc' | 'desc' | null",      def: "—",     desc: "Sort state for the column. Setting the prop enables the sort control." },
  { name: "onSortChange",    type: "(next) => void",             def: "—",     desc: "Fired when the sort control cycles." },
  { name: "numeric",         type: "boolean",                    def: "false", desc: "Right-align the head cell + apply tabular-nums." },
  { name: "width",           type: "number | string",            def: "—",     desc: "Fixed column width." },
];

const PROPS_CELL: PropRow[] = [
  { name: "numeric",         type: "boolean",                    def: "false", desc: "Right-align + tabular-nums for digit columns." },
  { name: "leadingIcon",     type: "ReactNode",                  def: "—",     desc: "Icon rendered before the cell content." },
  { name: "truncate",        type: "boolean",                    def: "true",  desc: "Truncate overflowing content with an ellipsis." },
];

const PROPS_EMPTY: PropRow[] = [
  { name: "icon",            type: "ReactNode",                  def: "—",     desc: "Icon shown above the title." },
  { name: "title",           type: "ReactNode",                  def: "—",     desc: "Short title." },
  { name: "description",     type: "ReactNode",                  def: "—",     desc: "Longer explanation." },
  { name: "action",          type: "ReactNode",                  def: "—",     desc: "A single Button or action group." },
];

const PROPS_LOADING: PropRow[] = [
  { name: "label",           type: "ReactNode",                  def: "—",     desc: "Text rendered under the spinner." },
];

function PropsTableBlock() {
  return (
    <DocBlock title="Props">
      <PropsSubsection title="Table"          rows={PROPS_ROOT} />
      <PropsSubsection title="Table.Content"  rows={PROPS_CONTENT} />
      <PropsSubsection title="Table.Row"      rows={PROPS_ROW} />
      <PropsSubsection title="Table.Head"     rows={PROPS_HEAD} />
      <PropsSubsection title="Table.Cell"     rows={PROPS_CELL} />
      <PropsSubsection title="Table.Empty"    rows={PROPS_EMPTY} />
      <PropsSubsection title="Table.Loading"  rows={PROPS_LOADING} />
      <div style={{ ...t.type.bodyS, color: t.color.text.tertiary, marginTop: t.space.stack.md }}>
        Table.Toolbar, Table.Search, Table.Filters, Table.Header, Table.Body, Table.Footer, and Table.Pagination have no props beyond standard HTML attributes.
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
      <div
        style={{
          border: `1px solid ${t.color.border.subtle}`,
          borderRadius: t.radius.control,
          background: t.color.background.default,
          overflow: "hidden",
        }}
      >
        <div style={{ display: "grid", gridTemplateColumns: "180px 1.4fr 100px 2fr", background: t.color.background.subtle, padding: `${t.space.inline.sm} ${t.space.inline.lg}`, borderBottom: `1px solid ${t.color.border.subtle}` }}>
          <HeaderCell>Prop</HeaderCell>
          <HeaderCell>Type</HeaderCell>
          <HeaderCell>Default</HeaderCell>
          <HeaderCell>Description</HeaderCell>
        </div>
        {rows.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "grid",
              gridTemplateColumns: "180px 1.4fr 100px 2fr",
              padding: `${t.space.inline.md} ${t.space.inline.lg}`,
              borderBottom: i === rows.length - 1 ? "none" : `1px solid ${t.color.border.subtle}`,
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
    { role: "Surface radius",     alias: "aliases.radius.surface (12px — matches Card + Dialog)" },
    { role: "Surface background", alias: "aliases.color.background.elevated" },
    { role: "Surface border",     alias: "aliases.color.border.subtle" },
    { role: "Surface shadow",     alias: "aliases.elevation.surface" },
    { role: "Toolbar padding",    alias: "aliases.spacing.stack.md + inline.lg" },
    { role: "Header background",  alias: "aliases.color.background.surface (subtle wash separates head from body)" },
    { role: "Header text",        alias: "font-size 12 · weight semibold · color text.tertiary · letter-spacing 0.06em" },
    { role: "Header border",      alias: "aliases.color.border.default" },
    { role: "Sticky-header shadow", alias: "aliases.elevation.raised" },
    { role: "Row heights",        alias: "components.table.cell.height — 28 / 36 / 44 (matches Button sm / md / lg)" },
    { role: "Row hover wash",     alias: "aliases.color.background.subtle" },
    { role: "Row selected wash",  alias: "aliases.color.background.subtle + brand accent bar via inset box-shadow" },
    { role: "Row disabled color", alias: "aliases.color.text.disabled" },
    { role: "Row focus ring",     alias: "aliases.color.border.focus (identical to Button + Input + Select + Card + Dialog)" },
    { role: "Cell font",          alias: "aliases.typography.bodyS (14/20) at compact + comfortable; body (16/24) at relaxed" },
    { role: "Cell padding",       alias: "components.table.cell.padding per density (8/4 · 12/8 · 16/12)" },
    { role: "Numeric alignment",  alias: "font-variant-numeric: tabular-nums + text-align right" },
    { role: "Leading icon",       alias: "size scales with density (14 / 16 / 18) · color text.tertiary" },
    { role: "Sort indicator",     alias: "color.text.tertiary → action.primary when active" },
    { role: "Empty state",        alias: "aliases.color.background.default + aliases.color.text.tertiary + spacing.section.sm" },
    { role: "Loading spinner",    alias: "aliases.color.border.default + action.primary on the top arc" },
    { role: "Footer",             alias: "aliases.color.background.elevated + border-top border.subtle + text.tertiary" },
    { role: "Row transition",     alias: "aliases.motion.hoverIn (duration 150, easing standard)" },
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
          { tone: "note", text: "The outer wrapper is a <div role='group'> so the table + toolbar + footer can share a single aria-label describing the whole surface. The inner <table> keeps proper table semantics regardless of what the wrapper renders." },
          { tone: "note", text: "Row heights and cell paddings are controlled by CSS custom properties set on the root (--hc-table-row-h, --hc-table-cell-pad-x/y). Change density on the root — every row and cell scales." },
          { tone: "note", text: "Sticky-header behavior is opt-in via stickyHeader + maxHeight on Table.Content. The header is sticky via position: sticky on <th>; the shadow appears once the body scrolls under the header." },
          { tone: "note", text: "Empty and Loading blocks are designed to sit inside a spanning <td> (Table.Row → Table.Cell colSpan) so the outer <table> semantics stay intact. Never render them outside the body." },
          { tone: "note", text: "Sortable columns are controlled — the consumer holds the sort state and passes sort + onSortChange. The Table.Head cycles asc → desc → null on activation and emits the correct aria-sort." },
          { tone: "note", text: "The row selection model is intentionally minimal — a per-row `selected` boolean + the consumer's own state. There is no built-in selection provider because selection belongs to the surface (bulk actions, keyboard model, indeterminate parent checkbox) rather than the primitive." },
        ]}
      />

      <Callout tone="info" title="Extending Table">
        (1) Specialized tables (PatientTable, OrderTable, AuditLogTable) should be
        thin compositions on top of this Table — not reimplementations. Wrap
        Table with an opinionated column set and reuse everything else.
        (2) Advanced features intentionally excluded from this primitive
        (column resizing, drag-and-drop, virtualization, inline editing,
        column pinning, tree tables, advanced filtering) belong in a separate
        <code style={{ fontFamily: t.font.mono, background: t.color.background.muted, padding: "0 4px", borderRadius: 3, margin: "0 4px" }}>
          DataGrid
        </code>
        primitive that composes this Table for its baseline rhythm.
      </Callout>
    </DocBlock>
  );
}

/* ══════ Built on ══════════════════════════════════════════════════ */

function BuiltOnBlock() {
  const rows = [
    { name: "Native <table>",     detail: "The inner element is a real HTML table so assistive tech gets proper semantics — thead, tbody, tr, th (scope='col'), td, aria-sort, aria-selected." },
    { name: "HC1 design tokens",  detail: "Every color, radius, spacing, elevation, and motion value is a token alias — no hex, no raw pixels, no bespoke shadows in the component." },
    { name: "HC1 Card language",  detail: "The surface frame intentionally mirrors Card — same radius, same elevated background, same border tone. A Table reads as a Card containing structured data." },
    { name: "HC1 Button ladder",  detail: "Row heights (28 / 36 / 44) match Button sizes (sm / md / lg) exactly — an inline Button sits flush with a row without adding vertical noise." },
    { name: "HC1 focus ring",     detail: "Clickable rows and sort buttons use the same 2px brand outline used by Button, Input, Select, Card, and Dialog — cross-family consistency." },
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
    { name: "Patient List",       detail: "Cross-module patient roster with priority chips, unit filters, and click-through to the patient detail." },
    { name: "User List",          detail: "Team management with row selection, bulk actions, and per-row role editing." },
    { name: "Audit Log",          detail: "Compact + sticky header, high-frequency rows. Timestamp column right-aligned with tabular-nums." },
    { name: "Activity Feed",      detail: "Leading icons per event type, actor + timestamp columns, chronological order." },
    { name: "Search Results",     detail: "Query-driven list with per-row scoring, leading icons for result type, and click-through to detail." },
    { name: "Orders",             detail: "Numeric-heavy table with striped rows and status chips per order." },
    { name: "Reports",            detail: "Grouped rows, numeric summaries, and export-to-CSV toolbar action." },
    { name: "Inventory",          detail: "SKU + quantity table with low-stock highlighting and per-row adjust action." },
    { name: "Transactions",       detail: "Amount + date columns, per-row status chip, and pagination for long histories." },
    { name: "Settings Lists",     detail: "Relaxed density with trailing switch or Select controls per row." },
    { name: "DataGrid (future)",  detail: "The advanced table primitive — column resize, virtualization, tree rows, inline edit — will compose this Table for its baseline rhythm." },
  ];
  return (
    <DocBlock
      title="Used by (future)"
      lead="Every table-shaped surface in HC1 should compose this Table. These are the anticipated consumers — none are shipped yet."
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
    { name: "ClinicalIQ worklist tables",  detail: "Bloodhealth + HerCare worklists currently ship bespoke row/cell styling. Migrate to Table with density='compact' and identical column semantics — no UX changes, just token unification." },
    { name: "SourceIQ pipeline tables",    detail: "SourceIQ tables use a divergent green-teal palette and off-scale row heights. Migrate as a mechanical token swap — Table's density='comfortable' matches SourceIQ's current row rhythm within ±2px." },
    { name: "Prototype tables",            detail: "Any table in prototypes/ that renders rows as divs should convert to Table. This gets proper table semantics, sortable columns, aria-selected, and the shared focus ring in one pass." },
    { name: "Ad-hoc <table> elements",     detail: "Any inline <table> in a product page — usually a stat breakdown or a small list — should wrap in Table for the surface frame and to inherit tokens." },
  ];
  return (
    <DocBlock
      title="Migration targets"
      lead="The HC1 Table is the intended replacement for every existing table implementation across the HC1 ecosystem. Do not redesign — standardize. The migration is a token + component swap, not a UX rebuild."
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

/* ══════ Fake controls used inside doc examples ════════════════════ */

function FakeSearchInput({ placeholder }: { placeholder: string }) {
  return (
    <div
      style={{
        display: "inline-flex", alignItems: "center", gap: t.space.inline.sm,
        height: 36, padding: `0 ${t.space.inline.md}`, width: "100%",
        border: `1px solid ${t.color.border.default}`, borderRadius: t.radius.control,
        background: t.color.background.default,
      }}
    >
      <Search size={14} color={t.color.text.tertiary} />
      <span style={{ ...t.type.bodyS, color: t.color.text.tertiary }}>{placeholder}</span>
    </div>
  );
}

function FakeFilterChip({ label }: { label: string }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: t.space.inline.xs,
        height: 28, padding: `0 ${t.space.inline.md}`,
        borderRadius: t.radius.chip, border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default,
        color: t.color.text.secondary, fontSize: 12, fontWeight: 600,
      }}
    >
      {label}
      <X size={12} color={t.color.text.tertiary} />
    </span>
  );
}

function FakeCheckbox({
  checked,
  onChange,
  disabled,
}: {
  checked?: boolean;
  onChange?: () => void;
  disabled?: boolean;
}) {
  // If no onChange is provided we render read-only so React doesn't warn
  // about a controlled checkbox without a change handler.
  const controlled = typeof onChange === "function";
  return (
    <input
      type="checkbox"
      {...(controlled
        ? { checked, onChange }
        : { defaultChecked: checked, readOnly: true })}
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      style={{ margin: 0 }}
    />
  );
}

function FakeIconButton({ disabled }: { disabled?: boolean }) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={(e) => e.stopPropagation()}
      aria-label="Row menu"
      style={{
        appearance: "none", border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default, color: t.color.text.tertiary,
        width: 28, height: 28, borderRadius: t.radius.control,
        display: "inline-flex", alignItems: "center", justifyContent: "center",
        cursor: disabled ? "not-allowed" : "pointer",
        opacity: disabled ? 0.5 : 1,
      }}
    >
      <MoreHorizontal size={14} />
    </button>
  );
}

function FakePagerButton({ children }: { children: ReactNode }) {
  return (
    <button
      type="button"
      style={{
        appearance: "none", border: `1px solid ${t.color.border.default}`,
        background: t.color.background.default, color: t.color.text.secondary,
        height: 28, padding: `0 ${t.space.inline.md}`, borderRadius: t.radius.control,
        fontSize: 12, fontWeight: 600, cursor: "pointer",
      }}
    >
      {children}
    </button>
  );
}

function FakeSwitch({ on }: { on: boolean }) {
  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center",
        width: 36, height: 20, borderRadius: 999,
        background: on ? t.color.action.primary : t.color.border.default,
        padding: 2,
      }}
      aria-hidden="true"
    >
      <span
        style={{
          width: 16, height: 16, borderRadius: "50%",
          background: t.color.background.default,
          transform: on ? "translateX(16px)" : "translateX(0)",
          transition: "transform 150ms",
        }}
      />
    </span>
  );
}

function FakeStatusChip({
  tone,
  children,
}: {
  tone: "success" | "warning" | "error" | "muted";
  children: ReactNode;
}) {
  const palette =
    tone === "success" ? { fg: t.color.status.success.fg, bg: t.color.status.success.bg, border: t.color.status.success.border } :
    tone === "warning" ? { fg: t.color.status.warning.fg, bg: t.color.status.warning.bg, border: t.color.status.warning.border } :
    tone === "error"   ? { fg: t.color.status.error.fg,   bg: t.color.status.error.bg,   border: t.color.status.error.border } :
                         { fg: t.color.text.tertiary,     bg: t.color.background.subtle, border: t.color.border.default };

  return (
    <span
      style={{
        display: "inline-flex", alignItems: "center", gap: 4,
        height: 20, padding: `0 ${t.space.inline.sm}`,
        borderRadius: t.radius.chip,
        background: palette.bg, color: palette.fg,
        border: `1px solid ${palette.border}`,
        fontSize: 12, fontWeight: 600, lineHeight: 1,
      }}
    >
      {children}
    </span>
  );
}

/* ══════ Sample data ═══════════════════════════════════════════════ */

type UserRow = { id: string; name: string; role: string; active: boolean; logins: number; lastSeen: string };
const SAMPLE_USERS: UserRow[] = [
  { id: "u1", name: "Dr. Amelia Chen",   role: "Attending",  active: true,  logins: 128, lastSeen: "2m ago" },
  { id: "u2", name: "Dr. Ben Ito",       role: "Resident",   active: true,  logins: 84,  lastSeen: "12m ago" },
  { id: "u3", name: "Dr. Carla Reyes",   role: "Nurse",      active: false, logins: 62,  lastSeen: "3h ago" },
  { id: "u4", name: "Dr. Devon Rao",     role: "Attending",  active: true,  logins: 214, lastSeen: "1d ago" },
  { id: "u5", name: "Dr. Elena Wu",      role: "Fellow",     active: true,  logins: 48,  lastSeen: "3d ago" },
];

type PatientRow = { id: string; name: string; mrn: string; unit: string; status: string; tone: "success" | "warning" | "error" | "muted"; bp: string; hr: number };
const SAMPLE_PATIENTS: PatientRow[] = [
  { id: "p1", name: "Jane Cooper",  mrn: "4482991", unit: "ICU",    status: "Critical",  tone: "error",   bp: "168 / 98", hr: 122 },
  { id: "p2", name: "Marcus Lee",   mrn: "4482815", unit: "Card",   status: "Stable",    tone: "success", bp: "128 / 82", hr: 76 },
  { id: "p3", name: "Priya Rao",    mrn: "4482701", unit: "ED",     status: "Watch",     tone: "warning", bp: "142 / 90", hr: 98 },
  { id: "p4", name: "Omar Haddad",  mrn: "4482688", unit: "Card",   status: "Stable",    tone: "success", bp: "118 / 78", hr: 68 },
];

type OrderRow = { id: string; customer: string; status: string; tone: "success" | "warning" | "error" | "muted"; items: number; total: number };
const SAMPLE_ORDERS: OrderRow[] = [
  { id: "ORD-1042", customer: "West Loop Clinic",  status: "Fulfilled", tone: "success", items: 3, total: 128.40 },
  { id: "ORD-1041", customer: "Northside Hospital", status: "In transit", tone: "warning", items: 12, total: 942.10 },
  { id: "ORD-1040", customer: "Riverside Labs",     status: "Cancelled",  tone: "error",   items: 6, total: 214.00 },
  { id: "ORD-1039", customer: "Downtown Practice",  status: "Fulfilled", tone: "success", items: 2, total: 68.50 },
];

type ActivityRow = { id: string; event: string; actor: string; when: string; icon: ReactNode };
const SAMPLE_ACTIVITY: ActivityRow[] = [
  { id: "a1", event: "Signed care plan",         actor: "Dr. Chen",  when: "2m ago",  icon: <ClipboardList /> },
  { id: "a2", event: "Approved medication",       actor: "Dr. Ito",   when: "12m ago", icon: <Check /> },
  { id: "a3", event: "Flagged critical result",   actor: "Dr. Reyes", when: "26m ago", icon: <AlertCircle /> },
  { id: "a4", event: "Admin: reset password",     actor: "System",    when: "1h ago",  icon: <Shield /> },
];

type AuditRow = { id: string; time: string; actor: string; action: string; resource: string; ok: boolean };
const SAMPLE_AUDIT: AuditRow[] = [
  { id: "au1", time: "12:04:22", actor: "chen@hc1.com",  action: "READ",   resource: "patient/4482991",  ok: true },
  { id: "au2", time: "12:04:21", actor: "ito@hc1.com",   action: "UPDATE", resource: "careplan/9822",    ok: true },
  { id: "au3", time: "12:04:18", actor: "reyes@hc1.com", action: "DELETE", resource: "note/38214",       ok: false },
  { id: "au4", time: "12:04:17", actor: "rao@hc1.com",   action: "READ",   resource: "patient/4482815",  ok: true },
  { id: "au5", time: "12:04:14", actor: "wu@hc1.com",    action: "READ",   resource: "patient/4482701",  ok: true },
  { id: "au6", time: "12:04:11", actor: "system",        action: "LOGIN",  resource: "session/29184",    ok: true },
  { id: "au7", time: "12:04:08", actor: "chen@hc1.com",  action: "EXPORT", resource: "report/2024-Q4",   ok: true },
  { id: "au8", time: "12:04:02", actor: "ito@hc1.com",   action: "UPDATE", resource: "careplan/9821",    ok: true },
];

type SettingRow = { id: string; name: string; description: string; on: boolean; icon: ReactNode };
const SAMPLE_SETTINGS: SettingRow[] = [
  { id: "s1", name: "Critical lab alerts", description: "Send a page for out-of-range results 24/7.",             on: true,  icon: <AlertCircle /> },
  { id: "s2", name: "Weekly digest",       description: "Email a summary of orders and consults every Monday.",   on: true,  icon: <FileText /> },
  { id: "s3", name: "Two-factor auth",     description: "Require a second factor for all sign-ins.",              on: false, icon: <Shield /> },
];
