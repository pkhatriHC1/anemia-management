import { useEffect, useMemo, useState } from "react";
import { Check, MessageCircle, Pencil, Reply, Send, Trash2, Undo2, X } from "lucide-react";
import { Avatar, Badge, Button, Card, EmptyState, Tabs, Textarea } from "@hc1com/design-system";
import { ConfirmDialog } from "@hc1com/design-system/patterns";

const PRIORITIES = ["Routine", "Urgent", "Critical"];
/** Priority → DS badge tone and the message's left rule. */
const PRIORITY_META = {
  Routine: { variant: "info", rule: "border-l-[color:var(--hc-color-status-info-border)]" },
  Urgent: { variant: "warning", rule: "border-l-[color:var(--hc-color-status-warning-border)]" },
  Critical: { variant: "danger", rule: "border-l-[color:var(--hc-color-status-error-border)]" },
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

const MessageCard = ({ message, currentName, onReply, onEdit, onDelete, onResolve, parentMessage }) => {
  const meta = PRIORITY_META[message.priority];
  // AC10/AC11: Only the current user can edit/delete their own messages
  const isMine = message.senderName === currentName;
  return (
    <article className={`flex flex-col gap-8 rounded-control border border-l-4 border-[color:var(--hc-color-border-default)] ${meta.rule} px-16 py-12 ${message.isResolved ? "opacity-60" : ""}`}>
      <div className="flex items-start gap-12">
        <Avatar name={message.senderName} size="md" />
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <div className="flex flex-wrap items-baseline gap-8">
            <span className="text-14 font-semibold text-[color:var(--hc-color-text-primary)]">{message.senderName}{message.senderCredential ? `, ${message.senderCredential}` : ""}</span>
            {message.senderRole && <span className="text-12 text-[color:var(--hc-color-text-supporting)]">{message.senderRole}</span>}
            {/* AC12: Resolved indicator */}
            {message.isResolved && <Badge variant="success" appearance="soft" size="sm" leadingIcon={<Check />}>Resolved</Badge>}
          </div>
          <p className="whitespace-pre-wrap text-14 leading-relaxed text-[color:var(--hc-color-text-secondary)]">{message.text}</p>
          {/* AC9: Visual link back to the original message */}
          {message.parentId && parentMessage && (
            <span className="flex items-center gap-4 rounded-control bg-[color:var(--hc-color-bg-subtle)] px-8 py-4 text-12 text-[color:var(--hc-color-text-secondary)]">
              <Reply className="size-12 shrink-0" aria-hidden />
              <span className="truncate">Reply to {parentMessage.senderName}: “{parentMessage.text}”</span>
            </span>
          )}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-4">
          <Badge variant={meta.variant} appearance="soft" size="sm">{message.priority}</Badge>
          <span className="text-12 tabular-nums text-[color:var(--hc-color-text-tertiary)]">{formatTimestamp(message.editedAt || message.createdAt)}{message.editedAt && " · edited"}</span>
        </div>
      </div>
      {/* AC9/AC10/AC11/AC12: reply, resolve, edit (own only), delete (own only) */}
      <div className="flex justify-end gap-4">
        <Button variant="ghost" size="icon-xs" aria-label="Reply to message" onClick={() => onReply(message)}><Reply /></Button>
        <Button variant="ghost" size="icon-xs" aria-label={message.isResolved ? "Unresolve message" : "Resolve message"} onClick={() => onResolve(message)}>
          {message.isResolved ? <Undo2 /> : <Check />}
        </Button>
        {isMine && <Button variant="ghost" size="icon-xs" aria-label="Edit message" onClick={() => onEdit(message)}><Pencil /></Button>}
        {isMine && <Button variant="ghost" size="icon-xs" aria-label="Delete message" onClick={() => onDelete(message)}><Trash2 /></Button>}
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
    <Card variant="default" density="comfortable">
      <Card.Header>
        <Card.Icon><MessageCircle /></Card.Icon>
        <Card.Title>Care coordination channel</Card.Title>
        <Card.Description>{patient.name} · MRN {patient.id} · BloodHealth Co-Pilot</Card.Description>
        <Card.Actions>
          <Tabs variant="segmented" value={filterPriority} onValueChange={setFilterPriority} ariaLabel="Filter by priority">
            <Tabs.List>
              {["All", ...PRIORITIES].map(item => <Tabs.Tab key={item} value={item}>{item}</Tabs.Tab>)}
            </Tabs.List>
          </Tabs>
        </Card.Actions>
      </Card.Header>

      <Card.Content className="flex flex-col gap-16">
        {/* AC13: Messages sorted most-recent-first */}
        {messages.length === 0 ? (
          <EmptyState>
            <EmptyState.Icon><MessageCircle /></EmptyState.Icon>
            <EmptyState.Title>{filterPriority !== "All" ? `No ${filterPriority.toLowerCase()} messages` : "No care coordination messages yet"}</EmptyState.Title>
            <EmptyState.Description>Notes you and the care team add for this patient appear here.</EmptyState.Description>
          </EmptyState>
        ) : (
          <ul className="flex flex-col gap-8">
            {messages.map(message => (
              <li key={message.id}>
                {editingId === message.id ? (
                  <div className="flex flex-col gap-8 rounded-control border border-[color:var(--hc-color-border-default)] px-12 py-12">
                    <Textarea aria-label="Edit message" minRows={3} value={editingText} onChange={e => setEditingText(e.target.value)} autoFocus />
                    <div className="flex justify-end gap-8">
                      <Button variant="outline" size="sm" onClick={() => { setEditingId(null); setEditingText(""); }}>Cancel</Button>
                      <Button variant="default" size="sm" onClick={() => saveEdit(message)}>Save edit</Button>
                    </div>
                  </div>
                ) : (
                  <MessageCard
                    message={message}
                    currentName={user.name}
                    parentMessage={message.parentId ? messageMap[message.parentId] : null}
                    onReply={setReplyTo}
                    onEdit={item => { setEditingId(item.id); setEditingText(item.text); }}
                    onDelete={deleteMessage}
                    onResolve={toggleResolve}
                  />
                )}
              </li>
            ))}
          </ul>
        )}

        {/* AC4: Compose box with priority selector inside */}
        <div className="flex flex-col gap-12 rounded-control border border-[color:var(--hc-color-border-default)] px-16 py-12">
          {replyTo && (
            <div className="flex items-center gap-8 rounded-control bg-[color:var(--hc-color-bg-subtle)] px-12 py-8 text-12 text-[color:var(--hc-color-text-secondary)]">
              <Reply className="size-12 shrink-0" aria-hidden />
              <span className="min-w-0 flex-1 truncate">Replying to {replyTo.senderName}: “{replyTo.text}”</span>
              <Button variant="ghost" size="icon-xs" aria-label="Cancel reply" onClick={() => setReplyTo(null)}><X /></Button>
            </div>
          )}
          <div className="flex flex-wrap items-center gap-8">
            <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">Priority</span>
            <Tabs variant="segmented" value={priority} onValueChange={setPriority} ariaLabel="Message priority">
              <Tabs.List>
                {PRIORITIES.map(item => <Tabs.Tab key={item} value={item}>{item}</Tabs.Tab>)}
              </Tabs.List>
            </Tabs>
          </div>
          <Textarea
            aria-label="Care coordination note"
            minRows={3}
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter" && e.ctrlKey) sendMessage(); }}
            placeholder={`Add a care coordination note for ${patient.name}… (Ctrl+Enter to send)`}
          />
          {/* AC6: Footer showing selected priority and "Sending as [Name] ([Role])" */}
          <div className="flex flex-wrap items-center gap-8">
            <span className="text-12 text-[color:var(--hc-color-text-supporting)]">
              Sending as {user.name}{user.credential ? `, ${user.credential}` : ""} · {user.role}
            </span>
            <Badge variant={PRIORITY_META[priority].variant} appearance="soft" size="sm">{priority}</Badge>
            <Button variant="default" size="sm" className="ml-auto" disabled={!canSend} onClick={sendMessage}>
              <Send /> Send message
            </Button>
          </div>
        </div>
      </Card.Content>

      {/* AC11: Delete confirmation */}
      <ConfirmDialog
        open={!!confirmDeleteId}
        onOpenChange={o => { if (!o) setConfirmDeleteId(null); }}
        variant="destructive"
        title="Delete this message?"
        description="This care coordination message will be permanently removed from the thread. This action cannot be undone."
        confirmLabel="Delete message"
        onConfirm={confirmDelete}
        onCancel={() => setConfirmDeleteId(null)}
      />
    </Card>
  );
};
