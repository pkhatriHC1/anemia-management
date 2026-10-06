// Client-level Epic message pool configuration + provider directory + case completion + audit trail.
// All persisted to localStorage with window event dispatch, matching followUpStore conventions.

const POOLS_KEY = "clinicaliq-epic-pools-v1";
const COMPLETIONS_KEY = "clinicaliq-case-completions-v1";
const AUDIT_KEY = "clinicaliq-audit-trail-v1";

const uid = () =>
  typeof crypto !== "undefined" && crypto.randomUUID
    ? crypto.randomUUID()
    : "h-" + Math.random().toString(36).slice(2) + Date.now().toString(36);
const nowISO = () => new Date().toISOString();
const dispatch = (evt) => {
  try {
    window.dispatchEvent(new Event(evt));
  } catch {
    // ignore
  }
};

// ── Epic message pools ──
const SEED_POOLS = [
  { id: "pool-1", name: "Anemia Optimization", poolId: "ANEMIA-OPT", active: true },
  { id: "pool-2", name: "Pre-Surgical Clearance", poolId: "PRE-SURG-CLEAR", active: true },
  { id: "pool-3", name: "Hematology Triage", poolId: "HEM-TRIAGE", active: false },
];

const readPools = () => {
  try {
    const stored = window.localStorage.getItem(POOLS_KEY);
    return stored ? JSON.parse(stored) : SEED_POOLS;
  } catch {
    return SEED_POOLS;
  }
};

const writePools = (pools) => {
  try {
    window.localStorage.setItem(POOLS_KEY, JSON.stringify(pools));
    dispatch("epic-pools-updated");
  } catch {
    // ignore
  }
};

export const getEpicPools = () => readPools();

export const getActiveEpicPools = () => readPools().filter((p) => p.active);

export const saveEpicPool = (pool) => {
  const pools = readPools();
  if (pool.id) {
    const next = pools.map((p) => (p.id === pool.id ? { ...p, ...pool } : p));
    writePools(next);
    return next;
  }
  const entry = { id: uid(), name: pool.name, poolId: pool.poolId, active: pool.active ?? true };
  writePools([entry, ...pools]);
  return entry;
};

export const togglePoolActive = (id) => {
  const next = readPools().map((p) => (p.id === id ? { ...p, active: !p.active } : p));
  writePools(next);
  return next;
};

export const deleteEpicPool = (id) => {
  writePools(readPools().filter((p) => p.id !== id));
};

// ── Provider directory (for search by name or NPI) ──
const PROVIDER_DIRECTORY = [
  { id: "pr-1", name: "Dr. Emily Carter", npi: "1234567890", specialty: "Hematology" },
  { id: "pr-2", name: "Dr. James Lee", npi: "1234567891", specialty: "Internal Medicine" },
  { id: "pr-3", name: "Dr. Sarah Chen", npi: "1234567892", specialty: "Anesthesiology" },
  { id: "pr-4", name: "Dr. Michael Brown", npi: "1234567893", specialty: "Cardiology" },
  { id: "pr-5", name: "Dr. Jessica Rodriguez", npi: "1234567894", specialty: "OB/GYN" },
  { id: "pr-6", name: "Dr. David Kim", npi: "1234567895", specialty: "General Surgery" },
  { id: "pr-7", name: "Dr. Rachel Green", npi: "1234567896", specialty: "Nephrology" },
  { id: "pr-8", name: "Dr. Robert Taylor", npi: "1234567897", specialty: "Orthopedic Surgery" },
  { id: "pr-9", name: "Dr. Maria Santos", npi: "1234567898", specialty: "Hematology Oncology" },
  { id: "pr-10", name: "Dr. Kevin Walsh", npi: "1234567899", specialty: "Infusion Center" },
  { id: "pr-11", name: "Dr. Linda Park", npi: "1234567800", specialty: "Internal Medicine" },
  { id: "pr-12", name: "Dr. Thomas Reid", npi: "1234567801", specialty: "Anesthesiology" },
];

export const searchProviders = (query) => {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return PROVIDER_DIRECTORY.filter(
    (pr) =>
      pr.name.toLowerCase().includes(q) ||
      pr.npi.includes(q.replace(/\D/g, ""))
  );
};

// ── Case completion tracking ──
const readCompletions = () => {
  try {
    const stored = window.localStorage.getItem(COMPLETIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const writeCompletions = (completions) => {
  try {
    window.localStorage.setItem(COMPLETIONS_KEY, JSON.stringify(completions));
    dispatch("case-completions-updated");
  } catch {
    // ignore
  }
};

export const isCaseCompleted = (patientId) => {
  const completions = readCompletions();
  return Boolean(completions[patientId]);
};

export const getCompletedPatients = () => {
  const completions = readCompletions();
  return Object.keys(completions).filter((id) => completions[id]);
};

export const completeCase = (patientId, data) => {
  const completions = readCompletions();
  completions[patientId] = {
    patientId,
    completedAt: nowISO(),
    completedBy: data.completedBy || "Tiffany Hall",
    medication: data.medication,
    dose: data.dose,
    numberOfDoses: data.numberOfDoses,
    recipients: data.recipients,
    messageContent: data.messageContent,
    followUpScheduled: data.followUpScheduled || false,
  };
  writeCompletions(completions);
  return completions[patientId];
};

// ── Audit trail ──
const readAudit = () => {
  try {
    const stored = window.localStorage.getItem(AUDIT_KEY);
    return stored ? JSON.parse(stored) : [];
  } catch {
    return [];
  }
};

const writeAudit = (entries) => {
  try {
    window.localStorage.setItem(AUDIT_KEY, JSON.stringify(entries));
    dispatch("audit-trail-updated");
  } catch {
    // ignore
  }
};

export const getAuditTrail = (patientId) => {
  const entries = readAudit();
  return patientId ? entries.filter((e) => e.patientId === patientId) : entries;
};

export const addAuditEntry = (entry) => {
  const entries = readAudit();
  const record = {
    id: uid(),
    patientId: entry.patientId,
    patientName: entry.patientName,
    at: nowISO(),
    by: entry.by || "Tiffany Hall",
    action: entry.action,
    recipients: entry.recipients || [],
    messageContent: entry.messageContent || "",
    medication: entry.medication || "",
    dose: entry.dose || "",
    numberOfDoses: entry.numberOfDoses || 0,
  };
  writeAudit([record, ...entries]);
  return record;
};
