import { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { createPortal } from "react-dom";
import { CalendarClock, X } from "lucide-react";
import { Button } from "../Button";
import { DateTimePicker } from "./DateTimePicker";
import { PatientPickerStep } from "./PatientPickerStep";
import { SPECIALTIES, addFollowUp, setFollowUpDecision } from "./followUpStore";

const C = {
  grey: { 100: "#FFFFFF", 200: "#F7F7F7", 300: "#E7E7E7", 400: "#CFD1D1", 500: "#A8ADAD", 600: "#737E7F", 700: "#545D5E", 800: "#273233" },
  primary: { 100: "#ECF4F5", 200: "#CFE4E6", 300: "#9EC9CD", 400: "#56A0A8", 500: "#0D7782", 600: "#0B626B" },
  error: { 100: "#F4DFE4", 400: "#B00A2F" },
  success: { 100: "#D7E7D6", 400: "#388032" },
};
const font = "var(--hc-font-sans)";

const pad = (n) => String(n).padStart(2, "0");

const formatField = (iso) => {
  if (!iso) return "";
  const d = new Date(iso);
  if (isNaN(d)) return "";
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

export const ScheduleFollowUpModal = ({ patient, patients, onClose }) => {
  const isGlobal = !patient;
  const [step, setStep] = useState(1);
  const [needed, setNeeded] = useState("yes");
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [specialties, setSpecialties] = useState([]);
  const [followUpAt, setFollowUpAt] = useState(null);
  const [pickerOpen, setPickerOpen] = useState(false);
  const panelRef = useRef(null);
  const inputRef = useRef(null);
  const pickerPortalRef = useRef(null);
  const bodyRef = useRef(null);
  const pickerOpenRef = useRef(false);
  const [pickerPos, setPickerPos] = useState({ left: 0, top: 0 });
  const previouslyFocused = useRef(null);

  const closeModal = useCallback(() => {
    setStep(1);
    setNeeded("yes");
    setSelectedPatient(null);
    setSpecialties([]);
    setFollowUpAt(null);
    setPickerOpen(false);
    onClose?.();
  }, [onClose]);

  useEffect(() => { pickerOpenRef.current = pickerOpen; }, [pickerOpen]);

  const computePickerPos = useCallback(() => {
    const input = inputRef.current;
    if (!input) return;
    const rect = input.getBoundingClientRect();
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
    previouslyFocused.current = document.activeElement;
    const focusable = panelRef.current?.querySelector("button, input, [tabindex]");
    focusable?.focus();

    const handleKey = (e) => {
      if (e.key === "Escape") {
        if (pickerOpenRef.current) { setPickerOpen(false); return; }
        closeModal();
        return;
      }
      if (e.key === "Tab" && panelRef.current) {
        const nodes = panelRef.current.querySelectorAll('button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])');
        if (nodes.length === 0) return;
        const first = nodes[0];
        const last = nodes[nodes.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", handleKey);
    return () => {
      document.removeEventListener("keydown", handleKey);
      previouslyFocused.current?.focus?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
    setSpecialties((prev) => (prev.includes(sp) ? prev.filter((s) => s !== sp) : [...prev, sp]));
  };

  const effectivePatient = isGlobal ? selectedPatient : patient;

  const handleConfirm = () => {
    if (!effectivePatient) return;
    addFollowUp({
      patientId: effectivePatient.id,
      patientName: effectivePatient.name,
      dob: effectivePatient.dob,
      specialties,
      followUpAt,
      status: "Scheduled",
      referringProvider: effectivePatient.provider || "",
      createdBy: "Tiffany Hall",
      createdAt: new Date().toISOString(),
      source: isGlobal ? "Follow-Up Worklist" : "Patient Optimization Notification",
    });
    setFollowUpDecision(effectivePatient.id, "scheduled");
    closeModal();
  };

  const handleDone = () => {
    if (patient) {
      setFollowUpDecision(patient.id, "not_needed");
    }
    closeModal();
  };

  const canConfirm = specialties.length >= 1 && followUpAt !== null;
  const canContinueGlobal = selectedPatient !== null;

  const subtitle = isGlobal
    ? (step === 1 ? "Select a patient" : `${effectivePatient?.name} · MRN ${effectivePatient?.id}`)
    : `${patient.name} · MRN ${patient.id}`;

  return (
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
      onClick={closeModal}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-label="Schedule Follow-Up"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: "min(560px, 92vw)",
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
            <div style={{ fontSize: 18, fontWeight: 700, color: C.grey[800], fontFamily: font, lineHeight: 1.2 }}>Schedule Follow-Up</div>
            <div style={{ fontSize: 14, color: C.grey[600], fontFamily: font, marginTop: 2 }}>
              {subtitle}
            </div>
          </div>
          <span style={{ fontSize: 13, fontWeight: 600, color: C.grey[500], fontFamily: font, whiteSpace: "nowrap" }}>
            Step {step} of 2
          </span>
          <Button variant="icon" onClick={closeModal} aria-label="Close">
            <X size={16} />
          </Button>
        </div>

        {/* Body */}
        <div ref={bodyRef} style={{ flex: 1, overflowY: "auto", padding: "20px", minHeight: 0 }}>
          {step === 1 && isGlobal && (
            <PatientPickerStep
              patients={patients || []}
              selectedId={selectedPatient?.id}
              onSelect={setSelectedPatient}
            />
          )}

          {step === 1 && !isGlobal && (
            <div>
              <label style={{ fontSize: 16, fontWeight: 700, color: C.grey[800], fontFamily: font, display: "block", marginBottom: 12 }}>
                Non-Surgical Follow Up Appointment Needed?
              </label>
              <div role="radiogroup" aria-label="Non-Surgical Follow Up Appointment Needed?" style={{ display: "flex", gap: 0, border: `0.5px solid ${C.grey[300]}`, borderRadius: 8, overflow: "hidden", width: "fit-content" }}>
                {[
                  { val: "yes", label: "Yes" },
                  { val: "no", label: "No" },
                ].map(({ val, label }, i) => {
                  const active = needed === val;
                  return (
                    <label
                      key={val}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 6,
                        padding: "8px 20px",
                        cursor: "pointer",
                        background: active ? C.primary[500] : C.grey[100],
                        borderLeft: i > 0 ? `0.5px solid ${C.grey[300]}` : "none",
                        transition: "background 0.15s",
                      }}
                    >
                      <input
                        type="radio"
                        name="followup-needed"
                        value={val}
                        checked={active}
                        onChange={() => setNeeded(val)}
                        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                      />
                      <span style={{ fontSize: 15, fontWeight: 600, color: active ? "#fff" : C.grey[700], fontFamily: font }}>{label}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              {/* Specialty checkboxes */}
              <fieldset style={{ border: 0, padding: 0, margin: 0, marginBottom: 18 }}>
                <legend style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font, marginBottom: 8 }}>
                  Referral Specialty <span style={{ color: C.error[400] }}>*</span>
                </legend>
                {SPECIALTIES.map((sp) => {
                  const checked = specialties.includes(sp);
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
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleSpecialty(sp)}
                        style={{ position: "absolute", opacity: 0, pointerEvents: "none" }}
                      />
                      <div
                        style={{
                          width: 18,
                          height: 18,
                          borderRadius: 3,
                          border: `1.5px solid ${checked ? C.primary[500] : C.grey[400]}`,
                          background: checked ? C.primary[500] : "#fff",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          flexShrink: 0,
                        }}
                      >
                        {checked && <span style={{ fontSize: 12, color: "#fff", fontWeight: 700 }}>✓</span>}
                      </div>
                      <span style={{ fontSize: 16, fontWeight: 600, color: C.grey[800], fontFamily: font }}>{sp}</span>
                    </label>
                  );
                })}
              </fieldset>

              {/* Date/time field */}
              <div>
                <label
                  htmlFor="followup-datetime"
                  style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font, marginBottom: 8, display: "block" }}
                >
                  Follow Up Date <span style={{ color: C.error[400] }}>*</span>
                </label>
                <div style={{ position: "relative" }}>
                  <CalendarClock
                    size={15}
                    color={C.grey[500]}
                    style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }}
                  />
                  <input
                    ref={inputRef}
                    id="followup-datetime"
                    type="text"
                    readOnly
                    placeholder="MM/DD/YYYY, HH:MM:SS"
                    value={formatField(followUpAt)}
                    onClick={() => {
                      if (!pickerOpen && inputRef.current) {
                        const rect = inputRef.current.getBoundingClientRect();
                        setPickerPos({ left: rect.left, top: rect.bottom + 4 });
                      }
                      setPickerOpen((o) => !o);
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        if (!pickerOpen && inputRef.current) {
                          const rect = inputRef.current.getBoundingClientRect();
                          setPickerPos({ left: rect.left, top: rect.bottom + 4 });
                        }
                        setPickerOpen((o) => !o);
                      }
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
                      value={followUpAt}
                      onChange={(iso) => setFollowUpAt(iso)}
                      onClose={() => setPickerOpen(false)}
                    />
                  </div>,
                  document.body
                )}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: 16, borderTop: `0.5px solid ${C.grey[300]}`, marginTop: 20, gap: 8 }}>
            {step === 1 ? (
              isGlobal ? (
                <>
                  <Button variant="secondary" size="md" onClick={closeModal}>Cancel</Button>
                  <Button variant="primary" size="md" onClick={() => setStep(2)} disabled={!canContinueGlobal}>
                    Continue
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="secondary" size="md" onClick={closeModal}>Cancel</Button>
                  <Button variant="primary" size="md" onClick={() => (needed === "yes" ? setStep(2) : handleDone())}>
                    {needed === "yes" ? "Continue" : "Done"}
                  </Button>
                </>
              )
            ) : (
              <>
                <Button variant="secondary" size="md" onClick={() => setStep(1)}>Back</Button>
                <Button variant="primary" size="md" onClick={handleConfirm} disabled={!canConfirm}>
                  Confirm
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
