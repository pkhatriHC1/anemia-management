import { useState, useEffect, useMemo } from "react";
import { Search, Filter, ChevronDown, CalendarPlus, MoreHorizontal, Calendar } from "lucide-react";
import { Button } from "../Button";
import { Badge } from "../Badge";
import { getFollowUps, SPECIALTIES, CAN_CLINICAL_NAVIGATION } from "./followUpStore";
import { ScheduleFollowUpModal } from "./ScheduleFollowUpModal";

const C = {
  grey: {
    100: "#FFFFFF",
    200: "#F7F7F7",
    300: "#E7E7E7",
    400: "#CFD1D1",
    500: "#A8ADAD",
    600: "#737E7F",
    700: "#545D5E",
    800: "#273233",
  },
  primary: {
    100: "#ECF4F5",
    500: "#0D7782",
    600: "#0B626B",
    700: "#094F57",
  },
  secondary: {
    400: "#75CAD3",
    600: "#1D828C",
  },
  error: {
    100: "#F4DFE4",
    400: "#B00A2F",
  },
  success: {
    100: "#D7E7D6",
    400: "#388032",
  },
};
const font = "var(--hc-font-sans)";

const STATUS_VARIANT = {
  Scheduled: "info",
  Completed: "success",
  Cancelled: "neutral",
};

const SPECIALTY_VARIANT = {
  "Non-Surgical Medical": "primary",
  "Women's Health-Non-Surgical": "warning",
};

const formatDateTime = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `${mm}/${dd}/${yyyy}, ${hh}:${mi}:${ss}`;
};

const isOverdue = (v) => {
  if (v.status !== "Scheduled") return false;
  return new Date(v.followUpAt).getTime() < Date.now();
};

const isDueIn7 = (v) => {
  if (v.status !== "Scheduled") return false;
  const diff = new Date(v.followUpAt).getTime() - Date.now();
  return diff >= 0 && diff <= 7 * 24 * 60 * 60 * 1000;
};

