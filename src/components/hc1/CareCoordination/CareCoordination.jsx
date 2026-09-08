import { useEffect, useMemo, useState } from "react";
import { AlertCircle, CircleAlert, MessageCircle, Pencil, Reply, Send, Trash2, X } from "lucide-react";
import { Button } from "../Button";

const ROLES = ["Care Coordinator", "Case Manager", "Provider", "Nurse", "Social Worker"];
const PRIORITIES = ["Routine", "Urgent", "Critical"];
const PRIORITY_META = {
  Routine: { color: "#3B7F83", background: "#E4F1F0", border: "#6AA7A6" },
  Urgent: { color: "#A65A00", background: "#FFF0DF", border: "#F0A14A" },
  Critical: { color: "#A5213C", background: "#F9E3E7", border: "#D66A7C" },
};
const STORAGE_KEY = "clinicaliq-care-coordination";
const SAMPLE_MESSAGES = {
  "DM-5521": [
    { id: "sample-1", senderName: "Dr. Patel", senderRole: "Provider", text: "Please confirm pre-op Hgb target is met before surgery. Reschedule if Hgb < 11 g/dL.", priority: "Urgent", createdAt: "2026-04-09T09:46:00", editedAt: null, parentId: null, isRead: false },
    { id: "sample-2", senderName: "Sarah Mitchell", senderRole: "Care Coordinator", text: "IV iron infusion scheduled for Thursday 2pm at infusion center. Patient confirmed and transport arranged.", priority: "Routine", createdAt: "2026-04-09T09:40:00", editedAt: null, parentId: null, isRead: true },
  ],
};

const readStore = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : SAMPLE_MESSAGES;
  } catch {
    return SAMPLE_MESSAGES;
  }
};

const formatTimestamp = (value) => new Intl.DateTimeFormat("en-US", {
  month: "short", day: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit",
}).format(new Date(value));

const PriorityChip = ({ priority }) => {
  const meta = PRIORITY_META[priority];
  return <span style={{ color: meta.color, background: meta.background, border: `1px solid ${meta.border}`, borderRadius: 999, padding: "3px 8px", fontSize: 11, fontWeight: 700, letterSpacing: "0.04em", textTransform: "uppercase" }}>{priority}</span>;
};

const MessageCard = ({ message, currentName, onReply, onEdit, onDelete }) => {
  const meta = PRIORITY_META[message.priority];
  const isMine = message.senderName === currentName.trim() && currentName.trim();
  return (
    <article style={{ background: "#fff", border: "1px solid #DDE3E4", borderLeft: `3px solid ${meta.border}`, borderRadius: "10px 10px 8px 8px", padding: "11px 14px", boxShadow: "0 1px 4px rgba(20,54,58,0.05)" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, background: meta.background, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{message.senderName.charAt(0).toUpperCase()}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 7, flexWrap: "wrap" }}>
            <strong style={{ color: "#273233", fontSize: 14 }}>{message.senderName}</strong>
            <span style={{ color: "#737E7F", fontSize: 12 }}>{message.senderRole}</span>
          </div>
          <p style={{ color: "#3E4B4C", fontSize: 14, lineHeight: 1.55, margin: "5px 0 0", whiteSpace: "pre-wrap" }}>{message.text}</p>
          {message.parentId && <div style={{ color: "#0D7782", fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 4 }}><Reply size={12} /> Reply to previous communication</div>}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}><PriorityChip priority={message.priority} /><div style={{ color: "#8B9697", fontSize: 11, marginTop: 6 }}>{formatTimestamp(message.editedAt || message.createdAt)}{message.editedAt && " · edited"}</div></div>
        </div>
      </div>
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 5 }}>
        <Button variant="icon" size="xs" aria-label="Reply to message" onClick={() => onReply(message)}><Reply size={13} /></Button>
        {isMine && <><Button variant="icon" size="xs" aria-label="Edit message" onClick={() => onEdit(message)}><Pencil size={13} /></Button><Button variant="icon" size="xs" aria-label="Delete message" onClick={() => onDelete(message)}><Trash2 size={13} /></Button></>}
      </div>
    </article>
  );
};

