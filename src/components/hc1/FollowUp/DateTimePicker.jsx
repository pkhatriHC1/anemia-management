import { useState, useEffect, useCallback } from "react";
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown } from "lucide-react";

const C = {
  grey: { 100: "#FFFFFF", 200: "#F7F7F7", 300: "#E7E7E7", 400: "#CFD1D1", 500: "#A8ADAD", 600: "#737E7F", 700: "#545D5E", 800: "#273233" },
  primary: { 100: "#E4F1F0", 400: "#3AA6B0", 500: "#0D7782", 600: "#0A5F66" },
  error: { 100: "#FDEDED", 400: "#B00A2F" },
};
const font = "var(--hc-font-sans)";

const MONTHS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
const DOW = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const pad = (n) => String(n).padStart(2, "0");

const toDateOnly = (d) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const today = () => toDateOnly(new Date());

const buildGrid = (year, month) => {
  const first = new Date(year, month, 1);
  const startDay = first.getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = [];
  for (let i = 0; i < startDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(new Date(year, month, d));
  while (cells.length % 7 !== 0) cells.push(null);
  return cells;
};

export const DateTimePicker = ({ value, onChange, onClose }) => {
  const initial = value ? new Date(value) : new Date();
  const [viewYear, setViewYear] = useState(initial.getFullYear());
  const [viewMonth, setViewMonth] = useState(initial.getMonth());
  const [hour, setHour] = useState(value ? new Date(value).getHours() : 9);
  const [minute, setMinute] = useState(value ? new Date(value).getMinutes() : 0);
  const t = today();

  const commit = useCallback(
    (date, h, m) => {
      if (!date) return;
      const iso = new Date(date.getFullYear(), date.getMonth(), date.getDate(), h, m, 0).toISOString();
      onChange(iso);
    },
    [onChange]
  );

  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") onClose?.();
    };
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [onClose]);

  const selectedDate = value ? toDateOnly(new Date(value)) : null;
  const cells = buildGrid(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1); }
    else setViewMonth((m) => m - 1);
  };
  const nextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1); }
    else setViewMonth((m) => m + 1);
  };

  const wrapHour = (dir) => setHour((h) => (h + dir + 24) % 24);
  const wrapMin = (dir) => setMinute((m) => (m + dir + 60) % 60);

  const isPast = (date) => toDateOnly(date) < t;

  const pickDate = (date) => {
    if (isPast(date)) return;
    commit(date, hour, minute);
  };

  useEffect(() => {
    if (selectedDate) {
      setViewYear(selectedDate.getFullYear());
      setViewMonth(selectedDate.getMonth());
    }
  }, [value]);

  return (
    <div
      style={{
        background: C.grey[100],
        border: `0.5px solid ${C.grey[300]}`,
        borderRadius: 10,
        boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
        padding: 14,
        width: 280,
      }}
    >
      {/* Month header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
        <button type="button" onClick={prevMonth} aria-label="Previous month" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 4, display: "grid", placeItems: "center", color: C.grey[600] }}>
          <ChevronLeft size={16} />
        </button>
        <span style={{ fontSize: 14, fontWeight: 700, color: C.grey[800], fontFamily: font }}>
          {MONTHS[viewMonth]} {viewYear}
        </span>
        <button type="button" onClick={nextMonth} aria-label="Next month" style={{ border: 0, background: "transparent", cursor: "pointer", padding: 4, display: "grid", placeItems: "center", color: C.grey[600] }}>
          <ChevronRight size={16} />
        </button>
      </div>

      {/* Day-of-week header */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2, marginBottom: 4 }}>
        {DOW.map((d) => (
          <div key={d} style={{ textAlign: "center", fontSize: 11, fontWeight: 700, color: C.grey[500], fontFamily: font, padding: "2px 0" }}>
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 2 }}>
        {cells.map((date, i) => {
          if (!date) return <div key={i} />;
          const past = isPast(date);
          const isToday = toDateOnly(date).getTime() === t.getTime();
          const isSelected = selectedDate && toDateOnly(date).getTime() === selectedDate.getTime();
          return (
            <button
              key={i}
              type="button"
              disabled={past}
              onClick={() => pickDate(date)}
              style={{
                border: isSelected ? 0 : `0.5px solid transparent`,
                borderRadius: 6,
                padding: "5px 0",
                fontSize: 13,
                fontFamily: font,
                cursor: past ? "default" : "pointer",
                background: isSelected ? C.primary[500] : "transparent",
                color: isSelected ? "#fff" : past ? C.grey[400] : C.grey[800],
                fontWeight: isSelected ? 700 : 500,
                outline: isToday && !isSelected ? `1.5px solid ${C.primary[400]}` : "none",
                outlineOffset: isToday && !isSelected ? -1 : 0,
              }}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>

      {/* Time row */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 16, marginTop: 12, paddingTop: 10, borderTop: `0.5px solid ${C.grey[300]}` }}>
        {/* Hour */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.grey[500], fontFamily: font }}>Hour</label>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button type="button" onClick={() => wrapHour(1)} aria-label="Increase hour" style={stepperBtn}>
              <ChevronUp size={12} color={C.grey[700]} />
            </button>
            <span className="tabular-nums-hc1" style={{ fontSize: 18, fontWeight: 700, color: C.grey[800], fontFamily: font, minWidth: 28, textAlign: "center" }}>
              {pad(hour)}
            </span>
            <button type="button" onClick={() => wrapHour(-1)} aria-label="Decrease hour" style={stepperBtn}>
              <ChevronDown size={12} color={C.grey[700]} />
            </button>
          </div>
        </div>
        <span style={{ fontSize: 18, fontWeight: 700, color: C.grey[400], fontFamily: font, marginTop: 14 }}>:</span>
        {/* Minute */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
          <label style={{ fontSize: 11, fontWeight: 700, color: C.grey[500], fontFamily: font }}>Minute</label>
          <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
            <button type="button" onClick={() => wrapMin(1)} aria-label="Increase minute" style={stepperBtn}>
              <ChevronUp size={12} color={C.grey[700]} />
            </button>
            <span className="tabular-nums-hc1" style={{ fontSize: 18, fontWeight: 700, color: C.grey[800], fontFamily: font, minWidth: 28, textAlign: "center" }}>
              {pad(minute)}
            </span>
            <button type="button" onClick={() => wrapMin(-1)} aria-label="Decrease minute" style={stepperBtn}>
              <ChevronDown size={12} color={C.grey[700]} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const stepperBtn = {
  border: `0.5px solid ${C.grey[300]}`,
  borderRadius: 4,
  background: C.grey[200],
  cursor: "pointer",
  padding: 2,
  display: "grid",
  placeItems: "center",
  width: 24,
  height: 24,
};

export default DateTimePicker;