export const FollowUpWorklist = ({ patients = [] }) => {
  const [visits, setVisits] = useState(() => getFollowUps());
  const [search, setSearch] = useState("");
  const [specialtyFilter, setSpecialtyFilter] = useState("All Specialties");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [modalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    const handler = () => setVisits(getFollowUps());
    window.addEventListener("follow-ups-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("follow-ups-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  const counts = useMemo(() => {
    const all = visits;
    return {
      scheduled: all.filter((v) => v.status === "Scheduled").length,
      dueIn7: all.filter(isDueIn7).length,
      overdue: all.filter(isOverdue).length,
      completed: all.filter((v) => v.status === "Completed").length,
      cancelled: all.filter((v) => v.status === "Cancelled").length,
    };
  }, [visits]);

  const COLS = [
    "PATIENT",
    "SPECIALTY",
    "FOLLOW-UP DATE",
    "REFERRING PROVIDER",
    "STATUS",
    "ACTIONS",
  ];

  const filtered = useMemo(() => {
    const q = search.toLowerCase();
    const matched = visits.filter((v) => {
      const matchesSearch =
        !q ||
        v.patientName.toLowerCase().includes(q) ||
        v.patientId.toLowerCase().includes(q);
      const matchesSpecialty =
        specialtyFilter === "All Specialties" || v.specialties.includes(specialtyFilter);
      const matchesStatus =
        statusFilter === "All Statuses" || v.status === statusFilter;
      return matchesSearch && matchesSpecialty && matchesStatus;
    });
    return [...matched].sort((a, b) => {
      const aScheduled = a.status === "Scheduled";
      const bScheduled = b.status === "Scheduled";
      if (aScheduled && !bScheduled) return -1;
      if (!aScheduled && bScheduled) return 1;
      const da = new Date(a.followUpAt).getTime();
      const db = new Date(b.followUpAt).getTime();
      if (aScheduled && bScheduled) {
        const aOver = isOverdue(a);
        const bOver = isOverdue(b);
        if (aOver && !bOver) return -1;
        if (!aOver && bOver) return 1;
        return da - db;
      }
      return db - da;
    });
  }, [visits, search, specialtyFilter, statusFilter]);

  const hasActiveFilters =
    search !== "" || specialtyFilter !== "All Specialties" || statusFilter !== "All Statuses";

  const clearFilters = () => {
    setSearch("");
    setSpecialtyFilter("All Specialties");
    setStatusFilter("All Statuses");
  };

  const dropdowns = [
    { v: specialtyFilter, s: setSpecialtyFilter, o: ["All Specialties", ...SPECIALTIES] },
    {
      v: statusFilter,
      s: setStatusFilter,
      o: ["All Statuses", "Scheduled", "Completed", "Cancelled"],
    },
  ];

  const statBlocks = [
    { label: "Scheduled", value: counts.scheduled, color: C.primary[500] },
    { label: "Due in 7 days", value: counts.dueIn7, color: C.secondary[600] },
    { label: "Overdue", value: counts.overdue, color: counts.overdue > 0 ? C.error[400] : C.grey[600] },
    { label: "Completed", value: counts.completed, color: C.success[400] },
    { label: "Cancelled", value: counts.cancelled, color: C.grey[600] },
  ];

  return (
    <div
      style={{
        flex: 1,
        overflow: "hidden",
        padding: "12px 16px",
        display: "flex",
        flexDirection: "column",
        minHeight: 0,
      }}
    >
      <div
        style={{
          background: C.grey[100],
          borderRadius: 12,
          border: `0.5px solid ${C.grey[300]}`,
          boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          flex: 1,
          minHeight: 0,
        }}
      >
        {/* Summary banner — teal gradient band */}
        <div
          style={{
            background: `linear-gradient(135deg, ${C.primary[600]}, ${C.primary[500]}, ${C.secondary[600]})`,
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            padding: "14px 20px",
            display: "flex",
            alignItems: "center",
            gap: 16,
            flexShrink: 0,
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              opacity: 0.05,
              backgroundImage: "radial-gradient(rgba(255,255,255,0.9) 1px, transparent 1px)",
              backgroundSize: "18px 18px",
              pointerEvents: "none",
            }}
          />
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
            <Calendar size={18} color="rgba(255,255,255,0.85)" />
            <span style={{ fontSize: 17, fontWeight: 700, color: "rgba(255,255,255,0.95)", fontFamily: font, whiteSpace: "nowrap" }}>
              Follow-Up Visits
            </span>
          </div>
          <div style={{ position: "relative", display: "flex", alignItems: "center", gap: 20, flexWrap: "wrap", marginLeft: "auto" }}>
            {statBlocks.map((s) => (
              <div key={s.label} style={{ display: "flex", flexDirection: "column", alignItems: "flex-start", minWidth: 0 }}>
                <span className="tabular-nums-hc1" style={{ fontSize: 20, fontWeight: 700, color: "rgba(255,255,255,0.95)", fontFamily: font, lineHeight: 1.1 }}>
                  {s.value}
                </span>
                <span style={{ fontSize: 11, fontWeight: 600, color: "rgba(255,255,255,0.7)", fontFamily: font, textTransform: "uppercase", letterSpacing: "0.06em", whiteSpace: "nowrap", marginTop: 2 }}>
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Toolbar */}
        <div
          style={{
            padding: "12px 20px",
            borderBottom: `0.5px solid ${C.grey[300]}`,
            display: "flex",
            alignItems: "center",
            gap: 10,
            flexShrink: 0,
          }}
        >
          <div style={{ position: "relative", width: 260 }}>
            <Search
              size={13}
              color={C.grey[500]}
              style={{
                position: "absolute",
                left: 10,
                top: "50%",
                transform: "translateY(-50%)",
                pointerEvents: "none",
              }}
            />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search patient name or ID…"
              style={{
                width: "100%",
                boxSizing: "border-box",
                padding: "7px 10px 7px 30px",
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
          <div style={{ flex: 1 }} />
          <Filter size={13} color={C.grey[500]} />
          <span style={{ fontSize: 14, color: C.grey[500], fontFamily: font }}>
            Filter by:
          </span>
          {dropdowns.map((dd, i) => (
            <div key={i} style={{ position: "relative" }}>
              <select
                value={dd.v}
                onChange={(e) => dd.s(e.target.value)}
                style={{
                  appearance: "none",
                  padding: "6px 26px 6px 10px",
                  border: `0.5px solid ${C.grey[300]}`,
                  borderRadius: 8,
                  fontSize: 14,
                  color: C.grey[700],
                  background: C.grey[100],
                  cursor: "pointer",
                  outline: "none",
                  fontFamily: font,
                }}
              >
                {dd.o.map((o) => (
                  <option key={o}>{o}</option>
                ))}
              </select>
              <ChevronDown
                size={10}
                color={C.grey[500]}
                style={{
                  position: "absolute",
                  right: 7,
                  top: "50%",
                  transform: "translateY(-50%)",
                  pointerEvents: "none",
                }}
              />
            </div>
          ))}
          {CAN_CLINICAL_NAVIGATION && (
            <Button variant="primary" size="sm" leftIcon={<CalendarPlus size={14} />} onClick={() => setModalOpen(true)}>
              Schedule Follow-Up
            </Button>
          )}
        </div>

        {/* Table */}
        <div
          style={{
            flex: 1,
            overflowY: "auto",
            overflowX: "auto",
            minHeight: 0,
          }}
        >
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr
                style={{
                  background: C.grey[200],
                  borderBottom: `1px solid ${C.grey[300]}`,
                  position: "sticky",
                  top: 0,
                  zIndex: 1,
                }}
              >
                {COLS.map((h) => (
                  <th
                    key={h}
                    style={{
                      fontSize: 14,
                      fontWeight: 700,
                      letterSpacing: "0.06em",
                      color: C.grey[600],
                      textAlign: "left",
                      padding: "10px 16px",
                      textTransform: "uppercase",
                      whiteSpace: "nowrap",
                      fontFamily: font,
                    }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {visits.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLS.length}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      fontSize: 14,
                      color: C.grey[500],
                      fontFamily: font,
                    }}
                  >
                    No follow-up visits are currently scheduled.
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td
                    colSpan={COLS.length}
                    style={{
                      padding: 24,
                      textAlign: "center",
                      fontSize: 14,
                      color: C.grey[500],
                      fontFamily: font,
                    }}
                  >
                    No follow-ups match your filters.{" "}
                    <button
                      type="button"
                      onClick={clearFilters}
                      style={{
                        border: 0,
                        background: "transparent",
                        color: "var(--hc-color-text-link)",
                        cursor: "pointer",
                        fontSize: 14,
                        fontFamily: font,
                        textDecoration: "underline",
                        padding: 0,
                      }}
                    >
                      Clear filters
                    </button>
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const overdue = isOverdue(v);
                  return (
                    <tr
                      key={v.id}
                      style={{
                        borderBottom: `0.5px solid ${C.grey[300]}`,
                        cursor: "pointer",
                        transition: "background 150ms cubic-bezier(0.2, 0, 0, 1)",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = C.grey[200];
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = "transparent";
                      }}
                      onClick={() => {}}
                    >
                      {/* PATIENT */}
                      <td style={{ padding: "12px 16px", minWidth: 140 }}>
                        <div
                          style={{
                            fontSize: 14,
                            fontWeight: 600,
                            color: C.grey[800],
                            fontFamily: font,
                          }}
                        >
                          {v.patientName}
                        </div>
                        <div
                          style={{
                            fontSize: 12,
                            color: C.grey[500],
                            fontFamily: font,
                            marginTop: 2,
                          }}
                        >
                          MRN {v.patientId}
                        </div>
                      </td>
                      {/* SPECIALTY */}
                      <td style={{ padding: "12px 16px", minWidth: 200 }}>
                        <div style={{ display: "flex", gap: 4, flexWrap: "wrap" }}>
                          {v.specialties.map((s) => (
                            <Badge
                              key={s}
                              variant={SPECIALTY_VARIANT[s] || "neutral"}
                              appearance="soft"
                              size="sm"
                            >
                              {s}
                            </Badge>
                          ))}
                        </div>
                      </td>
                      {/* FOLLOW-UP DATE */}
                      <td style={{ padding: "12px 16px", minWidth: 180 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                          <span className="tabular-nums-hc1" style={{ fontSize: 14, color: C.grey[800], fontFamily: font }}>
                            {formatDateTime(v.followUpAt)}
                          </span>
                          {overdue && (
                            <Badge variant="danger" appearance="soft" size="sm">
                              Overdue
                            </Badge>
                          )}
                        </div>
                      </td>
                      {/* REFERRING PROVIDER */}
                      <td
                        style={{
                          padding: "12px 16px",
                          minWidth: 120,
                          fontSize: 14,
                          fontWeight: 600,
                          color: C.grey[800],
                          fontFamily: font,
                        }}
                      >
                        {v.referringProvider || "—"}
                      </td>
                      {/* STATUS */}
                      <td style={{ padding: "12px 16px", minWidth: 120 }}>
                        <Badge
                          variant={STATUS_VARIANT[v.status] || "neutral"}
                          appearance="soft"
                          size="sm"
                        >
                          {v.status}
                        </Badge>
                      </td>
                      {/* ACTIONS */}
                      <td style={{ padding: "12px 16px", minWidth: 60 }}>
                        <Button
                          variant="ghost"
                          size="sm"
                          iconOnly
                          aria-label="Row actions"
                          onClick={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal size={16} />
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div
          style={{
            padding: "9px 16px",
            borderTop: `0.5px solid ${C.grey[300]}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            flexShrink: 0,
          }}
        >
          <span style={{ fontSize: 14, color: C.grey[500], fontFamily: font }}>
            Showing {filtered.length} of {visits.length} follow-ups
          </span>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <div style={{ width: 6, height: 6, borderRadius: "50%", background: C.success[400] }} />
            <span style={{ fontSize: 14, color: C.success[400], fontFamily: font }}>
              FHIR R4 Live · Synced 2 min ago
            </span>
          </div>
        </div>
      </div>
      {modalOpen && (
        <ScheduleFollowUpModal patients={patients} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};
