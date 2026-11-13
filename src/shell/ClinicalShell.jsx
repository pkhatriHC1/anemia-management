import { useEffect, useState } from "react";
import { BarChart3, Briefcase, LogOut, Building2, Calendar, ClipboardList, FlaskConical, GitMerge, Globe2, Settings, SlidersHorizontal, Stethoscope, Users } from "lucide-react";
import { AppShell, Badge, Sidebar } from "@hc1com/design-system";
import { getFollowUps } from "../followup/followUpStore";

/** Settings pages from the original top-bar menu. Only Users and Config have screens so far. */
const SETTINGS_ITEMS = [
  { label: "Lab types mapping", icon: GitMerge, count: 1 },
  { label: "Case types mapping", icon: GitMerge, count: 1 },
  { label: "Facilities", icon: Building2 },
  { label: "Regions", icon: Globe2 },
  { label: "Lab types", icon: FlaskConical },
  { label: "Case types", icon: Stethoscope },
  { label: "Clients", icon: Briefcase },
  { label: "Users", icon: Users, screen: "users" },
  { label: "Config", icon: SlidersHorizontal, screen: "config" },
];

/* Sign out in the prototype reloads the app, which resets the demo data (see main.jsx). */
const USER = {
  name: "Tiffany Hall",
  role: "BloodHealth Admin",
  menu: [{ label: "Sign out", icon: <LogOut />, destructive: true, onSelect: () => window.location.reload() }],
};

function countOverdue() {
  try {
    const now = new Date();
    return getFollowUps().filter(v => v.status === "Scheduled" && new Date(v.followUpAt) < now).length;
  } catch {
    return 0;
  }
}

/** Follow-ups that are past due, kept in sync with the follow-up store. */
export function useOverdueCount() {
  const [count, setCount] = useState(countOverdue);
  useEffect(() => {
    const update = () => setCount(countOverdue());
    window.addEventListener("follow-ups-updated", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("follow-ups-updated", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return count;
}

/**
 * ClinicalIQ app frame: the hc1 top bar and sidebar, the same as SourceIQ and PBM.
 * `screen` is the current screen; `onNavigate(screen)` switches it.
 */
export function ClinicalShell({ screen, onNavigate, onOpenAssistant, children }) {
  const overdue = useOverdueCount();
  const settingsActive = screen === "users" || screen === "config";
  const [settingsOpen, setSettingsOpen] = useState(settingsActive);

  useEffect(() => {
    if (settingsActive) setSettingsOpen(true);
  }, [settingsActive]);

  return (
    <AppShell>
      <AppShell.TopBar
        product={{ name: "ClinicalIQ" }}
        context="Anemia Management"
        assistant={onOpenAssistant ? { onClick: onOpenAssistant } : undefined}
        notifications={{ count: overdue, onClick: () => onNavigate("followup") }}
        user={USER}
      />
      <Sidebar ariaLabel="ClinicalIQ navigation" persistKey="hc1-clinicaliq-sidebar">
        <Sidebar.Header brand="ClinicalIQ" />
        <Sidebar.Section title="Anemia">
          <Sidebar.Item
            icon={<ClipboardList />}
            label="Patient worklist"
            active={screen === "worklist" || screen === "workspace"}
            onClick={() => onNavigate("worklist")}
          />
          <Sidebar.Item
            icon={<Calendar />}
            label="Follow-up visits"
            active={screen === "followup"}
            badge={overdue > 0 ? <Badge variant="danger" appearance="soft" size="xs">{overdue}</Badge> : undefined}
            onClick={() => onNavigate("followup")}
          />
          <Sidebar.Item icon={<BarChart3 />} label="ROI impact" />
        </Sidebar.Section>
        <Sidebar.Section title="Manage">
          <Sidebar.Group
            icon={<Settings />}
            label="Settings"
            active={settingsActive}
            open={settingsOpen}
            onOpenChange={setSettingsOpen}
          >
            {SETTINGS_ITEMS.map(({ icon: Icon, ...item }) => (
              <Sidebar.Item
                key={item.label}
                icon={<Icon />}
                label={item.label}
                active={item.screen ? screen === item.screen : false}
                badge={item.count ? <Badge variant="danger" appearance="soft" size="xs">{item.count}</Badge> : undefined}
                onClick={item.screen ? () => onNavigate(item.screen) : undefined}
              />
            ))}
          </Sidebar.Group>
        </Sidebar.Section>
      </Sidebar>
      <AppShell.Main>{children}</AppShell.Main>
    </AppShell>
  );
}