export const getPendingCount = (patientId) => {
  const store = readStore();
  return (store[patientId] || []).filter((message) => !message.isRead && !message.deletedAt).length;
};

export const CareCoordination = ({ patient }) => {
  const [store, setStore] = useState(readStore);
  const [name, setName] = useState("Care Coordinator");
  const [role, setRole] = useState("Care Coordinator");
  const [priority, setPriority] = useState("Routine");
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");

  const messages = useMemo(() => [...(store[patient.id] || [])].filter((message) => !message.deletedAt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)), [store, patient.id]);
  const canSend = Boolean(name.trim() && role && draft.trim());
  const saveStore = (nextStore) => { setStore(nextStore); window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStore)); window.dispatchEvent(new Event("care-coordination-updated")); };

  useEffect(() => {
    const nextStore = { ...store, [patient.id]: (store[patient.id] || []).map((message) => ({ ...message, isRead: true })) };
    if ((store[patient.id] || []).some((message) => !message.isRead)) saveStore(nextStore);
  }, [patient.id]);

  const sendMessage = () => {
    if (!canSend) return;
    const nextMessage = { id: crypto.randomUUID(), senderName: name.trim(), senderRole: role, text: draft.trim(), priority, createdAt: new Date().toISOString(), editedAt: null, parentId: replyTo?.id || null, isRead: false };
    saveStore({ ...store, [patient.id]: [...(store[patient.id] || []), nextMessage] });
    setDraft(""); setReplyTo(null);
  };

  const saveEdit = (message) => {
    if (!editingText.trim()) return;
    saveStore({ ...store, [patient.id]: (store[patient.id] || []).map((item) => item.id === message.id ? { ...item, text: editingText.trim(), editedAt: new Date().toISOString() } : item) });
    setEditingId(null); setEditingText("");
  };

  const deleteMessage = (message) => {
    if (window.confirm("Delete this care coordination message?")) saveStore({ ...store, [patient.id]: (store[patient.id] || []).map((item) => item.id === message.id ? { ...item, deletedAt: new Date().toISOString() } : item) });
  };

  const hgb = patient.labs.find((lab) => lab.label === "HGB");
  return (
    <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "12px 16px 16px", background: "#F7FAFA" }}>
      <div style={{ background: "#073C49", color: "#fff", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <MessageCircle size={18} />
        <div style={{ flex: 1 }}><div style={{ fontSize: 16, fontWeight: 700 }}>Care Coordination Channel</div><div style={{ fontSize: 12, color: "#C6E3E5", marginTop: 3 }}>{patient.name} · MRN {patient.id} · BloodHealth Co-Pilot</div></div>
        <div style={{ display: "flex", gap: 6 }}>{PRIORITIES.map((item) => <button key={item} type="button" onClick={() => setPriority(item)} style={{ border: priority === item ? "2px solid #fff" : "1px solid rgba(255,255,255,0.35)", borderRadius: 999, padding: "4px 8px", background: PRIORITY_META[item].background, color: PRIORITY_META[item].color, fontSize: 10, fontWeight: 700, cursor: "pointer" }}>{item}</button>)}</div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 10 }}>
        <label style={{ color: "#546365", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Your Name<input value={name} onChange={(event) => setName(event.target.value)} placeholder="Enter your name" style={{ display: "block", width: "100%", marginTop: 5, border: "1px solid #CFD8D9", borderRadius: 7, padding: "8px 10px", color: "#273233", background: "#fff", fontSize: 14 }} /></label>
        <label style={{ color: "#546365", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase" }}>Role<select value={role} onChange={(event) => setRole(event.target.value)} style={{ display: "block", width: "100%", marginTop: 5, border: "1px solid #CFD8D9", borderRadius: 7, padding: "8px 10px", color: "#273233", background: "#fff", fontSize: 14 }}>{ROLES.map((item) => <option key={item}>{item}</option>)}</select></label>
      </div>

      <div style={{ background: "#F5F8F9", border: "1px solid #E0E8E9", borderRadius: 10, padding: 8, minHeight: 245, display: "flex", flexDirection: "column", gap: 8 }}>{messages.map((message) => editingId === message.id ? <div key={message.id} style={{ background: "#fff", border: `1px solid ${PRIORITY_META[message.priority].border}`, borderRadius: 9, padding: 10 }}><textarea value={editingText} onChange={(event) => setEditingText(event.target.value)} rows={3} style={{ width: "100%", resize: "vertical", border: "1px solid #CFD8D9", borderRadius: 6, padding: 8, fontFamily: "inherit", color: "#273233" }} /><div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 7 }}><Button variant="secondary" size="sm" onClick={() => setEditingId(null)}>Cancel</Button><Button variant="primary" size="sm" onClick={() => saveEdit(message)}>Save Edit</Button></div></div> : <MessageCard key={message.id} message={message} currentName={name} onReply={setReplyTo} onEdit={(item) => { setEditingId(item.id); setEditingText(item.text); }} onDelete={deleteMessage} />)}{messages.length === 0 && <div style={{ display: "grid", placeItems: "center", flex: 1, color: "#7B898A", fontSize: 14 }}>No care coordination messages yet.</div>}</div>

      <div style={{ marginTop: 10, background: "#fff", border: "1px solid #DDE3E4", borderRadius: 10, padding: 10 }}>
        {replyTo && <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0D7782", fontSize: 12, background: "#EAF5F5", borderRadius: 6, padding: "6px 8px", marginBottom: 7 }}>Replying to {replyTo.senderName}<button type="button" onClick={() => setReplyTo(null)} aria-label="Cancel reply" style={{ marginLeft: "auto", border: 0, background: "transparent", cursor: "pointer", color: "#0D7782" }}><X size={14} /></button></div>}
        <textarea value={draft} onChange={(event) => setDraft(event.target.value)} onKeyDown={(event) => { if (event.key === "Enter" && event.ctrlKey) sendMessage(); }} placeholder={`Add a care coordination note for ${patient.name}... (Ctrl+Enter to send)`} rows={3} style={{ width: "100%", boxSizing: "border-box", border: 0, outline: 0, resize: "vertical", fontFamily: "inherit", color: "#273233", fontSize: 14 }} />
        <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid #EEF2F2", paddingTop: 8, gap: 8 }}><span style={{ color: "#697879", fontSize: 12 }}>Priority: <strong style={{ color: PRIORITY_META[priority].color }}>{priority}</strong></span><span style={{ color: "#697879", fontSize: 12 }}>· Sending as {name.trim() || "—"} ({role || "—"})</span><Button variant="primary" size="sm" disabled={!canSend} onClick={sendMessage} rightIcon={<Send size={13} />}>Send Message</Button></div>
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: 13, marginTop: 10, padding: "9px 12px", background: "#E7F2F3", border: "1px solid #C7E0E1", borderRadius: 7 }}><CircleAlert size={14} color="#0D7782" /><div style={{ display: "flex", gap: 17, flexWrap: "wrap", color: "#273233", fontSize: 11 }}>{[["Domain", patient.domain], ["Alert", patient.order.split("–")[0].trim()], ["Risk", patient.severity], ["Provider", patient.provider], ["HGB", `${hgb?.value || "—"} ${hgb?.unit || ""}`]].map(([label, value]) => <span key={label}><b style={{ display: "block", color: "#6A7D7E", fontSize: 9, letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</b><strong>{value}</strong></span>)}</div></div>
    </div>
  );
};
