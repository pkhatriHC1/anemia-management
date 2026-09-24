import { useState, useEffect, useMemo } from "react";
import { Search, Filter, ChevronDown, CalendarPlus } from "lucide-react";
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

const formatDate = (iso) => {
  const d = new Date(iso);
  if (isNaN(d)) return iso;
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const yyyy = d.getFullYear();
  return `${mm}/${dd}/${yyyy}`;
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

  const COLS = [
    "PATIENT",
    "DOB",
    "SPECIALTY",
    "FOLLOW-UP DATE/TIME",
    "STATUS",
    "SCHEDULED BY",
    "SCHEDULED ON",
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
      return aScheduled ? da - db : db - da;
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
          <span
            style={{
              fontSize: 18,
              fontWeight: 700,
              color: C.grey[800],
              fontFamily: font,
            }}
          >
            Follow-Up Visits
          </span>
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
              placeholder="Search patient name or MRN..."
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
                    No follow-up visits scheduled.
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
                filtered.map((v) => (
                  <tr
                    key={v.id}
                    style={{
                      borderBottom: `0.5px solid ${C.grey[300]}`,
                      transition: "background 150ms cubic-bezier(0.2, 0, 0, 1)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = C.grey[200];
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = "transparent";
                    }}
                  >
                    <td
                      style={{ padding: "12px 16px", minWidth: 140 }}
                    >
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
                    <td
                      style={{
                        padding: "12px 16px",
                        minWidth: 110,
                        fontSize: 14,
                        color: C.grey[700],
                        fontFamily: font,
                      }}
                    >
                      {v.dob}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        minWidth: 200,
                      }}
                    >
                      <div
                        style={{
                          display: "flex",
                          gap: 4,
                          flexWrap: "wrap",
                        }}
                      >
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
                    <td
                      style={{
                        padding: "12px 16px",
                        minWidth: 180,
                        fontSize: 14,
                        color: C.grey[800],
                        fontFamily: font,
                      }}
                    >
                      <span className="tabular-nums-hc1">
                        {formatDateTime(v.followUpAt)}
                      </span>
                    </td>
                    <td
                      style={{ padding: "12px 16px", minWidth: 120 }}
                    >
                      <Badge
                        variant={STATUS_VARIANT[v.status] || "neutral"}
                        appearance="soft"
                        size="sm"
                      >
                        {v.status}
                      </Badge>
                    </td>
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
                      {v.createdBy}
                    </td>
                    <td
                      style={{
                        padding: "12px 16px",
                        minWidth: 110,
                        fontSize: 14,
                        color: C.grey[700],
                        fontFamily: font,
                      }}
                    >
                      <span className="tabular-nums-hc1">
                        {formatDate(v.createdAt)}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div
          style={{
            padding: "9px 16px",
            borderTop: `0.5px solid ${C.grey[300]}`,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <span
            style={{ fontSize: 14, color: C.grey[500], fontFamily: font }}
          >
            Showing {filtered.length} of {visits.length} follow-ups
          </span>
        </div>
      </div>
      {modalOpen && (
        <ScheduleFollowUpModal patients={patients} onClose={() => setModalOpen(false)} />
      )}
    </div>
  );
};
