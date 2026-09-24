import { useEffect, useMemo, useState } from "react";
import { MessageCircle, Pencil, Reply, Send, Trash2, X, Check } from "lucide-react";
import { Button } from "../Button";

const PRIORITIES = ["Routine", "Urgent", "Critical"];
const PRIORITY_META = {
  Routine: { color: "#3B7F83", background: "#E4F1F0", border: "#6AA7A6" },
  Urgent: { color: "#A65A00", background: "#FFF0DF", border: "#F0A14A" },
  Critical: { color: "#A5213C", background: "#F9E3E7", border: "#D66A7C" },
};

// AC3: Auto-populated sender profile — configured once, not manually entered.
const CURRENT_USER = {
  name: "Sarah Smith",
  credential: "RN",
  role: "Care Coordinator",
};

const STORAGE_KEY = "clinicaliq-care-coordination";
const SAMPLE_MESSAGES = {
  "DM-5521": [
    { id: "sample-1", senderName: "Dr. Patel", senderCredential: "MD", senderRole: "Provider", text: "Please confirm pre-op Hgb target is met before surgery. Reschedule if Hgb < 11 g/dL.", priority: "Urgent", createdAt: "2026-04-09T09:46:00", editedAt: null, parentId: null, isRead: false, isResolved: false, deletedAt: null },
    { id: "sample-2", senderName: "Sarah Smith", senderCredential: "RN", senderRole: "Care Coordinator", text: "IV iron infusion scheduled for Thursday 2pm at infusion center. Patient confirmed and transport arranged.", priority: "Routine", createdAt: "2026-04-09T09:40:00", editedAt: null, parentId: null, isRead: true, isResolved: false, deletedAt: null },
  ],
  "CM-8834": [
    { id: "sample-3", senderName: "Dr. Nguyen", senderCredential: "MD", senderRole: "Provider", text: "Rapid response triggered — Hgb dropped 2.4 g/dL in 24h. Please coordinate transfusion evaluation immediately.", priority: "Critical", createdAt: "2026-04-09T08:15:00", editedAt: null, parentId: null, isRead: false, isResolved: false, deletedAt: null },
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

const MessageCard = ({ message, currentName, onReply, onEdit, onDelete, onResolve, parentMessage }) => {
  const meta = PRIORITY_META[message.priority];
  // AC10/AC11: Only the current user can edit/delete their own messages
  const isMine = message.senderName === currentName;
  // AC12: Resolved messages get muted styling + checkmark indicator
  const resolvedStyle = message.isResolved ? { opacity: 0.6 } : {};
  return (
    <article style={{ ...{ background: "#fff", border: "1px solid #DDE3E4", borderLeft: `3px solid ${meta.border}`, borderRadius: "10px 10px 8px 8px", padding: "11px 14px", boxShadow: "0 1px 4px rgba(20,54,58,0.05)" }, ...resolvedStyle }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <div style={{ width: 28, height: 28, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: meta.color, background: meta.background, fontSize: 13, fontWeight: 700, flexShrink: 0 }}>{message.senderName.charAt(0).toUpperCase()}</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: 7, flexWrap: "wrap" }}>
            <strong style={{ color: "#273233", fontSize: 14 }}>{message.senderName}{message.senderCredential ? `, ${message.senderCredential}` : ""}</strong>
            {message.senderRole && <span style={{ color: "#737E7F", fontSize: 12 }}>{message.senderRole}</span>}
            {/* AC12: Resolved indicator */}
            {message.isResolved && <span style={{ display: "inline-flex", alignItems: "center", gap: 3, color: "#388032", fontSize: 11, fontWeight: 700, background: "#D7E7D6", borderRadius: 999, padding: "2px 7px" }}><Check size={11} strokeWidth={2.5}/>Resolved</span>}
          </div>
          <p style={{ color: "#3E4B4C", fontSize: 14, lineHeight: 1.55, margin: "5px 0 0", whiteSpace: "pre-wrap" }}>{message.text}</p>
          {/* AC9: Visual link back to the original message */}
          {message.parentId && parentMessage && (
            <div style={{ color: "#0D7782", fontSize: 12, marginTop: 6, display: "flex", alignItems: "center", gap: 4, background: "#EAF5F5", borderRadius: 6, padding: "4px 8px" }}>
              <Reply size={12} />
              <span>Reply to {parentMessage.senderName}: "{parentMessage.text.length > 60 ? parentMessage.text.slice(0, 60) + "…" : parentMessage.text}"</span>
            </div>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 12, flexShrink: 0 }}>
          <div style={{ textAlign: "right" }}>
            <PriorityChip priority={message.priority} />
            <div style={{ color: "#8B9697", fontSize: 11, marginTop: 6 }}>{formatTimestamp(message.editedAt || message.createdAt)}{message.editedAt && " · edited"}</div>
          </div>
        </div>
      </div>
      {/* AC9/AC10/AC11/AC12: Action row — reply, resolve, edit (own only), delete (own only) */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 2, marginTop: 5 }}>
        <Button variant="icon" size="xs" aria-label="Reply to message" onClick={() => onReply(message)}><Reply size={13} /></Button>
        {/* AC12: Resolve icon positioned after reply */}
        <Button variant="icon" size="xs" aria-label={message.isResolved ? "Unresolve message" : "Resolve message"} onClick={() => onResolve(message)}>
          {message.isResolved ? <span style={{ fontSize: 13, color: "#388032" }}>↩</span> : <Check size={13} />}
        </Button>
        {isMine && <Button variant="icon" size="xs" aria-label="Edit message" onClick={() => onEdit(message)}><Pencil size={13} /></Button>}
        {isMine && <Button variant="icon" size="xs" aria-label="Delete message" onClick={() => onDelete(message)}><Trash2 size={13} /></Button>}
      </div>
    </article>
  );
};

