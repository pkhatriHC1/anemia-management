import { useEffect, useMemo, useState } from "react";
import { CalendarPlus, MoreHorizontal, Pencil, Search, X } from "lucide-react";
import { Badge, Button, DropdownMenu, EmptyState, PageHeader, Table } from "@hc1com/design-system";
import { FilterBar, KpiCard, KpiGroup, PageTemplate } from "@hc1com/design-system/patterns";
import { CAN_CLINICAL_NAVIGATION, SPECIALTIES, getFollowUps } from "./followUpStore";
import { ScheduleFollowUpModal } from "./ScheduleFollowUpModal";
import { FollowUpDetailModal } from "./FollowUpDetailModal";

export const STATUS_VARIANT = { Scheduled: "info", Completed: "success", Cancelled: "neutral" };
export const SPECIALTY_VARIANT = { "Non-Surgical Medical": "primary", "Women's Health-Non-Surgical": "warning" };
const STATUSES = ["Scheduled", "Completed", "Cancelled"];

export const formatDateTime = iso => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const p = n => String(n).padStart(2, "0");
  return `${p(d.getMonth() + 1)}/${p(d.getDate())}/${d.getFullYear()}, ${p(d.getHours())}:${p(d.getMinutes())}`;
};

export const isOverdue = v => v.status === "Scheduled" && new Date(v.followUpAt).getTime() < Date.now();
const isDueIn7 = v => {
  if (v.status !== "Scheduled") return false;
  const diff = new Date(v.followUpAt).getTime() - Date.now();
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
};

