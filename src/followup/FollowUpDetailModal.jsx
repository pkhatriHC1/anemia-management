import { useCallback, useEffect, useState } from "react";
import { CalendarClock, Check, TriangleAlert, User } from "lucide-react";
import { Alert, Badge, Button, Dialog, Select, Separator, Textarea } from "@hc1com/design-system";
import { historyEntry, updateFollowUp, getFollowUps } from "./followUpStore";
import { MBH_CANCELLATION_REASONS } from "./visitCancellationStore";
import { FollowUpFields } from "./FollowUpFields";
import { ScheduleFollowUpModal } from "./ScheduleFollowUpModal";
import { STATUS_VARIANT, SPECIALTY_VARIANT, formatDateTime, isOverdue } from "./FollowUpWorklist";

const ACTION_LABELS = {
  created: "Visit created",
  rescheduled: "Rescheduled",
  specialty_changed: "Specialty changed",
  completed: "Marked completed",
  cancelled: "Visit cancelled",
};
const ACTION_ICON = {
  created: { Icon: CalendarClock, tone: "text-[color:var(--hc-color-action-primary)]" },
  rescheduled: { Icon: CalendarClock, tone: "text-[color:var(--hc-color-action-primary)]" },
  specialty_changed: { Icon: Check, tone: "text-[color:var(--hc-color-action-primary)]" },
  completed: { Icon: Check, tone: "text-[color:var(--hc-color-status-success-fg)]" },
  cancelled: { Icon: TriangleAlert, tone: "text-[color:var(--hc-color-status-error-fg)]" },
};
const REASON_OPTIONS = [...MBH_CANCELLATION_REASONS, "Other"].map(r => ({ value: r, label: r }));
const TITLES = { view: "Follow-up visit", edit: "Edit follow-up", complete: "Complete follow-up", cancel: "Cancel follow-up" };

const sameSet = (a = [], b = []) => a.length === b.length && a.every(x => b.includes(x));

function Field({ label, children }) {
  return (
    <div className="flex min-w-0 flex-col gap-4">
      <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">{label}</span>
      <div className="text-14 text-[color:var(--hc-color-text-primary)]">{children}</div>
    </div>
  );
}

