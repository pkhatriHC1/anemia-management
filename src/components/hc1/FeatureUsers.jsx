import { useMemo, useState } from "react";
import { ArrowLeft, Save, Check } from "lucide-react";

const STORAGE_KEY = "clinicaliq-feature-users";

const ROLE_GROUPS = [
  { label: "Client Admin", children: ["Contents", "Users", "Settings", "Clinical Navigation", "Reports", "Mappings"] },
  { label: "Read Only", children: [] },
];

const FACILITY_GROUPS = [
  { label: "Test Region", children: ["Test Facility 2", "Test Facility 3", "Test Facility 1"] },
  { label: "Test Region 2", children: [] },
  { label: "Test Region 3", children: ["Testing North Hospital"] },
];

const initialForm = {
  firstName: "",
  middleName: "",
  lastName: "",
  title: "",
  suffix: "",
  credentials: "",
  clinicalRole: "",
  email: "",
  status: "Active",
};

const inputStyle = {
  width: "100%",
  minHeight: 32,
  border: "1px solid #D7DEDF",
  borderRadius: 5,
  padding: "7px 10px",
  color: "#273233",
  background: "#fff",
  fontFamily: "inherit",
  fontSize: 13,
  outline: "none",
};

const labelStyle = {
  display: "block",
  color: "#5E6C6D",
  fontSize: 10,
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  marginBottom: 5,
};

const Card = ({ title, children }) => (
  <section style={{ background: "#fff", border: "1px solid #DDE3E4", borderRadius: 10, padding: "16px 14px 18px" }}>
    <h2 style={{ color: "#273233", fontSize: 15, fontWeight: 700, margin: "0 0 13px" }}>{title}</h2>
    {children}
  </section>
);

