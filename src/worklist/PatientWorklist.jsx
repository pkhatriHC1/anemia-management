import { useMemo, useState } from "react";
import { ChevronDown, FlaskConicalOff, MoreHorizontal, Search, X } from "lucide-react";
import { Badge, Button, Calendar, DropdownMenu, Popover, EmptyState, Gauge, PageHeader, Select, Table } from "@hc1com/design-system";
import { FilterBar, PageTemplate } from "@hc1com/design-system/patterns";
import {
  CASE_TYPES, FACILITIES, STATUS_OPTIONS, PATIENTS, TRS_GAUGE_TIER,
  dateInputValue, fmtCaseDate, getAnemiaGrade, getDeltaRisk, trsTier,
} from "../lib/clinical";
import { getAuditTrail } from "../lib/notifyStores";
import { getPendingCount } from "../workspace/CareCoordination";

const CASE_TYPE_OPTIONS = CASE_TYPES.slice(1);
const SEVERITY_OPTIONS = ["Severe", "Moderate", "Mild", "No Anemia"];
const SEV_RANK = { Severe: 0, Moderate: 1, Mild: 2, "No Anemia": 3 };
const SORT_OPTIONS = [
  { value: "Severity", label: "Sort: Severity" },
  { value: "Visit Date", label: "Sort: Visit date" },
];

/** Four-tier severity, shared by the anemia grade and the transfusion risk score. */
const SEV4 = {
  severe: { label: "Severe", variant: "danger" },
  moderate: { label: "Moderate", variant: "warning" },
  mild: { label: "Mild", variant: "warning" },
  normal: { label: "Normal", variant: "success" },
};

export function SeverityBadge({ tier }) {
  const t = SEV4[tier] ?? SEV4.normal;
  return <Badge variant={t.variant} appearance="soft" size="sm">{t.label}</Badge>;
}

/** Lab value colour by result status: critical red, high amber, otherwise default text. */
export function labTone(status) {
  if (status === "critical") return "text-[color:var(--hc-color-status-error-fg)]";
  if (status === "high" || status === "borderline") return "text-[color:var(--hc-color-status-warning-fg)]";
  return "text-[color:var(--hc-color-text-primary)]";
}

function LabValue({ label, lab, unit }) {
  const missing = !lab || lab.missing;
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">{label}</span>
      {missing ? (
        <span className="flex items-center gap-4 text-12 text-[color:var(--hc-color-text-tertiary)]">
          <FlaskConicalOff className="size-16" aria-hidden /> Pending
        </span>
      ) : (
        <span className="flex items-baseline gap-4">
          <span className={`text-24 font-semibold leading-tight tabular-nums ${labTone(lab.status)}`}>{lab.value}</span>
          <span className="text-12 text-[color:var(--hc-color-text-supporting)]">{unit}</span>
        </span>
      )}
    </div>
  );
}