/** One follow-up visit: details and activity, with edit, complete and cancel flows. */
export function FollowUpDetailModal({ visit, onClose, initialMode = "view", onOpenPatient }) {
  const [mode, setMode] = useState(initialMode === "reschedule" ? "edit" : initialMode);
  const [v, setV] = useState(visit);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [editSpecialties, setEditSpecialties] = useState(visit.specialties || []);
  const [editFollowUpAt, setEditFollowUpAt] = useState(visit.followUpAt);
  const [cancelReason, setCancelReason] = useState(undefined);
  const [cancelOtherText, setCancelOtherText] = useState("");

  const refresh = useCallback(() => {
    const found = getFollowUps().find(x => x.id === visit.id);
    if (found) setV(found);
  }, [visit.id]);
  useEffect(() => {
    window.addEventListener("follow-ups-updated", refresh);
    return () => window.removeEventListener("follow-ups-updated", refresh);
  }, [refresh]);

  const go = next => {
    if (next === "edit") { setEditSpecialties(v.specialties || []); setEditFollowUpAt(v.followUpAt); }
    if (next === "cancel") { setCancelReason(undefined); setCancelOtherText(""); }
    setMode(next);
  };

  const dateChanged = editFollowUpAt !== v.followUpAt;
  const specialtyChanged = !sameSet(editSpecialties, v.specialties || []);
  const canSave = (dateChanged || specialtyChanged) && editSpecialties.length >= 1 && !!editFollowUpAt;
  const saveEdit = () => {
    const entries = [];
    if (dateChanged) entries.push(historyEntry("rescheduled", "Tiffany Hall", { from: v.followUpAt, to: editFollowUpAt }));
    if (specialtyChanged) entries.push(historyEntry("specialty_changed", "Tiffany Hall", { from: v.specialties || [], to: editSpecialties }));
    if (entries.length === 0) return;
    updateFollowUp(v.id, { followUpAt: editFollowUpAt, specialties: editSpecialties }, entries);
    setMode("view");
  };
  const confirmComplete = () => {
    updateFollowUp(v.id, { status: "Completed" }, [historyEntry("completed", "Tiffany Hall")]);
    setMode("view");
  };
  const reasonValid = !!cancelReason && (cancelReason !== "Other" || cancelOtherText.trim().length > 0);
  const confirmCancel = () => {
    const reason = cancelReason === "Other" ? cancelOtherText.trim() : cancelReason;
    if (!reason) return;
    updateFollowUp(v.id, { status: "Cancelled", cancelReason: reason }, [historyEntry("cancelled", "Tiffany Hall", { reason })]);
    setMode("view");
  };

  const overdue = isOverdue(v);
  const history = [...(v.history || [])].reverse();

  const body = {
    view: (
      <>
        <div className="grid grid-cols-1 gap-x-24 gap-y-16 sm:grid-cols-2">
          <Field label="Patient">
            <div className="flex flex-col gap-4">
              <span className="font-medium">{v.patientName}</span>
              <span className="text-12 tabular-nums text-[color:var(--hc-color-text-supporting)]">MRN {v.patientId} · DOB {v.dob}</span>
            </div>
          </Field>
          <Field label="Specialty">
            <div className="flex flex-wrap gap-4">
              {(v.specialties || []).map(s => <Badge key={s} variant={SPECIALTY_VARIANT[s] || "neutral"} appearance="soft" size="sm">{s}</Badge>)}
            </div>
          </Field>
          <Field label="Follow-up date and time">
            <div className="flex flex-wrap items-center gap-8">
              <span className="tabular-nums">{formatDateTime(v.followUpAt)}</span>
              {overdue && <Badge variant="danger" appearance="soft" size="sm">Overdue</Badge>}
            </div>
          </Field>
          <Field label="Referring provider">{v.referringProvider || "—"}</Field>
          <Field label="Source">{v.source || "—"}</Field>
          <Field label="Scheduled by">
            <span className="tabular-nums">{v.createdBy} · {formatDateTime(v.createdAt)}</span>
          </Field>
          {v.status === "Cancelled" && v.cancelReason && <Field label="Cancellation reason">{v.cancelReason}</Field>}
        </div>
        <Separator />
        <div className="flex flex-col gap-12">
          <h3 className="text-14 font-semibold text-[color:var(--hc-color-text-primary)]">Activity</h3>
          {history.length === 0 ? (
            <p className="text-14 text-[color:var(--hc-color-text-supporting)]">No activity recorded.</p>
          ) : (
            <ol className="flex flex-col divide-y divide-[color:var(--hc-color-border-subtle)]">
              {history.map((h, i) => {
                const { Icon, tone } = ACTION_ICON[h.action] || ACTION_ICON.created;
                return (
                  <li key={h.id || i} className="flex gap-12 py-12 first:pt-0 last:pb-0">
                    <Icon className={`mt-4 size-16 shrink-0 ${tone}`} aria-hidden />
                    <div className="flex min-w-0 flex-col gap-4">
                      <span className="text-14 text-[color:var(--hc-color-text-primary)]">
                        <span className="font-medium">{ACTION_LABELS[h.action] || h.action}</span>
                        <span className="text-[color:var(--hc-color-text-supporting)]"> · {h.by} · <span className="tabular-nums">{formatDateTime(h.at)}</span></span>
                      </span>
                      {h.action === "rescheduled" && h.details && (
                        <span className="text-12 tabular-nums text-[color:var(--hc-color-text-supporting)]">{formatDateTime(h.details.from)} → {formatDateTime(h.details.to)}</span>
                      )}
                      {h.action === "specialty_changed" && h.details && (
                        <span className="text-12 text-[color:var(--hc-color-text-supporting)]">{(h.details.from || []).join(", ") || "—"} → {(h.details.to || []).join(", ") || "—"}</span>
                      )}
                      {h.action === "cancelled" && h.details && (
                        <span className="text-12 text-[color:var(--hc-color-text-supporting)]">Reason: {h.details.reason}</span>
                      )}
                    </div>
                  </li>
                );
              })}
            </ol>
          )}
        </div>
      </>
    ),
    edit: (
      <FollowUpFields
        specialties={editSpecialties}
        onSpecialtiesChange={setEditSpecialties}
        followUpAt={editFollowUpAt}
        onFollowUpAtChange={setEditFollowUpAt}
      />
    ),
    complete: (
      <Alert variant="success">
        <Alert.Title>Mark this visit as completed?</Alert.Title>
        <Alert.Description>The visit status changes to Completed and the action is recorded in the activity trail.</Alert.Description>
      </Alert>
    ),
    cancel: (
      <>
        <Alert variant="danger">
          <Alert.Title>Cancel this follow-up visit?</Alert.Title>
          <Alert.Description>The visit leaves the scheduled list. The reason is kept in its activity trail.</Alert.Description>
        </Alert>
        <Select
          label="Cancellation reason"
          required
          placeholder="Select a reason"
          options={REASON_OPTIONS}
          value={cancelReason}
          onChange={setCancelReason}
          fullWidth
        />
        {cancelReason === "Other" && (
          <Textarea
            label="Describe the reason"
            required
            rows={3}
            placeholder="Enter the cancellation reason"
            value={cancelOtherText}
            onChange={e => setCancelOtherText(e.target.value)}
          />
        )}
      </>
    ),
  }[mode];

  const footer = {
    edit: (
      <>
        <Button variant="outline" size="sm" onClick={() => setMode("view")}>Discard</Button>
        <Button variant="default" size="sm" onClick={saveEdit} disabled={!canSave}>Save changes</Button>
      </>
    ),
    complete: (
      <>
        <Button variant="outline" size="sm" onClick={() => setMode("view")}>Back</Button>
        <Button variant="default" size="sm" onClick={confirmComplete}>Mark completed</Button>
      </>
    ),
    cancel: (
      <>
        <Button variant="outline" size="sm" onClick={() => setMode("view")}>Keep visit</Button>
        <Button variant="destructive" size="sm" onClick={confirmCancel} disabled={!reasonValid}>Cancel visit</Button>
      </>
    ),
    view: v.status === "Scheduled" ? (
      <>
        <Button variant="destructive" size="sm" className="mr-auto" onClick={() => go("cancel")}>Cancel visit</Button>
        <Button variant="outline" size="sm" onClick={() => go("edit")}>Edit</Button>
        <Button variant="default" size="sm" onClick={() => go("complete")}>Mark completed</Button>
      </>
    ) : v.status === "Completed" ? (
      <>
        <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
        <Button variant="default" size="sm" onClick={() => setScheduleOpen(true)}>Schedule new follow-up</Button>
      </>
    ) : (
      <Button variant="outline" size="sm" onClick={onClose}>Close</Button>
    ),
  }[mode];

  return (
    <>
      <Dialog open={!scheduleOpen} onOpenChange={o => { if (!o) onClose?.(); }}>
        <Dialog.Content size="md">
          <Dialog.Header>
            <Dialog.Title>
              <span className="inline-flex flex-wrap items-center gap-8">
                {TITLES[mode]}
                <Badge variant={STATUS_VARIANT[v.status] || "neutral"} appearance="soft" size="sm">{v.status}</Badge>
              </span>
            </Dialog.Title>
            <Dialog.Description>{v.patientName} · MRN {v.patientId}</Dialog.Description>
          </Dialog.Header>
          <Dialog.Body className="flex flex-col gap-24 [&>*]:shrink-0">
            {onOpenPatient && mode === "view" && (
              <Button variant="outline" size="xs" className="self-start" onClick={() => { onClose?.(); onOpenPatient(v.patientId); }}>
                <User /> Open patient record
              </Button>
            )}
            {body}
          </Dialog.Body>
          <Dialog.Footer><Dialog.Actions className="w-full">{footer}</Dialog.Actions></Dialog.Footer>
        </Dialog.Content>
      </Dialog>
      {scheduleOpen && (
        <ScheduleFollowUpModal
          directMode
          directPatient={{ id: v.patientId, name: v.patientName, dob: v.dob, provider: v.referringProvider }}
          onClose={() => { setScheduleOpen(false); onClose?.(); }}
        />
      )}
    </>
  );
}
