import { useState, useRef, useEffect } from "react";
import { Search, Check, X } from "lucide-react";
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
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => { searchRef.current?.focus(); }, []);

  const q = query.toLowerCase().trim();
  const filtered = q
    ? patients.filter((p) => p.name.toLowerCase().includes(q) || p.id.toLowerCase().includes(q))
    : [];

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

  const selectedPatient = patients.find((p) => p.id === selectedId) || null;

  useEffect(() => {
    if (activeIndex >= filtered.length) setActiveIndex(0);
  }, [filtered.length, activeIndex]);

  useEffect(() => {
    const list = listRef.current;
    if (!list) return;
    const el = list.children[activeIndex];
    if (el) el.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleKeyDown = (e) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setOpen(true);
      setActiveIndex((i) => Math.min(i + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[activeIndex]) {
        onSelect(filtered[activeIndex]);
        setQuery("");
        setOpen(false);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  const handleSelect = (p) => {
    onSelect(p);
    setQuery("");
    setOpen(false);
  };

  const showDropdown = open && q && filtered.length > 0;

  return (
    <div>
      <label style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font, marginBottom: 8, display: "block" }}>
        Select Patient <span style={{ color: C.error[400] }}>*</span>
      </label>
      <div ref={wrapperRef} style={{ position: "relative", marginBottom: 12 }}>
        <Search size={15} color={C.grey[500]} style={{ position: "absolute", left: 10, top: "50%", transform: "translateY(-50%)", pointerEvents: "none", zIndex: 1 }} />
        <input
          ref={searchRef}
          value={query}
          onChange={(e) => { setQuery(e.target.value); setOpen(true); setActiveIndex(0); }}
          onFocus={() => { if (q) setOpen(true); }}
          onKeyDown={handleKeyDown}
          placeholder="Search by name or MRN..."
          style={{
            width: "100%",
            boxSizing: "border-box",
            padding: "8px 10px 8px 32px",
            border: `0.5px solid ${showDropdown ? C.primary[500] : C.grey[300]}`,
            borderRadius: 8,
            fontSize: 14,
            color: C.grey[800],
            background: C.grey[100],
            outline: "none",
            fontFamily: font,
            boxShadow: showDropdown ? `0 0 0 2px ${C.primary[100]}` : "none",
          }}
        />
        {showDropdown && (
          <div ref={listRef} style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            maxHeight: 280,
            overflowY: "auto",
            border: `0.5px solid ${C.grey[300]}`,
            borderRadius: 8,
            background: C.grey[100],
            boxShadow: "0 8px 22px rgba(31,55,57,0.14)",
            zIndex: 300,
          }}>
            {filtered.map((p, i) => {
              const active = i === activeIndex;
              const scheduled = scheduledByPatient[p.id];
              return (
                <div
                  key={p.id}
                  onClick={() => handleSelect(p)}
                  onMouseEnter={() => setActiveIndex(i)}
                  style={{
                    display: "flex",
                    alignItems: "flex-start",
                    gap: 10,
                    padding: "10px 12px",
                    cursor: "pointer",
                    background: active ? C.primary[100] : C.grey[100],
                    borderBottom: `0.5px solid ${C.grey[300]}`,
                    borderLeft: `3px solid ${selectedId === p.id ? C.primary[500] : "transparent"}`,
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
                  {selectedId === p.id && (
                    <Check size={16} color={C.primary[500]} style={{ flexShrink: 0, marginTop: 2 }} />
                  )}
                </div>
              );
            })}
          </div>
        )}
        {open && q && filtered.length === 0 && (
          <div style={{
            position: "absolute",
            top: "100%",
            left: 0,
            right: 0,
            marginTop: 4,
            padding: 16,
            textAlign: "center",
            fontSize: 14,
            color: C.grey[500],
            fontFamily: font,
            border: `0.5px solid ${C.grey[300]}`,
            borderRadius: 8,
            background: C.grey[100],
            boxShadow: "0 8px 22px rgba(31,55,57,0.14)",
            zIndex: 300,
          }}>
            No patients match &lsquo;{query}&rsquo;
          </div>
        )}
      </div>
      {selectedPatient && (
        <div style={{
          display: "flex",
          alignItems: "center",
          gap: 10,
          padding: "10px 12px",
          background: C.primary[100],
          border: `0.5px solid ${C.primary[500]}33`,
          borderLeft: `3px solid ${C.primary[500]}`,
          borderRadius: 8,
        }}>
          <Check size={16} color={C.primary[500]} style={{ flexShrink: 0 }} />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
              <span style={{ fontSize: 15, fontWeight: 600, color: C.grey[800], fontFamily: font }}>{selectedPatient.name}</span>
              <span style={caseTypeBadgeStyle}>{selectedPatient.caseType}</span>
            </div>
            <div style={{ fontSize: 13, color: C.grey[500], fontFamily: font, marginTop: 2 }}>
              MRN {selectedPatient.id} · Age {selectedPatient.age}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onSelect(null)}
            aria-label="Clear selected patient"
            style={{
              border: 0,
              background: "transparent",
              cursor: "pointer",
              padding: 4,
              display: "flex",
              alignItems: "center",
              color: C.grey[500],
            }}
          >
            <X size={16} />
          </button>
        </div>
      )}
    </div>
  );
};