/** Follow-up visits across all patients, with schedule, view, edit and cancel. */
export function FollowUpWorklist({ patients = [], onOpenPatient }) {
  const [visits, setVisits] = useState(() => getFollowUps());
  const [search, setSearch] = useState("");
  const [specialty, setSpecialty] = useState(undefined);
  const [status, setStatus] = useState(undefined);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [detail, setDetail] = useState(null);
  const [mode, setMode] = useState("view");

  useEffect(() => {
    const update = () => setVisits(getFollowUps());
    window.addEventListener("follow-ups-updated", update);
    window.addEventListener("storage", update);
    return () => { window.removeEventListener("follow-ups-updated", update); window.removeEventListener("storage", update); };
  }, []);

  const counts = useMemo(() => ({
    scheduled: visits.filter(v => v.status === "Scheduled").length,
    dueIn7: visits.filter(isDueIn7).length,
    overdue: visits.filter(isOverdue).length,
  }), [visits]);

  const rows = useMemo(() => {
    const q = search.toLowerCase();
    const matched = visits.filter(v =>
      (!q || v.patientName.toLowerCase().includes(q) || v.patientId.toLowerCase().includes(q))
      && (!specialty || v.specialties.includes(specialty))
      && (!status || v.status === status));
    return [...matched].sort((a, b) => {
      const as = a.status === "Scheduled"; const bs = b.status === "Scheduled";
      if (as !== bs) return as ? -1 : 1;
      const da = new Date(a.followUpAt).getTime(); const db = new Date(b.followUpAt).getTime();
      if (as) {
        const ao = isOverdue(a); const bo = isOverdue(b);
        if (ao !== bo) return ao ? -1 : 1;
        return da - db;
      }
      return db - da;
    });
  }, [visits, search, specialty, status]);

  const filtersActive = search !== "" || specialty !== undefined || status !== undefined;
  const clear = () => { setSearch(""); setSpecialty(undefined); setStatus(undefined); };
  const open = (v, m) => { setDetail(v); setMode(m); };

  return (
    <PageTemplate>
      <PageHeader
        title="Follow-up visits"
        subtitle="Scheduled, completed and cancelled follow-ups for anemia patients"
        actions={CAN_CLINICAL_NAVIGATION && (
          <Button variant="default" size="sm" onClick={() => setScheduleOpen(true)}>
            <CalendarPlus /> Schedule follow-up
          </Button>
        )}
      />

      <KpiGroup>
        <KpiCard label="Scheduled" value={counts.scheduled} />
        <KpiCard label="Due in 7 days" value={counts.dueIn7} />
        <KpiCard label="Overdue" value={counts.overdue} supportingText={counts.overdue > 0 ? "Past the follow-up date and still scheduled" : "None past due"} />
      </KpiGroup>

      <div className="flex flex-col gap-16">
        <FilterBar onClearAll={filtersActive ? clear : undefined}>
          <FilterBar.Search
            aria-label="Search patient name or ID"
            placeholder="Search patient name or ID"
            value={search}
            onChange={e => setSearch(e.target.value)}
            onClear={() => setSearch("")}
          />
          <FilterBar.Filter label="Specialty" value={specialty} onChange={v => setSpecialty(v || undefined)}
            options={SPECIALTIES.map(s => ({ value: s, label: s }))} width={280} />
          <FilterBar.Filter label="Status" value={status} onChange={v => setStatus(v || undefined)}
            options={STATUSES.map(s => ({ value: s, label: s }))} width={180} />
        </FilterBar>

        {visits.length === 0 || rows.length === 0 ? (
          <EmptyState variant={visits.length === 0 ? "default" : "search"} layout="contained">
            <EmptyState.Icon>{visits.length === 0 ? <CalendarPlus /> : <Search />}</EmptyState.Icon>
            <EmptyState.Title>{visits.length === 0 ? "No follow-up visits scheduled" : "No follow-ups match your filters"}</EmptyState.Title>
            <EmptyState.Description>
              {visits.length === 0 ? "Schedule a follow-up from here or from a patient's record." : "Try a different search, or clear the filters."}
            </EmptyState.Description>
            {visits.length > 0 && (
              <EmptyState.Actions><Button variant="outline" size="sm" onClick={clear}>Clear filters</Button></EmptyState.Actions>
            )}
          </EmptyState>
        ) : (
          <Table density="relaxed">
            <Table.Content>
              <Table.Header>
                <Table.Row>
                  <Table.Head width={300}>Patient</Table.Head>
                  <Table.Head>Specialty</Table.Head>
                  <Table.Head width={200}>Follow-up date</Table.Head>
                  <Table.Head>Referring provider</Table.Head>
                  <Table.Head>Scheduled by</Table.Head>
                  <Table.Head width={64}><span className="sr-only">Actions</span></Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                {rows.map(v => (
                  <Table.Row key={v.id} onClick={() => open(v, "view")}>
                    <Table.Cell truncate={false}>
                      <div className="flex flex-col gap-4">
                        <div className="flex items-center gap-8 whitespace-nowrap">
                          <Button variant="link" size="sm" className="h-auto px-0 font-semibold"
                            onClick={e => { e.stopPropagation(); onOpenPatient?.(v.patientId); }}>
                            {v.patientName}
                          </Button>
                          <Badge variant={STATUS_VARIANT[v.status] || "neutral"} appearance="soft" size="sm">{v.status}</Badge>
                        </div>
                        <span className="text-12 tabular-nums text-[color:var(--hc-color-text-supporting)]">MRN {v.patientId}</span>
                      </div>
                    </Table.Cell>
                    <Table.Cell truncate={false}>
                      <div className="flex flex-wrap gap-4">
                        {v.specialties.map(s => <Badge key={s} variant={SPECIALTY_VARIANT[s] || "neutral"} appearance="soft" size="sm">{s}</Badge>)}
                      </div>
                    </Table.Cell>
                    <Table.Cell truncate={false}>
                      <div className="flex flex-wrap items-center gap-8">
                        <span className="tabular-nums">{formatDateTime(v.followUpAt)}</span>
                        {isOverdue(v) && <Badge variant="danger" appearance="soft" size="sm">Overdue</Badge>}
                      </div>
                    </Table.Cell>
                    <Table.Cell>{v.referringProvider || "—"}</Table.Cell>
                    <Table.Cell truncate={false}>
                      <div className="flex flex-col gap-4">
                        <span className="font-medium">{v.createdBy || "—"}</span>
                        {v.createdAt && <span className="whitespace-nowrap text-12 tabular-nums text-[color:var(--hc-color-text-supporting)]">{formatDateTime(v.createdAt)}</span>}
                      </div>
                    </Table.Cell>
                    <Table.Cell truncate={false} className="text-right" onClick={e => e.stopPropagation()}>
                      <DropdownMenu>
                        <DropdownMenu.Trigger asChild>
                          <Button variant="ghost" size="icon-sm" aria-label={`Actions for ${v.patientName}`}><MoreHorizontal /></Button>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Content size="sm" align="end">
                          <DropdownMenu.Item onSelect={() => open(v, "edit")}><Pencil /> Edit</DropdownMenu.Item>
                          {v.status === "Scheduled" && (
                            <DropdownMenu.Item destructive onSelect={() => open(v, "cancel")}><X /> Cancel visit</DropdownMenu.Item>
                          )}
                        </DropdownMenu.Content>
                      </DropdownMenu>
                    </Table.Cell>
                  </Table.Row>
                ))}
              </Table.Body>
            </Table.Content>
          </Table>
        )}

        <p className="text-12 text-[color:var(--hc-color-text-supporting)]">Showing {rows.length} of {visits.length} follow-ups</p>
      </div>

      {scheduleOpen && <ScheduleFollowUpModal patients={patients} onClose={() => setScheduleOpen(false)} />}
      {detail && (
        <FollowUpDetailModal
          key={`${detail.id}-${mode}`}
          visit={detail}
          initialMode={mode}
          onOpenPatient={onOpenPatient}
          onClose={() => { setDetail(null); setMode("view"); }}
        />
      )}
    </PageTemplate>
  );
}