const TreeCheckboxes = ({ groups, selected, onChange }) => {
  const toggle = (value) => {
    const next = selected.includes(value) ? selected.filter((item) => item !== value) : [...selected, value];
    onChange(next);
  };

  const toggleGroup = (group) => {
    const values = [group.label, ...group.children];
    const isSelected = values.every((value) => selected.includes(value));
    onChange(isSelected ? selected.filter((value) => !values.includes(value)) : [...new Set([...selected, ...values])]);
  };

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
      {groups.map((group) => {
        const checked = selected.includes(group.label);
        return (
          <div key={group.label}>
            <label style={{ display: "flex", alignItems: "center", gap: 7, color: "#445253", fontSize: 12, cursor: "pointer", width: "fit-content" }}>
              <input type="checkbox" checked={checked} onChange={() => toggleGroup(group)} />
              {group.label}
            </label>
            {group.children.length > 0 && (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(6, minmax(120px, 1fr))", gap: "8px 28px", margin: "9px 0 0 18px" }}>
                {group.children.map((child) => (
                  <label key={child} style={{ display: "flex", alignItems: "center", gap: 7, color: "#506061", fontSize: 12, cursor: "pointer" }}>
                    <input type="checkbox" checked={selected.includes(child)} onChange={() => toggle(child)} />
                    {child}
                  </label>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};

export const FeatureUsers = ({ onBack, editingUser }) => {
  const [form, setForm] = useState(() => editingUser ? { ...initialForm, ...editingUser } : initialForm);
  const [roles, setRoles] = useState(editingUser?.roles || []);
  const [facilities, setFacilities] = useState(editingUser?.facilities || []);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const update = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }));
    setSaved(false);
    setError("");
  };

  const fullName = useMemo(() => [form.firstName, form.middleName, form.lastName].filter(Boolean).join(" "), [form]);

  const saveUser = () => {
    const missing = [];
    if (!form.firstName.trim()) missing.push("First Name");
    if (!form.lastName.trim()) missing.push("Last Name");
    if (!form.email.trim()) missing.push("Email");
    if (!form.credentials.trim()) missing.push("Credentials");
    if (!form.clinicalRole.trim()) missing.push("Clinical Role");
    if (missing.length > 0) {
      setError(`${missing.join(", ")} ${missing.length > 1 ? "are" : "is"} required.`);
      return;
    }
    const existing = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "[]");
    if (editingUser) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(existing.map((u) => u.id === editingUser.id ? { ...form, roles, facilities, id: editingUser.id, createdAt: editingUser.createdAt } : u)));
    } else {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify([...existing, { ...form, roles, facilities, id: crypto.randomUUID(), createdAt: new Date().toISOString() }]));
    }
    setSaved(true);
  };

  return (
    <div style={{ minHeight: "100dvh", overflowY: "auto", background: "#F7F8F8", color: "#273233", fontFamily: "var(--hc-font-sans)" }}>
      <header style={{ height: 56, display: "flex", alignItems: "center", gap: 10, padding: "0 12px", background: "#fff", borderBottom: "1px solid #DDE3E4", position: "sticky", top: 0, zIndex: 5 }}>
        <button type="button" aria-label="Back to feature sets" onClick={onBack} style={{ width: 27, height: 27, display: "grid", placeItems: "center", border: "1px solid #D7DEDF", borderRadius: 6, background: "#fff", color: "#526263", cursor: "pointer" }}><ArrowLeft size={15} /></button>
        <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>{editingUser ? "Edit User" : "Create User"}</h1>
        <button type="button" onClick={saveUser} style={{ marginLeft: "auto", display: "inline-flex", alignItems: "center", gap: 5, border: 0, borderRadius: 6, padding: "7px 11px", background: saved ? "#5E9E9A" : "#8AB9C2", color: "#fff", fontFamily: "inherit", fontSize: 12, fontWeight: 600, cursor: "pointer" }}><Save size={13} />{saved ? "User Saved" : "Save User"}</button>
      </header>

      <main style={{ padding: "14px 10px 28px", maxWidth: 1540, margin: "0 auto" }}>
        <Card title="User Information">
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0, 1fr))", gap: "14px 12px" }}>
            {[["firstName", "First Name *", "First Name"], ["middleName", "Middle Name", "Middle Name"], ["lastName", "Last Name *", "Last Name"], ["title", "Title", "Title"], ["suffix", "Suffix", "Suffix"], ["credentials", "Credentials *", "Credentials"]].map(([field, label, placeholder]) => (
              <label key={field} style={{ display: "block" }}><span style={labelStyle}>{label}</span><input value={form[field]} onChange={(event) => update(field, event.target.value)} placeholder={placeholder} style={inputStyle} /></label>
            ))}
          </div>

          {/* Clinical Role — required, manual entry */}
          <label style={{ display: "block", marginTop: 14 }}><span style={labelStyle}>Clinical Role *</span><input value={form.clinicalRole} onChange={(event) => update("clinicalRole", event.target.value)} placeholder="Clinical Role" style={inputStyle} /></label>

          <label style={{ display: "block", marginTop: 14 }}><span style={labelStyle}>Email *</span><input type="email" value={form.email} onChange={(event) => update("email", event.target.value)} placeholder="Email" style={inputStyle} /></label>
          <label style={{ display: "block", marginTop: 14 }}><span style={labelStyle}>Status *</span><select value={form.status} onChange={(event) => update("status", event.target.value)} style={inputStyle}><option>Active</option><option>Inactive</option></select></label>
        </Card>

        <div style={{ height: 14 }} />
        <Card title="User Roles">
          <TreeCheckboxes groups={ROLE_GROUPS} selected={roles} onChange={setRoles} />
        </Card>

        <div style={{ height: 14 }} />
        <Card title="User Facilities">
          <TreeCheckboxes groups={FACILITY_GROUPS} selected={facilities} onChange={setFacilities} />
        </Card>

        <div style={{ height: 14 }} />
        <Card title="Email Preferences">
          <label style={{ display: "flex", alignItems: "center", gap: 7, color: "#506061", fontSize: 12, cursor: "pointer" }}><input type="checkbox" />Notification Opt Out</label>
        </Card>

        {error && <div role="alert" style={{ marginTop: 14, border: "1px solid #E5AAB5", background: "#F9E3E7", color: "#A5213C", borderRadius: 7, padding: "9px 12px", fontSize: 13 }}>{error}</div>}
        {saved && <div style={{ display: "flex", alignItems: "center", gap: 7, marginTop: 14, color: "#2E7028", fontSize: 13 }}><Check size={15} />{fullName || "User"} was saved to the shared user directory.</div>}
      </main>
    </div>
  );
};
