import { useState, useRef, useEffect } from "react";
import { Search, Check } from "lucide-react";
import { getFollowUps } from "./followUpStore";

const C = {
  grey: { 100: "#FFFFFF", 200: "#F7F7F7", 300: "#E7E7E7", 400: "#CFD1D1", 500: "#A8ADAD", 600: "#737E7F", 700: "#545D5E", 800: "#273233" },
  primary: { 100: "#ECF4F5", 500: "#0D7782" },
  error: { 400: "#B00A2F" },
};
const font = "var(--hc-font-sans)";

const pad = (n) => String(n).padStart(2, "0");

const formatDateTime = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  return `${pad(d.getMonth() + 1)}/${pad(d.getDate())}/${d.getFullYear()}, ${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
};

const caseTypeBadgeStyle = {
  fontSize: 12,
  fontWeight: 600,
  color: C.grey[700],
  background: C.grey[200],
  border: `0.5px solid ${C.grey[300]}`,
  borderRadius: 4,
  padding: "2px 7px",
  fontFamily: font,
  letterSpacing: "0.05em",
  textTransform: "uppercase",
  whiteSpace: "nowrap",
};

export const PatientPickerStep = ({ patients, selectedId, onSelect }) => {
  const [query, setQuery] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  const q = query.toLowerCase();
  const filtered = patients.filter(
    (p) => !q || p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q)
  );

  const scheduledByPatient = (() => {
    const visits = getFollowUps();
    const map = {};
    for (const v of visits) {
      if (v.status !== "Scheduled") continue;
      const existing = map[v.patientId];
      if (!existing || new Date(v.followUpAt) < new Date(existing.followUpAt)) {
        map[v.patientId] = v;
      }
    }
    return map;
  })();

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[activeIndex];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) onSelect(filtered[activeIndex]);
    }
  };

  return (
    <div>
      <label style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font, marginBottom: 8, display: "block" }}>
        Select Patient <span style={{ color: C.error[400] }}>*</span>
      </label>
      <div style={{ position: "relative", marginBottom: 12 }}>
        <Search size={15} color={C.grey[500]} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none" }} />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setActiveIndex(0); }}
          onKeyDown={handleKeyDown}
          placeholder="Search by name or MRN..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 10px 8px 32px",
            border: `0.5px solid ${C.grey[300]}`,
            borderRadius: 8,
            fontSize: 14,
            color: C.grey[800],
            background: C.grey[100],
            outline: "none",
            fontFamily: font,
          }}
        />
      </div>
      <div ref={listRef} style={{ maxHeight: 280, overflowY: "auto", border: `0.5px solid ${C.grey[300]}`, borderRadius: 8 }}>
        {filtered.length === 0 ? (
          <div style={{ padding: 24, textAlign: "center", fontSize: 14, color: C.grey[500], fontFamily: font }}>
            No patients match '{query}'
          </div>
        ) : (
          filtered.map((p, i) => {
            const selected = selectedId === p.id;
            const active = i === activeIndex;
            const scheduled = scheduledByPatient[p.id];
            return (
              <div
                key={p.id}
                onClick={() => onSelect(p)}
                onMouseEnter={() => setActiveIndex(i)}
                style={{
                  display: "flex",
                  alignItems: "flex-start",
                  gap: 10,
                  padding: "10px 12px",
                  cursor: "pointer",
                  background: selected ? C.primary[100] : active ? C.grey[200] : C.grey[100],
                  borderBottom: `0.5px solid ${C.grey[300]}`,
                  borderLeft: `3px solid ${selected ? C.primary[500] : "transparent"}`,
                  transition: "background 0.1s",
                }}
              >
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 2, flexWrap: "wrap" }}>
                    <span style={{ fontSize: 15, fontWeight: 600, color: C.grey[800], fontFamily: font }}>{p.name}</span>
                    <span style={caseTypeBadgeStyle}>{p.caseType}</span>
                  </div>
                  <div style={{ fontSize: 13, color: C.grey[500], fontFamily: font }}>
                    MRN {p.id} · Age {p.age}
                  </div>
                  {scheduled && (
                    <div style={{ fontSize: 12, color: C.grey[500], fontFamily: font, marginTop: 4 }}>
                      Follow-up scheduled · {formatDateTime(scheduled.followUpAt)}
                    </div>
                  )}
                </div>
                {selected && (
                  <Check size={16} color={C.primary[500]} style={{ flexShrink: 0, marginTop: 2 }} />
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
