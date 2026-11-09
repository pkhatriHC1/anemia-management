import { useEffect, useState } from "react";
import { AlertTriangle, X } from "lucide-react";
import { Button } from "../Button";
import { MBH_CANCELLATION_REASONS } from "./visitCancellationStore";

const C = {
  grey: { 100: "#FFFFFF", 200: "#F7F7F7", 300: "#E7E7E7", 500: "#A8ADAD", 600: "#737E7F", 700: "#545D5E", 800: "#273233" },
  error: { 100: "#F4DFE4", 400: "#B00A2F" },
  orange: { 100: "#FFEFE0", 400: "#F58126" },
};
const font = "var(--hc-font-sans)";

const formatDate = (value) => {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value || "—";
  return `${String(date.getMonth() + 1).padStart(2, "0")}/${String(date.getDate()).padStart(2, "0")}/${date.getFullYear()}`;
};

export const VisitCancellationModal = ({ patient, onClose, onConfirm }) => {
  const [reason, setReason] = useState("");

  useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [onClose]);

  return (
    <div
      role="presentation"
      onClick={onClose}
      style={{ position: "fixed", inset: 0, zIndex: 500, display: "flex", alignItems: "center", justifyContent: "center", padding: 20, background: "rgba(0,0,0,0.5)" }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="cancel-visit-title"
        onClick={(event) => event.stopPropagation()}
        style={{ width: "min(560px, 100%)", maxHeight: "85vh", display: "flex", flexDirection: "column", background: C.grey[100], borderRadius: 12, boxShadow: "0 24px 80px rgba(0,0,0,0.25)", overflow: "hidden" }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, padding: "16px 20px", borderBottom: `1px solid ${C.grey[300]}` }}>
          <div style={{ width: 38, height: 38, borderRadius: 9, display: "grid", placeItems: "center", background: C.error[100], flexShrink: 0 }}><AlertTriangle size={19} color={C.error[400]} /></div>
          <div style={{ flex: 1 }}>
            <div id="cancel-visit-title" style={{ fontSize: 18, fontWeight: 700, color: C.grey[800], fontFamily: font }}>Cancel Visit</div>
            <div style={{ marginTop: 4, fontSize: 14, color: C.grey[600], fontFamily: font }}>Choose a reason to remove this visit from the active worklist.</div>
          </div>
          <button type="button" onClick={onClose} aria-label="Close" style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: 0, borderRadius: 6, background: "transparent", color: C.grey[500], cursor: "pointer" }}><X size={18} /></button>
        </div>

        <div style={{ padding: 20, overflowY: "auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 12, padding: "12px 14px", marginBottom: 18, background: C.grey[200], borderRadius: 8 }}>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: C.grey[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: font }}>Patient</div><div style={{ marginTop: 3, fontSize: 14, fontWeight: 600, color: C.grey[800], fontFamily: font }}>{patient.name}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: C.grey[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: font }}>MRN</div><div style={{ marginTop: 3, fontSize: 14, color: C.grey[800], fontFamily: font }}>{patient.id}</div></div>
            <div><div style={{ fontSize: 11, fontWeight: 700, color: C.grey[500], textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: font }}>Visit date</div><div style={{ marginTop: 3, fontSize: 14, color: C.grey[800], fontFamily: font }}>{formatDate(patient.admitDate)}</div></div>
          </div>

          <fieldset style={{ margin: 0, padding: 0, border: 0 }}>
            <legend style={{ marginBottom: 10, fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font }}>Cancellation reason <span style={{ color: C.error[400] }}>*</span></legend>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {MBH_CANCELLATION_REASONS.map((option) => {
                const selected = reason === option;
                return <label key={option} style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 10px", border: `1px solid ${selected ? C.orange[400] : C.grey[300]}`, borderRadius: 7, background: selected ? C.orange[100] : C.grey[100], cursor: "pointer", fontFamily: font }}>
                  <input type="radio" name="visit-cancellation-reason" value={option} checked={selected} onChange={() => setReason(option)} style={{ accentColor: C.orange[400] }} />
                  <span style={{ fontSize: 14, color: C.grey[800] }}>{option}</span>
                </label>;
              })}
            </div>
          </fieldset>
        </div>

        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8, padding: "14px 20px", borderTop: `1px solid ${C.grey[300]}` }}>
          <Button variant="secondary" size="md" onClick={onClose}>Keep Visit</Button>
          <Button variant="cta" size="md" onClick={() => onConfirm(reason)} disabled={!reason}>Cancel Visit</Button>
        </div>
      </div>
    </div>
  );
};
