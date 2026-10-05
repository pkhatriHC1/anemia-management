import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { X, CalendarClock, Check, AlertTriangle, LogOut } from "lucide-react";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { DateTimePicker } from "./DateTimePicker";
import { ScheduleFollowUpModal } from "./ScheduleFollowUpModal";
import { SPECIALTIES, updateFollowUp, historyEntry, getFollowUps } from "./followUpStore";

const C = {
  grey: { 100: "#FFFFFF", 200: "#F7F7F7", 300: "#E7E7E7", 400: "#CFD1D1", 500: "#A8ADAD", 600: "#737E7F", 700: "#545D5E", 800: "#273233" },
  primary: { 100: "#ECF4F5", 200: "#CFE4E6", 300: "#9EC9CD", 400: "#56A0A8", 500: "#0D7782", 600: "#0B626B" },
  secondary: { 400: "#75CAD3", 600: "#1D828C" },
  error: { 100: "#F4DFE4", 400: "#B00A2F" },
  success: { 100: "#D7E7D6", 400: "#388032" },
  orange: { 100: "#FFEFE0", 400: "#F58126" },
};
const font = "var(--hc-font-sans)";

const pad = (n) => String(n).padStart(2, "0");

const formatDateTime = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

const formatDateTimeSec = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const STATUS_VARIANT = {
  Scheduled: "info",
  Completed: "success",
  Cancelled: "neutral",
};

const ACTION_LABELS = {
  created: "Visit created",
  rescheduled: "Rescheduled",
  specialty_changed: "Specialty changed",
  completed: "Marked completed",
  cancelled: "Visit cancelled",
};

const CANCEL_REASONS = [
  "Patient declined",
  "Patient unreachable",
  "Seen elsewhere",
  "Scheduled in error",
  "Clinical status changed",
  "Other",
];

const isOverdue = (v) => {
  if (v.status !== "Scheduled") return false;
  return new Date(v.followUpAt).getTime() < Date.now();
};

const FIELD_LABEL = {
  fontSize: 11,
  fontWeight: 700,
  textTransform: "uppercase",
  letterSpacing: "0.06em",
  color: C.grey[500],
  fontFamily: font,
  marginBottom: 3,
};

const FIELD_VALUE = {
  fontSize: 15,
  color: C.grey[800],
  fontFamily: font,
};

