import { useEffect, useState } from "react";
import { BarChart3, ChevronDown, LogOut, Settings, ShieldCheck } from "lucide-react";

const SETTINGS_ITEMS = [
  { label: "Lab Types Mapping", adminOnly: true, count: 1 },
  { label: "Case Types Mapping", adminOnly: true, count: 1 },
  { label: "Facilities", adminOnly: false },
  { label: "Regions", adminOnly: false },
  { label: "Lab Types", adminOnly: false },
  { label: "Case Types", adminOnly: false },
  { label: "Clients", adminOnly: true },
  { label: "Users", adminOnly: true },
  { label: "Config", adminOnly: true },
];

const REPORT_ITEMS = ["ROI Impact"];

const menuButtonStyle = (active) => ({
  display: "inline-flex",
  alignItems: "center",
  gap: 5,
  border: 0,
  borderRadius: 6,
  background: active ? "#F1F5F5" : "transparent",
  color: "#273233",
  padding: "7px 8px",
  fontFamily: "inherit",
  fontSize: 13,
  cursor: "pointer",
});

const itemButtonStyle = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  width: "100%",
  border: 0,
  background: "transparent",
  color: "#3F4D4E",
  padding: "9px 12px",
  textAlign: "left",
  fontFamily: "inherit",
  fontSize: 13,
  cursor: "pointer",
};

export const BloodHealthAppNav = () => {
  const [openMenu, setOpenMenu] = useState(null);
  const currentRole = "BloodHealth Admin";
  const isAdmin = currentRole.includes("Admin");
  const visibleSettings = SETTINGS_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest("[data-bloodhealth-menu]")) setOpenMenu(null);
    };
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);

  return (
    <div data-bloodhealth-menu style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 7, color: "#344445", fontSize: 13, paddingRight: 8 }}>
        <div style={{ width: 24, height: 24, borderRadius: "50%", display: "grid", placeItems: "center", background: "#E4F1F0", color: "#0D7782" }}><ShieldCheck size={14} /></div>
        <div><div style={{ fontWeight: 700, lineHeight: 1.1 }}>Tiffany Hall</div><div style={{ color: "#7A8788", fontSize: 11, lineHeight: 1.1 }}>{currentRole}</div></div>
      </div>

      <div style={{ position: "relative" }}>
        <button type="button" aria-expanded={openMenu === "reports"} aria-haspopup="menu" onClick={() => setOpenMenu(openMenu === "reports" ? null : "reports")} style={menuButtonStyle(openMenu === "reports")}><BarChart3 size={15} strokeWidth={1.7} />Reports</button>
        {openMenu === "reports" && <div role="menu" style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 176, background: "#fff", border: "1px solid #DCE4E4", borderRadius: 8, boxShadow: "0 8px 22px rgba(31,55,57,0.14)", padding: "5px 0", zIndex: 100 }}><div style={{ color: "#8A9697", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 12px 5px" }}>Reports</div>{REPORT_ITEMS.map((item) => <button key={item} type="button" role="menuitem" style={itemButtonStyle} onClick={() => setOpenMenu(null)} onMouseEnter={(event) => { event.currentTarget.style.background = "#F5F8F8"; }} onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }}>{item}</button>)}</div>}
      </div>

      <div style={{ position: "relative" }}>
        <button type="button" aria-expanded={openMenu === "settings"} aria-haspopup="menu" onClick={() => setOpenMenu(openMenu === "settings" ? null : "settings")} style={menuButtonStyle(openMenu === "settings")}><Settings size={15} strokeWidth={1.7} />Settings<span style={{ minWidth: 16, height: 16, borderRadius: 999, display: "inline-grid", placeItems: "center", background: "#F4DFE4", color: "#B00A2F", fontSize: 10, fontWeight: 700 }}>2</span><ChevronDown size={12} /></button>
        {openMenu === "settings" && <div role="menu" style={{ position: "absolute", right: 0, top: "calc(100% + 8px)", width: 194, background: "#fff", border: "1px solid #DCE4E4", borderRadius: 8, boxShadow: "0 8px 22px rgba(31,55,57,0.14)", padding: "5px 0", zIndex: 100 }}><div style={{ color: "#8A9697", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 12px 5px" }}>Feature Sets</div>{visibleSettings.map((item) => <button key={item.label} type="button" role="menuitem" style={itemButtonStyle} onClick={() => setOpenMenu(null)} onMouseEnter={(event) => { event.currentTarget.style.background = "#F5F8F8"; }} onMouseLeave={(event) => { event.currentTarget.style.background = "transparent"; }}><span>{item.label}</span>{item.count && <span style={{ minWidth: 16, height: 16, borderRadius: 999, display: "inline-grid", placeItems: "center", background: "#F9E3E7", color: "#B00A2F", fontSize: 10, fontWeight: 700 }}>{item.count}</span>}</button>)}</div>}
      </div>

      <button type="button" aria-label="Sign out" onClick={() => setOpenMenu(null)} style={{ border: 0, borderLeft: "1px solid #E2E8E8", padding: "6px 0 6px 10px", background: "transparent", color: "#7A8788", cursor: "pointer" }}><LogOut size={16} strokeWidth={1.7} /></button>
    </div>
  );
};