/** Multi-select filter: a button that opens checkbox items, plus Select all. */
function MultiFilter({ label, options, selected, onChange }) {
  const all = selected.length === options.length;
  const summary = all ? "All" : selected.length === 0 ? "None" : selected.length === 1 ? selected[0] : `${selected.length} selected`;
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>
        <Button variant="outline" size="sm">
          {label}: {summary} <ChevronDown />
        </Button>
      </DropdownMenu.Trigger>
      <DropdownMenu.Content size="md" align="start">
        <DropdownMenu.CheckboxItem checked={all} onCheckedChange={() => onChange(all ? [] : options)} onSelect={e => e.preventDefault()}>
          Select all
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        {options.map(o => (
          <DropdownMenu.CheckboxItem
            key={o}
            checked={selected.includes(o)}
            onCheckedChange={() => onChange(selected.includes(o) ? selected.filter(v => v !== o) : [...selected, o])}
            onSelect={e => e.preventDefault()}
          >
            {o}
          </DropdownMenu.CheckboxItem>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

const LATEST_SURGERY = new Date(Math.max(...PATIENTS.map(p => new Date(p.admitDate).getTime() || 0)));
const shortDate = d => d.toLocaleDateString("en-US", { month: "short", day: "numeric" });

/** Date range filter: a button like the other filters that opens a range calendar. */
function DateRangeFilter({ label, shortLabel, from, to, defaultMonth, onChange }) {
  const [open, setOpen] = useState(false);
  const summary = from && to ? `${shortDate(from)} – ${shortDate(to)}` : from ? `From ${shortDate(from)}` : to ? `Until ${shortDate(to)}` : "Any";
  return (
    <Popover open={open} onOpenChange={setOpen} placement="bottom">
      <Popover.Trigger asChild>
        <Button variant="outline" size="sm">
          {from || to ? shortLabel ?? label : label}: {summary} <ChevronDown />
        </Button>
      </Popover.Trigger>
      <Popover.Content ariaLabel={label}>
        <div className="flex flex-col gap-12">
          <Calendar
            mode="range"
            defaultMonth={from ?? defaultMonth}
            selected={{ from, to }}
            onSelect={r => onChange(r?.from, r?.to)}
          />
          {(from || to) && (
            <Button variant="ghost" size="sm" className="self-end" onClick={() => { onChange(undefined, undefined); setOpen(false); }}>
              Clear dates
            </Button>
          )}
        </div>
      </Popover.Content>
    </Popover>
  );
}

const toIso = d => (d ? `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}` : "");

/**
 * The anemia patient worklist.
 * onOpen(patient, zone) opens the patient workspace; onCancel(patient) starts a visit cancellation;
 * onOpenTrs(patient) shows the transfusion risk score breakdown.
 */
export function PatientWorklist({ completed, cancelled, onOpen, onCancel, onOpenTrs }) {
  const [search, setSearch] = useState("");
  const [facilities, setFacilities] = useState(FACILITIES);
  const [caseTypes, setCaseTypes] = useState(CASE_TYPE_OPTIONS);
  const [severity, setSeverity] = useState(undefined);
  const [status, setStatus] = useState("Active");
  const [start, setStart] = useState(undefined);
  const [end, setEnd] = useState(undefined);
  const [sortBy, setSortBy] = useState("Severity");

  const filtersActive = search !== "" || facilities.length !== FACILITIES.length || caseTypes.length !== CASE_TYPE_OPTIONS.length
    || severity !== undefined || status !== "Active" || start !== undefined || end !== undefined;
  const reset = () => {
    setSearch(""); setFacilities(FACILITIES); setCaseTypes(CASE_TYPE_OPTIONS); setSeverity(undefined);
    setStatus("Active"); setStart(undefined); setEnd(undefined); setSortBy("Severity");
  };

  const rows = useMemo(() => {
    const startIso = toIso(start); const endIso = toIso(end); const q = search.toLowerCase();
    const filtered = PATIENTS.filter(p => {
      const surgery = dateInputValue(p.admitDate);
      const dateOk = (!startIso || surgery >= startIso) && (!endIso || surgery <= endIso);
      const statusOk = status === "Completed" ? completed.has(p.id)
        : status === "Cancelled" ? cancelled.has(p.id)
        : status === "Notified" ? getAuditTrail(p.id).some(e => e.action && e.action.startsWith("Notify")) && !completed.has(p.id) && !cancelled.has(p.id)
        : !completed.has(p.id) && !cancelled.has(p.id) && (p.caseStatus || "Active") === status;
      const searchOk = !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q) || p.provider.toLowerCase().includes(q);
      const severityOk = !severity || getAnemiaGrade(p.labs[0].value).label === severity;
      return statusOk && facilities.includes(p.facility) && searchOk && caseTypes.includes(p.caseType) && dateOk && severityOk;
    });
    const byDate = (a, b) => (new Date(a.admitDate).getTime() || 0) - (new Date(b.admitDate).getTime() || 0);
    return [...filtered].sort((a, b) => {
      if (sortBy === "Visit Date") return byDate(a, b);
      const ra = SEV_RANK[getAnemiaGrade(a.labs[0].value).label] ?? 99;
      const rb = SEV_RANK[getAnemiaGrade(b.labs[0].value).label] ?? 99;
      return ra === rb ? -byDate(a, b) : ra - rb;
    });
  }, [search, facilities, caseTypes, severity, status, start, end, sortBy, completed, cancelled]);

  return (
    <PageTemplate>
      <PageHeader
        title="Patient worklist"
        subtitle="Surgical patients screened for anemia, ranked by severity"
        actions={<Select aria-label="Sort by" options={SORT_OPTIONS} value={sortBy} onChange={setSortBy} size="sm" fullWidth={false} />}
      />

      <div className="flex flex-col gap-16">
        <FilterBar onClearAll={filtersActive ? reset : undefined}>
          <FilterBar.Search
            aria-label="Search patients, MRN or provider"
            placeholder="Search patients, MRN, provider"
            width={220}
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
          <MultiFilter label="Facility" options={FACILITIES} selected={facilities} onChange={setFacilities} />
          <MultiFilter label="Case type" options={CASE_TYPE_OPTIONS} selected={caseTypes} onChange={setCaseTypes} />
          <DateRangeFilter label="Surgery date" shortLabel="Surgery" from={start} to={end} defaultMonth={LATEST_SURGERY} onChange={(f, t) => { setStart(f); setEnd(t); }} />
          <FilterBar.Filter
            label="Status"
            value={status}
            onChange={v => setStatus(v || "Active")}
            options={STATUS_OPTIONS.map(o => ({ value: o, label: o }))}
            width={150}
          />
          <FilterBar.Filter
            label="Severity"
            value={severity}
            onChange={v => setSeverity(v || undefined)}
            options={SEVERITY_OPTIONS.map(o => ({ value: o, label: o }))}
            width={160}
          />
        </FilterBar>

        {rows.length === 0 ? (
          <EmptyState variant="search" layout="contained">
            <EmptyState.Icon><Search /></EmptyState.Icon>
            <EmptyState.Title>No patients match</EmptyState.Title>
            <EmptyState.Description>Try a different search, or clear the filters.</EmptyState.Description>
            {filtersActive && (
              <EmptyState.Actions>
                <Button variant="outline" size="sm" onClick={reset}>Clear filters</Button>
              </EmptyState.Actions>
            )}
          </EmptyState>
        ) : (
          <Table density="relaxed">
            <Table.Content>
              <Table.Header>
                <Table.Row>
                  <Table.Head width="26%">Patient</Table.Head>
                  <Table.Head width="24%">Lab values</Table.Head>
                  <Table.Head width={96}>TRS</Table.Head>
                  <Table.Head>Risk identifiers</Table.Head>
                  <Table.Head width={128}>Provider</Table.Head>
                  <Table.Head width={64}><span className="sr-only">Actions</span></Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map(p => (
                  <PatientRow
                    key={p.id}
                    p={p}
                    isCancelled={cancelled.has(p.id)}
                    onOpen={onOpen}
                    onCancel={onCancel}
                    onOpenTrs={onOpenTrs}
                  />
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        )}

        <p className="text-12 text-[color:var(--hc-color-text-supporting)]">Showing {rows.length} of {PATIENTS.length} patients</p>
      </div>
    </PageTemplate>
  );
}

function PatientRow({ p, isCancelled, onOpen, onCancel, onOpenTrs }) {
  const grade = getAnemiaGrade(p.labs[0].value);
  const delta = getDeltaRisk(p.labs[0].draws);
  const pending = getPendingCount(p.id);
  const ferritin = p.labs.find(l => l.label === "Ferritin");
  const tsat = p.labs.find(l => l.label === "Transferrin Sat");

  return (
    <Table.Row onClick={() => onOpen(p, "overview")}>
      <Table.Cell truncate={false}>
        <div className="flex flex-col gap-4">
          <div className="flex flex-wrap items-center gap-8">
            <span className="text-16 font-semibold text-[color:var(--hc-color-text-primary)]">{p.name}</span>
            <SeverityBadge tier={grade.tier} />
            {isCancelled && <Badge variant="neutral" appearance="soft" size="sm">Cancelled</Badge>}
            {delta?.isRisk && <Badge variant="danger" appearance="solid" size="sm">ΔHb {delta.pct}%</Badge>}
          </div>
          <span className="text-14 tabular-nums text-[color:var(--hc-color-text-supporting)]">MRN {p.id} · Age {p.age}</span>
          <span className="text-14 tabular-nums text-[color:var(--hc-color-text-supporting)]">Surgery {fmtCaseDate(p.admitDate)}</span>
          <div className="flex flex-wrap items-center gap-8 pt-4">
            <Badge variant="neutral" appearance="outline" size="sm">{p.caseType}</Badge>
            {pending > 0 && (
              <Button
                variant="ghost"
                size="xs"
                aria-label={`${pending} pending care coordination messages`}
                onClick={e => { e.stopPropagation(); onOpen(p, "cc"); }}
              >
                <Badge variant="danger" appearance="soft" size="xs">{pending}</Badge> Care coordination
              </Button>
            )}
          </div>
        </div>
      </Table.Cell>
      <Table.Cell truncate={false}>
        <div className="grid grid-cols-3 gap-16">
          <LabValue label="Hgb" lab={p.labs[0]} unit="g/dL" />
          <LabValue label="Ferritin" lab={ferritin} unit="ng/mL" />
          <LabValue label="TSAT" lab={tsat} unit="%" />
        </div>
      </Table.Cell>
      <Table.Cell truncate={false} onClick={e => e.stopPropagation()}>
        <button
          type="button"
          data-slot="trs-score"
          className="flex flex-col items-start gap-4 rounded-control focus-visible:outline-2 focus-visible:outline-[color:var(--hc-color-border-focus)]"
          aria-label={`Transfusion risk score ${p._trs.score} of 10. Show breakdown`}
          onClick={() => onOpenTrs(p)}
        >
          <Gauge value={p._trs.score} max={10} tier={TRS_GAUGE_TIER[p._trs.trsSev] || "low"} size="sm" />
          <SeverityBadge tier={trsTier(p._trs.trsSev)} />
        </button>
      </Table.Cell>
      <Table.Cell truncate={false}>
        <div className="flex flex-wrap gap-4">
          {p.conditions.map(c => <Badge key={c} variant="neutral" appearance="soft" size="sm">{c}</Badge>)}
        </div>
      </Table.Cell>
      <Table.Cell className="font-medium">{p.provider}</Table.Cell>
      <Table.Cell truncate={false} className="text-right" onClick={e => e.stopPropagation()}>
        {!isCancelled && (
          <DropdownMenu>
            <DropdownMenu.Trigger asChild>
              <Button variant="ghost" size="icon-sm" aria-label={`More actions for ${p.name}`}><MoreHorizontal /></Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content size="sm" align="end">
              <DropdownMenu.Item destructive onSelect={() => onCancel(p)}>
                <X /> Cancel visit
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu>
        )}
      </Table.Cell>
    </Table.Row>
  );
}