const SectionLabel = ({ children }) => (
  <div style={{ fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", color: C.grey[600], fontFamily: font, marginBottom: 10 }}>
    {children}
  </div>
);

export const FollowUpDetailModal = ({ visit, onClose, initialMode = "view" }) => {
  const [mode, setMode] = useState(initialMode);
  const [scheduleOpen, setScheduleOpen] = useState(false);
  const [localVisit, setLocalVisit] = useState(visit);

  // Edit form state
  const [editSpecialties, setEditSpecialties] = useState([]);
  const [editFollowUpAt, setEditFollowUpAt] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [pickerPos, setPickerPos] = useState({ left: 0, top: 0 });
  const inputRef = useRef(null);
  const pickerPortalRef = useRef(null);
  const bodyRef = useRef(null);
  const panelRef = useRef(null);

  // Cancel form state
  const [cancelReason, setCancelReason] = useState("");
  const [cancelOtherText, setCancelOtherText] = useState("");

  useEffect(() => {
    setLocalVisit(visit);
    setMode(initialMode);
  }, [visit, initialMode]);

  useEffect(() => {
    if (mode === "edit") {
      setEditSpecialties(visit.specialties || []);
      setEditFollowUpAt(visit.followUpAt);
    }
  }, [mode, visit]);

  useEffect(() => {
    if (mode === "edit" && initialMode === "reschedule") {
      // Auto-open the date picker for reschedule
      setTimeout(() => {
        if (inputRef.current) {
          const rect = inputRef.current.getBoundingClientRect();
          setPickerPos({ left: rect.left, top: rect.bottom + 4 });
          setPickerOpen(true);
        }
      }, 50);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, initialMode]);

  const refreshVisit = useCallback(() => {
    const found = getFollowUps().find((v) => v.id === visit.id);
    if (found) setLocalVisit(found);
  }, [visit.id]);

  useEffect(() => {
    const handler = () => refreshVisit();
    window.addEventListener("follow-ups-updated", handler);
    return () => window.removeEventListener("follow-ups-updated", handler);
  }, [refreshVisit]);

  useEffect(() => {
    if (mode === "cancel") {
      setCancelReason("");
      setCancelOtherText("");
    }
  }, [mode]);

  // Auto-open date picker when entering edit via reschedule
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (pickerOpen) { setPickerOpen(false); return; }
        onClose?.();
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose, pickerOpen]);

  // Picker positioning
  const computePickerPos = useCallback(() => {
    const inputEl = inputRef.current;
    if (!inputEl) return;
    const rect = inputEl.getBoundingClientRect();
    const portal = pickerPortalRef.current;
    const pickerH = portal ? portal.offsetHeight : 320;
    const spaceBelow = window.innerHeight - rect.bottom - 4;
    const openBelow = spaceBelow >= pickerH;
    setPickerPos({
      left: rect.left,
      top: openBelow ? rect.bottom + 4 : Math.max(8, rect.top - 4 - pickerH),
    });
  }, []);

  useEffect(() => {
    if (!pickerOpen) return;
    computePickerPos();
    const onReposition = () => computePickerPos();
    window.addEventListener("resize", onReposition);
    const body = bodyRef.current;
    if (body) body.addEventListener("scroll", onReposition);
    const onDown = (e) => {
      if (pickerPortalRef.current && pickerPortalRef.current.contains(e.target)) return;
      if (inputRef.current && inputRef.current.contains(e.target)) return;
      setPickerOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => {
      window.removeEventListener("resize", onReposition);
      if (body) body.removeEventListener("scroll", onReposition);
      document.removeEventListener("mousedown", onDown);
    };
  }, [pickerOpen, computePickerPos]);

  useLayoutEffect(() => {
    if (pickerOpen && pickerPortalRef.current) computePickerPos();
  }, [pickerOpen, computePickerPos]);

  const toggleSpecialty = (sp) => {
    setEditSpecialties((prev) => (prev.includes(sp) ? prev.filter((s) => s !== sp) : [...prev, sp]));
  };

  const dateChanged = editFollowUpAt !== localVisit.followUpAt;
  const specialtyChanged =
    editSpecialties.length !== (localVisit.specialties || []).length ||
    editSpecialties.some((s) => !(localVisit.specialties || []).includes(s)) ||
    (localVisit.specialties || []).some((s) => !editSpecialties.includes(s));
  const canSave = (dateChanged || specialtyChanged) && editSpecialties.length >= 1;

  const handleSaveEdit = () => {
    const entries = [];
    if (dateChanged) {
      entries.push(historyEntry("rescheduled", "Tiffany Hall", { from: localVisit.followUpAt, to: editFollowUpAt }));
    }
    if (specialtyChanged) {
      entries.push(historyEntry("specialty_changed", "Tiffany Hall", { from: localVisit.specialties || [], to: editSpecialties }));
    }
    if (entries.length === 0) return;
    updateFollowUp(localVisit.id, { followUpAt: editFollowUpAt, specialties: editSpecialties }, entries);
    setMode("view");
  };

  const handleConfirmComplete = () => {
    updateFollowUp(localVisit.id, { status: "Completed" }, [historyEntry("completed", "Tiffany Hall")]);
    setMode("view");
  };

  const handleConfirmCancel = () => {
    const reason = cancelReason === "Other" ? cancelOtherText.trim() : cancelReason;
    if (!reason) return;
    updateFollowUp(
      localVisit.id,
      { status: "Cancelled", cancelReason: reason },
      [historyEntry("cancelled", "Tiffany Hall", { reason })]
    );
    setMode("view");
  };

  const cancelReasonValid = cancelReason && (cancelReason !== "Other" || cancelOtherText.trim().length > 0);

  const v = localVisit;
  const overdue = isOverdue(v);
  const isFinished = v.status === "Completed" || v.status === "Cancelled";

  // Activity history, newest first
  const history = [...(v.history || [])].reverse();

  const fieldCol = (label, children) => (
    <div style={{ minWidth: 0 }}>
      <div style={FIELD_LABEL}>{label}</div>
      <div style={FIELD_VALUE}>{children}</div>
    </div>
  );

  const renderViewBody = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Fields — two columns */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px 24px" }}>
        {fieldCol("Patient", (
          <div>
            <div style={{ fontWeight: 600 }}>{v.patientName}</div>
            <div style={{ fontSize: 13, color: C.grey[600], marginTop: 1 }}>MRN {v.patientId} · DOB {v.dob}</div>
          </div>
        ))}
        {fieldCol("Specialty", (
          <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
            {(v.specialties || []).map((s) => (
              <Badge key={s} variant="info" appearance="soft" size="sm">{s}</Badge>
            ))}
          </div>
        ))}
        {fieldCol("Follow-Up Date/Time", (
          <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
            <span className="tabular-nums-hc1">{formatDateTime(v.followUpAt)}</span>
            {overdue && <Badge variant="danger" appearance="soft" size="sm">Overdue</Badge>}
          </div>
        ))}
        {fieldCol("Referring Provider", v.referringProvider || "—")}
        {fieldCol("Source", v.source || "—")}
        {fieldCol("Scheduled By / On", (
          <span className="tabular-nums-hc1">{v.createdBy} · {formatDateTime(v.createdAt)}</span>
        ))}
        {v.status === "Cancelled" && v.cancelReason && fieldCol("Cancellation Reason", v.cancelReason)}
      </div>

      {/* Activity */}
      <div>
        <SectionLabel>Activity</SectionLabel>
        <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
          {history.length === 0 && (
            <div style={{ fontSize: 14, color: C.grey[500], fontFamily: font }}>No activity recorded.</div>
          )}
          {history.map((h, i) => (
            <div key={h.id || i} style={{ display: "flex", gap: 12, padding: "10px 0", borderTop: i > 0 ? `0.5px solid ${C.grey[300]}` : "none" }}>
              <div style={{ width: 28, height: 28, borderRadius: "50%", background: C.primary[100], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <ActivityIcon action={h.action} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 14, fontWeight: 600, color: C.grey[800], fontFamily: font }}>
                  {ACTION_LABELS[h.action] || h.action} · <span style={{ fontWeight: 400, color: C.grey[600] }}>{h.by}</span> · <span className="tabular-nums-hc1" style={{ fontWeight: 400, color: C.grey[600] }}>{formatDateTime(h.at)}</span>
                </div>
                {h.action === "rescheduled" && h.details && (
                  <div style={{ fontSize: 13, color: C.grey[600], fontFamily: font, marginTop: 2 }}>
                    {formatDateTime(h.details.from)} → {formatDateTime(h.details.to)}
                  </div>
                )}
                {h.action === "specialty_changed" && h.details && (
                  <div style={{ fontSize: 13, color: C.grey[600], fontFamily: font, marginTop: 2 }}>
                    {(h.details.from || []).join(", ") || "—"} → {(h.details.to || []).join(", ") || "—"}
                  </div>
                )}
                {h.action === "cancelled" && h.details && (
                  <div style={{ fontSize: 13, color: C.grey[600], fontFamily: font, marginTop: 2 }}>
                    Reason: {h.details.reason}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderEditBody = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
      {/* Specialty checkboxes */}
      <fieldset style={{ border: 0, padding: 0, margin: 0 }}>
        <legend style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font, marginBottom: 8 }}>
          Referral Specialty <span style={{ color: C.error[400] }}>*</span>
        </legend>
        {SPECIALTIES.map((sp) => {
          const checked = editSpecialties.includes(sp);
          return (
            <label
              key={sp}
              onClick={() => toggleSpecialty(sp)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "10px 12px",
                background: checked ? C.primary[100] : C.grey[200],
                border: `0.5px solid ${checked ? C.primary[500] + "33" : C.grey[300]}`,
                borderRadius: 8,
                marginBottom: 6,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <input type="checkbox" checked={checked} onChange={() => toggleSpecialty(sp)} style={{ position: "absolute", opacity: 0, pointerEvents: "none" }} />
              <div style={{ width: 18, height: 18, borderRadius: 3, border: `1.5px solid ${checked ? C.primary[500] : C.grey[400]}`, background: checked ? C.primary[500] : "#fff", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                {checked && <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>✓</span>}
              </div>
              <span style={{ fontSize: 16, fontWeight: 600, color: C.grey[800], fontFamily: font }}>{sp}</span>
            </label>
          );
        })}
      </fieldset>

      {/* Date/time field */}
      <div>
        <label htmlFor="edit-datetime" style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font, marginBottom: 8, display: "block" }}>
          Follow Up Date <span style={{ color: C.error[400] }}>*</span>
        </label>
        <div style={{ position: "relative" }}>
          <CalendarClock size={15} color={C.grey[500]} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
          <input
            ref={inputRef}
            id="edit-datetime"
            type="text"
            readOnly
            placeholder="MM/DD/YYYY, HH:MM"
            value={formatDateTime(editFollowUpAt)}
            onClick={() => {
              if (!pickerOpen && inputRef.current) {
                const rect = inputRef.current.getBoundingClientRect();
                setPickerPos({ left: rect.left, top: rect.bottom + 4 });
              }
              setPickerOpen((o) => !o);
            }}
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px 10px 8px 32px",
              border: `0.5px solid ${pickerOpen ? C.primary[500] : C.grey[300]}`,
              borderRadius: 8,
              fontSize: 14,
              color: C.grey[800],
              background: C.grey[100],
              outline: "none",
              boxShadow: pickerOpen ? `0 0 0 2px ${C.primary[100]}` : "none",
              fontFamily: font,
              cursor: "pointer",
            }}
          />
        </div>
        {pickerOpen && createPortal(
          <div ref={pickerPortalRef} style={{ position: "fixed", left: pickerPos.left, top: pickerPos.top, zIndex: 310 }}>
            <DateTimePicker
              value={editFollowUpAt}
              onChange={(iso) => setEditFollowUpAt(iso)}
              onClose={() => setPickerOpen(false)}
            />
          </div>,
          document.body
        )}
      </div>
    </div>
  );

  const renderCompleteBody = () => (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "12px 0", gap: 16 }}>
      <div style={{ width: 48, height: 48, borderRadius: "50%", background: C.success[100], display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Check size={22} color={C.success[400]} />
      </div>
      <div style={{ fontSize: 18, fontWeight: 700, color: C.grey[800], fontFamily: font }}>Mark this visit as completed?</div>
      <div style={{ fontSize: 14, color: C.grey[600], fontFamily: font, maxWidth: 380 }}>
        This will update the visit status to Completed and record the action in the activity trail.
      </div>
    </div>
  );

  const renderCancelBody = () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 10, padding: "12px 14px", background: C.error[100], borderRadius: 8, border: `0.5px solid ${C.error[400]}33` }}>
        <AlertTriangle size={18} color={C.error[400]} />
        <div style={{ fontSize: 15, fontWeight: 600, color: C.error[400], fontFamily: font }}>Cancel this follow-up visit?</div>
      </div>

      <div>
        <label style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font, marginBottom: 8, display: "block" }}>
          Cancellation reason <span style={{ color: C.error[400] }}>*</span>
        </label>
        <select
          value={cancelReason}
          onChange={(e) => setCancelReason(e.target.value)}
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 10px",
            border: `0.5px solid ${C.grey[300]}`,
            borderRadius: 8,
            fontSize: 15,
            color: C.grey[800],
            background: C.grey[100],
            outline: "none",
            fontFamily: font,
            appearance: "none",
            cursor: "pointer",
          }}
        >
          <option value="">Select a reason…</option>
          {CANCEL_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
        </select>
      </div>

      {cancelReason === "Other" && (
        <div>
          <label style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font, marginBottom: 8, display: "block" }}>
            Describe reason <span style={{ color: C.error[400] }}>*</span>
          </label>
          <textarea
            value={cancelOtherText}
            onChange={(e) => setCancelOtherText(e.target.value)}
            rows={3}
            placeholder="Enter the cancellation reason…"
            style={{
              width: "100%",
              boxSizing: "border-box",
              padding: "8px 10px",
              border: `0.5px solid ${C.grey[300]}`,
              borderRadius: 8,
              fontSize: 15,
              color: C.grey[800],
              background: C.grey[100],
              outline: "none",
              fontFamily: font,
              resize: "none",
            }}
          />
        </div>
      )}
    </div>
  );

  const renderFooter = () => {
    if (mode === "edit") {
      return (
        <Footer>
          <Button variant="secondary" size="md" onClick={() => setMode("view")}>Discard</Button>
          <Button variant="primary" size="md" onClick={handleSaveEdit} disabled={!canSave}>Save Changes</Button>
        </Footer>
      );
    }
    if (mode === "complete") {
      return (
        <Footer>
          <Button variant="secondary" size="md" onClick={() => setMode("view")}>Back</Button>
          <Button variant="primary" size="md" onClick={handleConfirmComplete}>Confirm</Button>
        </Footer>
      );
    }
    if (mode === "cancel") {
      return (
        <Footer>
          <Button variant="secondary" size="md" onClick={() => setMode("view")}>Keep Visit</Button>
          <Button variant="danger" size="md" onClick={handleConfirmCancel} disabled={!cancelReasonValid}>Cancel Visit</Button>
        </Footer>
      );
    }
    // view mode
    if (isFinished) {
      return (
        <Footer>
          <Button variant="secondary" size="md" onClick={onClose}>Close</Button>
          <Button variant="primary" size="md" onClick={() => setScheduleOpen(true)}>Schedule New Follow-Up</Button>
        </Footer>
      );
    }
    // Scheduled
    return (
      <Footer>
        <Button variant="danger" size="md" onClick={() => setMode("cancel")}>Cancel Visit</Button>
        <div style={{ flex: 1 }} />
        <Button variant="secondary" size="md" onClick={() => setMode("edit")}>Edit</Button>
        <Button variant="primary" size="md" onClick={() => setMode("complete")}>Mark Completed</Button>
      </Footer>
    );
  };

  const headerSubtitle = mode === "edit"
    ? "Edit Visit"
    : mode === "cancel"
    ? "Cancel Visit"
    : mode === "complete"
    ? "Complete Visit"
    : `${v.patientName} · MRN ${v.patientId}`;

  return (
    <>
      <div
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 300,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.5)",
          backdropFilter: "blur(4px)",
        }}
        onClick={onClose}
      >
        <div
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Follow-Up Visit"
          onClick={(e) => e.stopPropagation()}
          style={{
            width: "min(620px, 92vw)",
            maxHeight: "85vh",
            background: C.grey[100],
            borderRadius: 16,
            display: "flex",
            flexDirection: "column",
            boxShadow: "0 24px 80px rgba(0,0,0,0.25)",
            overflow: "hidden",
          }}
        >
          {/* Header */}
          <div style={{ padding: "16px 20px", borderBottom: `1px solid ${C.grey[300]}`, display: "flex", alignItems: "center", gap: 12, flexShrink: 0 }}>
            <div style={{ width: 40, height: 40, borderRadius: 10, background: C.primary[100], display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <CalendarClock size={20} color={C.primary[500]} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ fontSize: 18, fontWeight: 700, color: C.grey[800], fontFamily: font, lineHeight: 1.2 }}>Follow-Up Visit</div>
                <Badge variant={STATUS_VARIANT[v.status] || "neutral"} appearance="soft" size="sm">{v.status}</Badge>
              </div>
              <div style={{ fontSize: 14, color: C.grey[600], fontFamily: font, marginTop: 2, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {headerSubtitle}
              </div>
            </div>
            <Button variant="icon" onClick={onClose} aria-label="Close">
              <X size={16} />
            </Button>
          </div>

          {/* Body */}
          <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: "20px", minHeight: 0 }}>
            {mode === "view" && renderViewBody()}
            {mode === "edit" && renderEditBody()}
            {mode === "complete" && renderCompleteBody()}
            {mode === "cancel" && renderCancelBody()}
          </div>

          {/* Footer */}
          {renderFooter()}
        </div>
      </div>

      {scheduleOpen && (
        <ScheduleFollowUpModal
          directPatient={{
            id: v.patientId,
            name: v.patientName,
            dob: v.dob,
            provider: v.referringProvider,
          }}
          directMode
          onClose={() => setScheduleOpen(false)}
        />
      )}
    </>
  );
};

const Footer = ({ children }) => (
  <div style={{ padding: "14px 20px", borderTop: `0.5px solid ${C.grey[300]}`, display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
    {children}
  </div>
);

const ActivityIcon = ({ action }) => {
  const map = {
    created: { Icon: CalendarClock, color: C.primary[500] },
    rescheduled: { Icon: CalendarClock, color: C.secondary[600] },
    specialty_changed: { Icon: Check, color: C.primary[500] },
    completed: { Icon: Check, color: C.success[400] },
    cancelled: { Icon: AlertTriangle, color: C.error[400] },
  };
  const { Icon, color } = map[action] || map.created;
  return <Icon size={14} color={color} />;
};

export default FollowUpDetailModal;