// AC7: Pending count = unread + unresolved + not deleted messages
export const getPendingCount = (patientId) => {
  const store = readStore();
  return (store[patientId] || []).filter((m) => !m.isRead && !m.deletedAt && !m.isResolved).length;
};

export const CareCoordination = ({ patient }) => {
  const [store, setStore] = useState(readStore);
  // AC3: Sender name/credential/role auto-populated from configured profile — no manual entry
  const user = CURRENT_USER;
  // AC4: Priority selector inside the compose box
  const [priority, setPriority] = useState("Routine");
  // AC2: Priority filter in header
  const [filterPriority, setFilterPriority] = useState("All");
  const [draft, setDraft] = useState("");
  const [replyTo, setReplyTo] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [editingText, setEditingText] = useState("");
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);

  const allMessages = useMemo(
    () => [...(store[patient.id] || [])].filter((m) => !m.deletedAt).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)),
    [store, patient.id]
  );

  // AC2/AC5: Filter by priority when a filter is selected
  const messages = useMemo(() => {
    if (filterPriority === "All") return allMessages;
    return allMessages.filter((m) => m.priority === filterPriority);
  }, [allMessages, filterPriority]);

  // AC13: Lookup map for parent messages (for reply visual links)
  const messageMap = useMemo(() => {
    const map = {};
    (store[patient.id] || []).forEach((m) => { map[m.id] = m; });
    return map;
  }, [store, patient.id]);

  const canSend = Boolean(draft.trim());

  const saveStore = (nextStore) => {
    setStore(nextStore);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(nextStore));
    window.dispatchEvent(new Event("care-coordination-updated"));
  };

  // AC7: Mark messages as read when the channel is opened
  useEffect(() => {
    const patientMessages = store[patient.id] || [];
    if (patientMessages.some((m) => !m.isRead && !m.deletedAt)) {
      saveStore({ ...store, [patient.id]: patientMessages.map((m) => ({ ...m, isRead: true })) });
    }
  }, [patient.id]);

  // AC4: Send message with priority, sender info, and reply link
  const sendMessage = () => {
    if (!canSend) return;
    const nextMessage = {
      id: crypto.randomUUID(),
      senderName: user.name,
      senderCredential: user.credential,
      senderRole: user.role,
      text: draft.trim(),
      priority,
      createdAt: new Date().toISOString(),
      editedAt: null,
      parentId: replyTo?.id || null,
      isRead: true,
      isResolved: false,
      deletedAt: null,
    };
    saveStore({ ...store, [patient.id]: [...(store[patient.id] || []), nextMessage] });
    setDraft("");
    setReplyTo(null);
  };

  // AC10: Save inline edit — updates text and sets edited indicator + timestamp
  const saveEdit = (message) => {
    if (!editingText.trim()) return;
    saveStore({
      ...store,
      [patient.id]: (store[patient.id] || []).map((item) =>
        item.id === message.id ? { ...item, text: editingText.trim(), editedAt: new Date().toISOString() } : item
      ),
    });
    setEditingId(null);
    setEditingText("");
  };

  // AC11: Delete with confirmation prompt
  const deleteMessage = (message) => {
    setConfirmDeleteId(message.id);
  };

  const confirmDelete = () => {
    saveStore({
      ...store,
      [patient.id]: (store[patient.id] || []).map((item) =>
        item.id === confirmDeleteId ? { ...item, deletedAt: new Date().toISOString() } : item
      ),
    });
    setConfirmDeleteId(null);
  };

  // AC12: Toggle resolved state
  const toggleResolve = (message) => {
    saveStore({
      ...store,
      [patient.id]: (store[patient.id] || []).map((item) =>
        item.id === message.id ? { ...item, isResolved: !item.isResolved } : item
      ),
    });
  };

  return (
    <div style={{ flex: 1, minHeight: 0, overflow: "auto", padding: "12px 16px 16px", background: "#F7FAFA" }}>
      {/* AC2: Channel header — patient name, MRN, module name, priority filter top-right */}
      <div style={{ background: "#073C49", color: "#fff", borderRadius: 10, padding: "14px 16px", display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
        <MessageCircle size={18} />
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 16, fontWeight: 700 }}>Care Coordination Channel</div>
          <div style={{ fontSize: 12, color: "#C6E3E5", marginTop: 3 }}>{patient.name} · MRN {patient.id} · BloodHealth Co-Pilot</div>
        </div>
        {/* AC2: Priority filter/indicator set top-right */}
        <div style={{ display: "flex", gap: 6 }}>
          {["All", ...PRIORITIES].map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilterPriority(item)}
              style={{
                border: filterPriority === item ? "2px solid #fff" : "1px solid rgba(255,255,255,0.35)",
                borderRadius: 999,
                padding: "4px 10px",
                background: item === "All" ? (filterPriority === "All" ? "rgba(255,255,255,0.15)" : "transparent") : PRIORITY_META[item].background,
                color: item === "All" ? "#fff" : PRIORITY_META[item].color,
                fontSize: 10,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      {/* AC13: Messages sorted most-recent-first */}
      <div style={{ background: "#F5F8F9", border: "1px solid #E0E8E9", borderRadius: 10, padding: 8, minHeight: 245, display: "flex", flexDirection: "column", gap: 8 }}>
        {messages.length === 0 ? (
          <div style={{ display: "grid", placeItems: "center", flex: 1, color: "#7B898A", fontSize: 14 }}>
            {filterPriority !== "All" ? `No ${filterPriority.toLowerCase()} messages.` : "No care coordination messages yet."}
          </div>
        ) : (
          messages.map((message) =>
            editingId === message.id ? (
              <div key={message.id} style={{ background: "#fff", border: `1px solid ${PRIORITY_META[message.priority].border}`, borderRadius: 9, padding: 10 }}>
                <textarea
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                  rows={3}
                  style={{ width: "100%", resize: "vertical", border: "1px solid #CFD8D9", borderRadius: 6, padding: 8, fontFamily: "inherit", color: "#273233" }}
                />
                <div style={{ display: "flex", justifyContent: "flex-end", gap: 6, marginTop: 7 }}>
                  <Button variant="secondary" size="sm" onClick={() => { setEditingId(null); setEditingText(""); }}>Cancel</Button>
                  <Button variant="primary" size="sm" onClick={() => saveEdit(message)}>Save Edit</Button>
                </div>
              </div>
            ) : (
              <MessageCard
                key={message.id}
                message={message}
                currentName={user.name}
                parentMessage={message.parentId ? messageMap[message.parentId] : null}
                onReply={setReplyTo}
                onEdit={(item) => { setEditingId(item.id); setEditingText(item.text); }}
                onDelete={deleteMessage}
                onResolve={toggleResolve}
              />
            )
          )
        )}
      </div>

      {/* AC4: Compose box with priority selector inside */}
      <div style={{ marginTop: 10, background: "#fff", border: "1px solid #DDE3E4", borderRadius: 10, padding: 10 }}>
        {/* AC9: Reply indicator */}
        {replyTo && (
          <div style={{ display: "flex", alignItems: "center", gap: 6, color: "#0D7782", fontSize: 12, background: "#EAF5F5", borderRadius: 6, padding: "6px 8px", marginBottom: 7 }}>
            <Reply size={13} />
            Replying to {replyTo.senderName}: "{replyTo.text.length > 60 ? replyTo.text.slice(0, 60) + "…" : replyTo.text}"
            <button type="button" onClick={() => setReplyTo(null)} aria-label="Cancel reply" style={{ marginLeft: "auto", border: 0, background: "transparent", cursor: "pointer", color: "#0D7782" }}><X size={14} /></button>
          </div>
        )}

        {/* AC4: Priority selector within the compose message box */}
        <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 8 }}>
          <span style={{ color: "#546365", fontSize: 11, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>Priority:</span>
          {PRIORITIES.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setPriority(item)}
              style={{
                border: priority === item ? `2px solid ${PRIORITY_META[item].border}` : "1px solid #CFD8D9",
                borderRadius: 999,
                padding: "3px 10px",
                background: priority === item ? PRIORITY_META[item].background : "#fff",
                color: priority === item ? PRIORITY_META[item].color : "#737E7F",
                fontSize: 11,
                fontWeight: 700,
                cursor: "pointer",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
              }}
            >
              {item}
            </button>
          ))}
        </div>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => { if (e.key === "Enter" && e.ctrlKey) sendMessage(); }}
          placeholder={`Add a care coordination note for ${patient.name}... (Ctrl+Enter to send)`}
          rows={3}
          style={{ width: "100%", boxSizing: "border-box", border: 0, outline: 0, resize: "vertical", fontFamily: "inherit", color: "#273233", fontSize: 14 }}
        />
        {/* AC6: Footer showing selected priority and "Sending as [Name] ([Role])" */}
        <div style={{ display: "flex", alignItems: "center", borderTop: "1px solid #EEF2F2", paddingTop: 8, gap: 8 }}>
          <span style={{ color: "#697879", fontSize: 12 }}>Priority: <strong style={{ color: PRIORITY_META[priority].color }}>{priority}</strong></span>
          <span style={{ color: "#697879", fontSize: 12 }}>· Sending as {user.name}{user.credential ? `, ${user.credential}` : ""} · {user.role}</span>
          <Button variant="primary" size="sm" disabled={!canSend} onClick={sendMessage} rightIcon={<Send size={13} />} style={{ marginLeft: "auto" }}>Send Message</Button>
        </div>
      </div>

      {/* AC11: Delete confirmation modal */}
      {confirmDeleteId && (
        <div style={{ position: "fixed", inset: 0, zIndex: 400, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(0,0,0,0.4)", backdropFilter: "blur(2px)" }} onClick={() => setConfirmDeleteId(null)}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, maxWidth: 380, boxShadow: "0 24px 80px rgba(0,0,0,0.25)" }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{ width: 40, height: 40, borderRadius: "50%", background: "#F9E3E7", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                <Trash2 size={18} color="#A5213C" />
              </div>
              <div style={{ fontSize: 16, fontWeight: 700, color: "#273233" }}>Delete this message?</div>
            </div>
            <p style={{ color: "#546365", fontSize: 14, lineHeight: 1.5, marginBottom: 18 }}>This care coordination message will be permanently removed from the thread. This action cannot be undone.</p>
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
              <Button variant="secondary" size="md" onClick={() => setConfirmDeleteId(null)}>Cancel</Button>
              <Button variant="cta" size="md" onClick={confirmDelete}>Delete Message</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
