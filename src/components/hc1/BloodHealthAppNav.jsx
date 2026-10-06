import { useEffect, useState, useRef } from "react";
import { BarChart3, ChevronDown, LogOut, Settings, Calendar } from "lucide-react";
import { CAN_CLINICAL_NAVIGATION, getFollowUps } from "./FollowUp/followUpStore";

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

const dropdownStyle = {
  position: "absolute",
  right: 0,
  top: "calc(100% + 8px)",
  background: "#fff",
  border: "1px solid #DCE4E4",
  borderRadius: 8,
  boxShadow: "0 8px 22px rgba(31,55,57,0.14)",
  padding: "5px 0",
  zIndex: 100,
};

const badgeStyle = {
  minWidth: 16,
  height: 16,
  borderRadius: 999,
  display: "inline-grid",
  placeItems: "center",
  background: "#F4DFE4",
  color: "#B00A2F",
  fontSize: 10,
  fontWeight: 700,
};

export const BloodHealthAppNav = ({ onNavigate, currentScreen }) => {
  const [openMenu, setOpenMenu] = useState(null);
  const [focusedIndex, setFocusedIndex] = useState(0);
  const [overdueCount, setOverdueCount] = useState(0);
  const itemRefs = useRef([]);

  const currentRole = "BloodHealth Admin";
  const isAdmin = currentRole.includes("Admin");
  const visibleSettings = SETTINGS_ITEMS.filter((item) => !item.adminOnly || isAdmin);

  const computeOverdue = () => {
    try {
      const now = new Date();
      return getFollowUps().filter(
        (v) => v.status === "Scheduled" && new Date(v.followUpAt) < now
      ).length;
    } catch {
      return 0;
    }
  };

  useEffect(() => {
    setOverdueCount(computeOverdue());
    const handler = () => setOverdueCount(computeOverdue());
    window.addEventListener("follow-ups-updated", handler);
    window.addEventListener("storage", handler);
    return () => {
      window.removeEventListener("follow-ups-updated", handler);
      window.removeEventListener("storage", handler);
    };
  }, []);

  useEffect(() => {
    const closeMenu = (event) => {
      if (!event.target.closest("[data-bloodhealth-menu]")) setOpenMenu(null);
    };
    const onKey = (e) => {
      if (e.key === "Escape") setOpenMenu(null);
    };
    document.addEventListener("click", closeMenu);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("click", closeMenu);
      document.removeEventListener("keydown", onKey);
    };
  }, []);

  useEffect(() => {
    if (openMenu && itemRefs.current[focusedIndex]) {
      itemRefs.current[focusedIndex].focus();
    }
  }, [openMenu, focusedIndex]);

  const getMenuItems = (menu) => {
    if (menu === "reports") return REPORT_ITEMS;
    if (menu === "settings") return visibleSettings.map((s) => s.label);
    if (menu === "profile") return ["Sign out"];
    return [];
  };

  const handleTriggerKey = (e, menu) => {
    if (e.key === "Enter" || e.key === " " || e.key === "ArrowDown") {
      e.preventDefault();
      setOpenMenu(menu);
      setFocusedIndex(0);
    }
  };

  const handleItemKey = (e, menu) => {
    const items = getMenuItems(menu);
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.min(prev + 1, items.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setFocusedIndex((prev) => Math.max(prev - 1, 0));
    } else if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (menu === "settings") {
        const item = visibleSettings[focusedIndex];
        if (item?.label === "Users" && onNavigate) onNavigate("users");
      if (item?.label === "Config" && onNavigate) onNavigate("config");
      }
      setOpenMenu(null);
    }
  };

  const selectItem = (menu, index) => {
    setOpenMenu(null);
    if (menu === "settings") {
      const item = visibleSettings[index];
      if (item?.label === "Users" && onNavigate) onNavigate("users");
      if (item?.label === "Config" && onNavigate) onNavigate("config");
    }
  };

  const fuActive = currentScreen === "followup";

  return (
    <div data-bloodhealth-menu style={{ display: "flex", alignItems: "center", gap: 8, position: "relative" }}>
      {CAN_CLINICAL_NAVIGATION && (
        <button
          type="button"
          aria-current={fuActive ? "page" : undefined}
          onClick={() => onNavigate?.("followup")}
          style={menuButtonStyle(fuActive)}
        >
          <Calendar size={15} strokeWidth={1.7} />
          Follow Up
          {overdueCount > 0 && <span style={badgeStyle}>{overdueCount}</span>}
        </button>
      )}

      <div style={{ position: "relative" }}>
        <button
          type="button"
          aria-expanded={openMenu === "reports"}
          aria-haspopup="menu"
          onClick={() => { setOpenMenu(openMenu === "reports" ? null : "reports"); setFocusedIndex(0); }}
          onKeyDown={(e) => handleTriggerKey(e, "reports")}
          style={menuButtonStyle(openMenu === "reports")}
        >
          <BarChart3 size={15} strokeWidth={1.7} />Reports
          <ChevronDown size={12} style={{ transform: openMenu === "reports" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </button>
        {openMenu === "reports" && (
          <div role="menu" style={{ ...dropdownStyle, width: 176 }}>
            <div style={{ color: "#8A9697", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 12px 5px" }}>Reports</div>
            {REPORT_ITEMS.map((item, i) => (
              <button
                key={item}
                type="button"
                role="menuitem"
                ref={(el) => (itemRefs.current[i] = el)}
                style={itemButtonStyle}
                onClick={() => selectItem("reports", i)}
                onKeyDown={(e) => handleItemKey(e, "reports")}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F8F8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <button
          type="button"
          aria-expanded={openMenu === "settings"}
          aria-haspopup="menu"
          onClick={() => { setOpenMenu(openMenu === "settings" ? null : "settings"); setFocusedIndex(0); }}
          onKeyDown={(e) => handleTriggerKey(e, "settings")}
          style={menuButtonStyle(openMenu === "settings")}
        >
          <Settings size={15} strokeWidth={1.7} />Settings
          <span style={badgeStyle}>2</span>
          <ChevronDown size={12} style={{ transform: openMenu === "settings" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </button>
        {openMenu === "settings" && (
          <div role="menu" style={{ ...dropdownStyle, width: 194 }}>
            <div style={{ color: "#8A9697", fontSize: 10, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.08em", padding: "6px 12px 5px" }}>Feature Sets</div>
            {visibleSettings.map((item, i) => (
              <button
                key={item.label}
                type="button"
                role="menuitem"
                ref={(el) => (itemRefs.current[i] = el)}
                style={itemButtonStyle}
                onClick={() => selectItem("settings", i)}
                onKeyDown={(e) => handleItemKey(e, "settings")}
                onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F8F8"; }}
                onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
              >
                <span>{item.label}</span>
                {item.count && <span style={badgeStyle}>{item.count}</span>}
              </button>
            ))}
          </div>
        )}
      </div>

      <div style={{ position: "relative" }}>
        <button
          type="button"
          aria-expanded={openMenu === "profile"}
          aria-haspopup="menu"
          onClick={() => { setOpenMenu(openMenu === "profile" ? null : "profile"); setFocusedIndex(0); }}
          onKeyDown={(e) => handleTriggerKey(e, "profile")}
          style={{ ...menuButtonStyle(openMenu === "profile"), padding: "4px 6px" }}
        >
          <div style={{ width: 26, height: 26, borderRadius: "50%", display: "grid", placeItems: "center", background: "#E4F1F0", color: "#0D7782", fontSize: 11, fontWeight: 700 }}>TH</div>
          <div style={{ textAlign: "left", lineHeight: 1.2 }}>
            <div style={{ fontWeight: 700, fontSize: 13 }}>Tiffany Hall</div>
            <div style={{ color: "#7A8788", fontSize: 11 }}>{currentRole}</div>
          </div>
          <ChevronDown size={12} style={{ transform: openMenu === "profile" ? "rotate(180deg)" : "none", transition: "transform 0.15s" }} />
        </button>
        {openMenu === "profile" && (
          <div role="menu" style={{ ...dropdownStyle, width: 220 }}>
            <div style={{ padding: "10px 12px" }}>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#273233" }}>Tiffany Hall</div>
              <div style={{ fontSize: 12, color: "#7A8788" }}>{currentRole}</div>
              <div style={{ fontSize: 12, color: "#8A9697", marginTop: 2 }}>tiffany.hall@hc1.com</div>
            </div>
            <div style={{ height: 1, background: "#E2E8E8", margin: "4px 0" }} />
            <button
              type="button"
              role="menuitem"
              ref={(el) => (itemRefs.current[0] = el)}
              style={{ ...itemButtonStyle, gap: 8 }}
              onClick={() => setOpenMenu(null)}
              onKeyDown={(e) => handleItemKey(e, "profile")}
              onMouseEnter={(e) => { e.currentTarget.style.background = "#F5F8F8"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              <span style={{ display: "inline-flex", alignItems: "center", gap: 8 }}><LogOut size={14} strokeWidth={1.7} />Sign out</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
