import { useEffect, useState } from "react";
import { ArrowLeft, CalendarClock, ClipboardList, MessageSquare, Stethoscope } from "lucide-react";
import { Badge, Button, DropdownMenu, PageHeader, Tabs } from "@hc1com/design-system";
import { PageTemplate } from "@hc1com/design-system/patterns";
import { getAnemiaGrade } from "../lib/clinical";
import { SeverityBadge } from "../worklist/PatientWorklist";
import { CAN_CLINICAL_NAVIGATION, getFollowUps } from "../followup/followUpStore";
import { getVisitCancellation } from "../followup/visitCancellationStore";
import { getPendingCount } from "./CareCoordination";
import { FollowUpDetailModal } from "../followup/FollowUpDetailModal";
import { ScheduleFollowUpModal } from "../followup/ScheduleFollowUpModal";
import { CareCoordination } from "./CareCoordination";
import { OverviewZone } from "./OverviewZone";

const pad = n => String(n).padStart(2, "0");
export const formatFollowUp = iso => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const scheduledFor = id => getFollowUps()
  .filter(v => v.patientId === id && v.status === "Scheduled")
  .sort((a, b) => new Date(a.followUpAt) - new Date(b.followUpAt));

/** Scheduled follow-ups for the patient: one opens its details, several open a list first. */
function FollowUpChip({ visits, onOpen }) {
  const soonest = visits[0];
  if (!soonest) return null;
  const overdue = new Date(soonest.followUpAt).getTime() < Date.now();
  const label = `${overdue ? "Overdue follow-up" : "Follow-up"} · ${formatFollowUp(soonest.followUpAt)}${visits.length > 1 ? ` +${visits.length - 1}` : ""}`;
  const chip = (
    <Button variant="outline" size="xs" onClick={visits.length === 1 ? () => onOpen(soonest) : undefined}>
      <CalendarClock className={overdue ? "text-[color:var(--hc-color-status-error-fg)]" : undefined} /> {label}
    </Button>
  );
  if (visits.length === 1) return chip;
  return (
    <DropdownMenu>
      <DropdownMenu.Trigger asChild>{chip}</DropdownMenu.Trigger>
      <DropdownMenu.Content size="md" align="start">
        <DropdownMenu.Label>Scheduled follow-ups</DropdownMenu.Label>
        {visits.map(v => (
          <DropdownMenu.Item key={v.id} onSelect={() => onOpen(v)}>
            <span className="flex flex-col gap-4">
              <span className="font-medium">
                {formatFollowUp(v.followUpAt)}
                {new Date(v.followUpAt).getTime() < Date.now() && <span className="ml-8 text-[color:var(--hc-color-status-error-fg)]">Overdue</span>}
              </span>
              <span className="text-12 text-[color:var(--hc-color-text-supporting)]">{(v.specialties || []).join(", ")}</span>
            </span>
          </DropdownMenu.Item>
        ))}
      </DropdownMenu.Content>
    </DropdownMenu>
  );
}

/**
 * One patient: header with identity, conditions and follow-ups, then three tabs —
 * clinical decision support, optimization recommendations (the care plan) and care coordination.
 * `renderCarePlan(patient)` renders the care plan tab.
 */
export function PatientWorkspace({ patient: p, onBack, defaultZone = "overview", backLabel = "Back to worklist", renderCarePlan }) {
  const [zone, setZone] = useState(defaultZone);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [detailVisit, setDetailVisit] = useState(null);
  const [visits, setVisits] = useState(() => scheduledFor(p.id));
  const [cancellation, setCancellation] = useState(() => getVisitCancellation(p.id));
  const pending = getPendingCount(p.id);
  const grade = getAnemiaGrade(p.labs[0].value);

  useEffect(() => {
    const refresh = () => setVisits(scheduledFor(p.id));
    const refreshCancellation = () => setCancellation(getVisitCancellation(p.id));
    window.addEventListener("follow-ups-updated", refresh);
    window.addEventListener("visit-cancellations-updated", refreshCancellation);
    window.addEventListener("storage", refresh);
    return () => {
      window.removeEventListener("follow-ups-updated", refresh);
      window.removeEventListener("visit-cancellations-updated", refreshCancellation);
      window.removeEventListener("storage", refresh);
    };
  }, [p.id]);

  useEffect(() => { setZone(defaultZone); }, [p.id, defaultZone]);

  const meta = [p.provider && `${p.provider}`, `MRN ${p.id}`, `Age ${p.age} · ${p.sex}`, `Domain ${p.domain}`, p.procedure].filter(Boolean).join(" · ");

  return (
    <PageTemplate>
      <PageHeader
        breadcrumb={
          <Button variant="link" size="sm" className="px-0" onClick={onBack}>
            <ArrowLeft /> {backLabel}
          </Button>
        }
        title={
          <span className="inline-flex flex-wrap items-center gap-12">
            {p.name}
            <SeverityBadge tier={grade.tier} />
          </span>
        }
        subtitle={
          <span className="flex flex-col gap-8">
            <span className="flex items-center gap-8"><Stethoscope className="size-16 shrink-0" aria-hidden /> {meta}</span>
            <span className="flex flex-wrap items-center gap-8">
              {p.conditions.map(c => <Badge key={c} variant="neutral" appearance="soft" size="sm">{c}</Badge>)}
              {cancellation && <Badge variant="danger" appearance="soft" size="sm">Visit cancelled · {cancellation.reason}</Badge>}
              {CAN_CLINICAL_NAVIGATION && <FollowUpChip visits={visits} onOpen={setDetailVisit} />}
            </span>
          </span>
        }
        actions={
          <Button variant="default" size="sm" onClick={() => setScheduleOpen(true)}>
            <CalendarClock /> Schedule follow-up
          </Button>
        }
        tabs={
          <Tabs value={zone} onValueChange={setZone} ariaLabel="Patient sections">
            <Tabs.List>
              <Tabs.Tab value="overview" icon={<Stethoscope />}>Clinical decision support</Tabs.Tab>
              <Tabs.Tab value="cp" icon={<ClipboardList />}>Optimization recommendations</Tabs.Tab>
              <Tabs.Tab value="cc" icon={<MessageSquare />} badge={pending > 0 ? pending : undefined}>Care coordination</Tabs.Tab>
            </Tabs.List>
          </Tabs>
        }
      />

      {zone === "overview" && <OverviewZone p={p} onNavigate={setZone} />}
      {zone === "cp" && renderCarePlan(p)}
      {zone === "cc" && <CareCoordination patient={p} />}

      {scheduleOpen && <ScheduleFollowUpModal patient={p} onClose={() => setScheduleOpen(false)} />}
      {detailVisit && <FollowUpDetailModal visit={detailVisit} onClose={() => setDetailVisit(null)} />}
    </PageTemplate>
  );
}
