import { useEffect, useState } from "react";
import { ArrowLeft, Plus, Save, Trash2, Check } from "lucide-react";
import {
  getEpicPools,
  saveEpicPool,
  togglePoolActive,
  deleteEpicPool,
} from "./notifyStores";

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
  primary: { 100: "#ECF4F5", 500: "#0D7782", 600: "#0B626B" },
  secondary: { 100: "#E1F3F5", 500: "#3CA6B0" },
  orange: { 100: "#FFEFE0", 400: "#F58126" },
  error: { 100: "#F4DFE4", 400: "#B00A2F" },
  success: { 100: "#D7E7D6", 400: "#388032" },
};

const font = "var(--hc-font-sans)";

const inputStyle = {
  width: "100%",
  boxSizing: "border-box",
  border: `1px solid ${C.grey[300]}`,
  borderRadius: 6,
  padding: "8px 12px",
  fontSize: 14,
  fontFamily: font,
  color: C.grey[800],
  outline: "none",
  background: "#fff",
};

const labelStyle = {
  display: "block",
  fontSize: 12,
  fontWeight: 700,
  color: C.grey[600],
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  marginBottom: 5,
};

export const EpicPoolConfig = ({ onBack }) => {
  const [pools, setPools] = useState(() => getEpicPools());
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", poolId: "", active: true });
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const refresh = () => setPools(getEpicPools());
    window.addEventListener("epic-pools-updated", refresh);
    return () => window.removeEventListener("epic-pools-updated", refresh);
  }, []);

  const startAdd = () => {
    setEditing({ isNew: true });
    setForm({ name: "", poolId: "", active: true });
    setSaved(false);
    setError("");
  };

  const startEdit = (pool) => {
    setEditing(pool);
    setForm({ name: pool.name, poolId: pool.poolId, active: pool.active });
    setSaved(false);
    setError("");
  };

  const cancelEdit = () => {
    setEditing(null);
    setSaved(false);
    setError("");
  };

  const handleSave = () => {
    if (!form.name.trim() || !form.poolId.trim()) {
      setError("Pool name and Epic pool ID are required.");
      return;
    }
    const dup = pools.find(
      (p) =>
        p.poolId.toLowerCase() === form.poolId.trim().toLowerCase() &&
        p.id !== editing?.id
    );
    if (dup) {
      setError(`A pool with ID "${form.poolId.trim()}" already exists.`);
      return;
    }
    saveEpicPool({ id: editing?.isNew ? undefined : editing?.id, name: form.name.trim(), poolId: form.poolId.trim(), active: form.active });
    setPools(getEpicPools());
    setEditing(null);
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleToggle = (id) => {
    togglePoolActive(id);
    setPools(getEpicPools());
  };

  const handleDelete = (id) => {
    deleteEpicPool(id);
    setPools(getEpicPools());
    if (editing?.id === id) setEditing(null);
  };

  const isEditingRow = (pool) => editing && !editing.isNew && editing.id === pool.id;

  return (
    <div style={{ minHeight: "100dvh", overflowY: "auto", background: C.grey[200], fontFamily: font, color: C.grey[800] }}>
      <header style={{ height: 56, flexShrink: 0, display: "flex", alignItems: "center", gap: 10, padding: "0 20px", background: C.grey[100], borderBottom: `1px solid ${C.grey[300]}`, position: "sticky", top: 0, zIndex: 5 }}>
        <button type="button" aria-label="Back" onClick={onBack} style={{ width: 30, height: 30, display: "grid", placeItems: "center", border: `1px solid ${C.grey[300]}`, borderRadius: 6, background: "#fff", color: C.grey[600], cursor: "pointer" }}><ArrowLeft size={16} /></button>
        <h1 style={{ fontSize: 16, fontWeight: 700, margin: 0 }}>Client Configuration · Epic Message Pools</h1>
      </header>

      <main style={{ padding: "20px", maxWidth: 820, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
          <div>
            <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 2 }}>Custom Epic Message Pools</div>
            <div style={{ fontSize: 14, color: C.grey[500] }}>Add, edit, and deactivate pools that appear as recipient options in the Notify step.</div>
          </div>
          <button type="button" onClick={startAdd} style={{ display: "inline-flex", alignItems: "center", gap: 6, border: 0, borderRadius: 6, padding: "8px 14px", background: C.primary[500], color: "#fff", fontFamily: font, fontSize: 14, fontWeight: 600, cursor: "pointer" }}><Plus size={15} />Add Pool</button>
        </div>

        {saved && <div role="status" style={{ display: "flex", alignItems: "center", gap: 7, marginBottom: 14, padding: "10px 14px", background: C.success[100], border: `1px solid ${C.success[400]}55`, borderRadius: 8, fontSize: 14, color: C.success[400] }}><Check size={15} />Pool saved successfully.</div>}
        {error && editing?.isNew && <div role="alert" style={{ marginBottom: 14, padding: "10px 14px", background: C.error[100], border: `1px solid ${C.error[400]}55`, borderRadius: 8, fontSize: 14, color: C.error[400] }}>{error}</div>}

        {/* New pool form */}
        {editing?.isNew && (
          <div style={{ background: "#fff", border: `1px solid ${C.primary[500]}44`, borderRadius: 10, padding: 16, marginBottom: 14 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, color: C.primary[600] }}>New Message Pool</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
              <label><span style={labelStyle}>Pool Name *</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="e.g. Anemia Optimization" style={inputStyle} /></label>
              <label><span style={labelStyle}>Epic Pool ID *</span><input value={form.poolId} onChange={(e) => setForm({ ...form, poolId: e.target.value })} placeholder="e.g. ANEMIA-OPT" style={inputStyle} /></label>
            </div>
            <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 12, fontSize: 14, color: C.grey[700], cursor: "pointer" }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Active</label>
            <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
              <button type="button" onClick={handleSave} style={{ display: "inline-flex", alignItems: "center", gap: 5, border: 0, borderRadius: 6, padding: "7px 14px", background: C.primary[500], color: "#fff", fontFamily: font, fontSize: 14, fontWeight: 600, cursor: "pointer" }}><Save size={14} />Save Pool</button>
              <button type="button" onClick={cancelEdit} style={{ border: `1px solid ${C.grey[300]}`, borderRadius: 6, padding: "7px 14px", background: "#fff", color: C.grey[600], fontFamily: font, fontSize: 14, cursor: "pointer" }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Pool list */}
        <div style={{ background: "#fff", border: `1px solid ${C.grey[300]}`, borderRadius: 10, overflow: "hidden" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 120px", padding: "10px 16px", background: C.grey[200], borderBottom: `1px solid ${C.grey[300]}`, fontSize: 12, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: C.grey[600] }}>
            <span>Pool Name</span><span>Epic Pool ID</span><span>Status</span><span style={{ textAlign: "right" }}>Actions</span>
          </div>
          {pools.length === 0 && <div style={{ padding: 24, textAlign: "center", fontSize: 14, color: C.grey[500] }}>No pools configured. Click "Add Pool" to create one.</div>}
          {pools.map((pool) => (
            <div key={pool.id} style={{ borderBottom: `0.5px solid ${C.grey[300]}` }}>
              {isEditingRow(pool) ? (
                <div style={{ padding: 16, background: C.primary[100] }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14, marginBottom: 12 }}>
                    <label><span style={labelStyle}>Pool Name *</span><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={inputStyle} /></label>
                    <label><span style={labelStyle}>Epic Pool ID *</span><input value={form.poolId} onChange={(e) => setForm({ ...form, poolId: e.target.value })} style={inputStyle} /></label>
                  </div>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 14, color: C.grey[700], cursor: "pointer", marginBottom: 12 }}><input type="checkbox" checked={form.active} onChange={(e) => setForm({ ...form, active: e.target.checked })} />Active</label>
                  {error && !editing?.isNew && <div role="alert" style={{ marginBottom: 10, padding: "8px 12px", background: C.error[100], border: `1px solid ${C.error[400]}55`, borderRadius: 6, fontSize: 13, color: C.error[400] }}>{error}</div>}
                  <div style={{ display: "flex", gap: 8 }}>
                    <button type="button" onClick={handleSave} style={{ display: "inline-flex", alignItems: "center", gap: 5, border: 0, borderRadius: 6, padding: "6px 12px", background: C.primary[500], color: "#fff", fontFamily: font, fontSize: 13, fontWeight: 600, cursor: "pointer" }}><Save size={13} />Save</button>
                    <button type="button" onClick={cancelEdit} style={{ border: `1px solid ${C.grey[300]}`, borderRadius: 6, padding: "6px 12px", background: "#fff", color: C.grey[600], fontFamily: font, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  </div>
                </div>
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 100px 120px", padding: "12px 16px", alignItems: "center", fontSize: 14, color: C.grey[700] }}>
                  <span style={{ fontWeight: 600, color: C.grey[800] }}>{pool.name}</span>
                  <span style={{ fontFamily: "var(--hc-font-mono, monospace)", fontSize: 13, color: C.grey[600] }}>{pool.poolId}</span>
                  <span>
                    <button type="button" onClick={() => handleToggle(pool.id)} style={{ display: "inline-flex", alignItems: "center", gap: 5, border: `1px solid ${pool.active ? C.success[400] : C.grey[400]}`, borderRadius: 999, padding: "3px 10px", fontSize: 12, fontWeight: 600, background: pool.active ? C.success[100] : C.grey[200], color: pool.active ? C.success[400] : C.grey[500], cursor: "pointer", fontFamily: font }}>
                      <span style={{ width: 6, height: 6, borderRadius: "50%", background: pool.active ? C.success[400] : C.grey[400] }} />{pool.active ? "Active" : "Inactive"}
                    </button>
                  </span>
                  <span style={{ display: "flex", justifyContent: "flex-end", gap: 6 }}>
                    <button type="button" onClick={() => startEdit(pool)} style={{ border: `1px solid ${C.grey[300]}`, borderRadius: 5, padding: "4px 10px", background: "#fff", color: C.grey[600], fontFamily: font, fontSize: 12, cursor: "pointer" }}>Edit</button>
                    <button type="button" onClick={() => handleDelete(pool.id)} aria-label="Delete pool" style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 28, height: 28, border: `1px solid ${C.error[400]}44`, borderRadius: 5, background: C.error[100], color: C.error[400], cursor: "pointer" }}><Trash2 size={13} /></button>
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>

        <div style={{ marginTop: 16, fontSize: 13, color: C.grey[500], lineHeight: 1.5 }}>
          Active pools appear as selectable options in the Notify step's Epic Message Pool dropdown.
          Deactivated pools are hidden from the Notify step but remain in the audit history.
        </div>
      </main>
    </div>
  );
};
