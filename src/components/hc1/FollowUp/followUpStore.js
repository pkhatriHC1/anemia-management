const STORAGE_KEY = "clinicaliq-follow-ups-v2";
const DECISIONS_KEY = "clinicaliq-follow-up-decisions";

export const CAN_CLINICAL_NAVIGATION = true;

const SPECIALTIES = ["Non-Surgical Medical", "Women's Health-Non-Surgical"];

const PROVIDER_BY_PATIENT = {
  "DM-5521": "Dr. Patel",
  "JK-2210": "Dr. Singh",
  "RP-4401": "Dr. Kim",
  "TW-1180": "Dr. Adams",
  "LF-3301": "Dr. Okafor",
  "CM-8834": "Dr. Nguyen",
};

const SEED_VISITS = [
  {
    id: "fu-seed-1",
    patientId: "DM-5521",
    patientName: "Dorothy Marsh",
    dob: "08/30/1954",
    specialties: ["Non-Surgical Medical"],
    followUpAt: "2026-10-02T09:30:00",
    status: "Scheduled",
    referringProvider: "Dr. Patel",
    createdBy: "Tiffany Hall",
    createdAt: "2026-09-24T14:12:00",
    source: "Patient Optimization Notification",
  },
  {
    id: "fu-seed-2",
    patientId: "JK-2210",
    patientName: "James Kowalski",
    dob: "01/14/1960",
    specialties: ["Non-Surgical Medical", "Women's Health-Non-Surgical"],
    followUpAt: "2026-10-08T11:00:00",
    status: "Scheduled",
    referringProvider: "Dr. Singh",
    createdBy: "Tiffany Hall",
    createdAt: "2026-09-24T14:15:00",
    source: "Patient Optimization Notification",
  },
  {
    id: "fu-seed-3",
    patientId: "RP-4401",
    patientName: "Rita Patel",
    dob: "05/21/1945",
    specialties: ["Women's Health-Non-Surgical"],
    followUpAt: "2026-09-29T13:45:00",
    status: "Scheduled",
    referringProvider: "Dr. Kim",
    createdBy: "Tiffany Hall",
    createdAt: "2026-09-24T14:18:00",
    source: "Patient Optimization Notification",
  },
  {
    id: "fu-seed-4",
    patientId: "TW-1180",
    patientName: "Thomas Webb",
    dob: "11/03/1971",
    specialties: ["Non-Surgical Medical"],
    followUpAt: "2026-09-15T08:15:00",
    status: "Completed",
    referringProvider: "Dr. Adams",
    createdBy: "Tiffany Hall",
    createdAt: "2026-09-14T10:00:00",
    source: "Patient Optimization Notification",
  },
  {
    id: "fu-seed-5",
    patientId: "LF-3301",
    patientName: "Linda Foster",
    dob: "06/18/1963",
    specialties: ["Non-Surgical Medical"],
    followUpAt: "2026-09-20T10:30:00",
    status: "Cancelled",
    referringProvider: "Dr. Okafor",
    createdBy: "Tiffany Hall",
    createdAt: "2026-09-19T09:00:00",
    source: "Patient Optimization Notification",
  },
  {
    id: "fu-seed-6",
    patientId: "TW-1180",
    patientName: "Thomas Webb",
    dob: "11/03/1971",
    specialties: ["Non-Surgical Medical"],
    followUpAt: "2026-09-21T10:00:00",
    status: "Scheduled",
    referringProvider: "Dr. Adams",
    createdBy: "Tiffany Hall",
    createdAt: "2026-09-20T08:00:00",
    source: "Patient Optimization Notification",
  },
];

const readVisits = () => {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : SEED_VISITS;
  } catch {
    return SEED_VISITS;
  }
};

const writeVisits = (visits) => {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(visits));
    window.dispatchEvent(new Event("follow-ups-updated"));
  } catch {
    // ignore
  }
};

const readDecisions = () => {
  try {
    const stored = window.localStorage.getItem(DECISIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const writeDecisions = (decisions) => {
  try {
    window.localStorage.setItem(DECISIONS_KEY, JSON.stringify(decisions));
    window.dispatchEvent(new Event("follow-ups-updated"));
  } catch {
    // ignore
  }
};

export const getFollowUps = () => readVisits();

export const addFollowUp = (visit) => {
  const visits = readVisits();
  const next = [
    {
      id: visit.id || crypto.randomUUID(),
      patientId: visit.patientId,
      patientName: visit.patientName,
      dob: visit.dob,
      specialties: visit.specialties || [],
      followUpAt: visit.followUpAt,
      status: visit.status || "Scheduled",
      referringProvider: visit.referringProvider || "",
      createdBy: visit.createdBy || "Tiffany Hall",
      createdAt: visit.createdAt || new Date().toISOString(),
      source: visit.source || "Patient Optimization Notification",
    },
    ...visits,
  ];
  writeVisits(next);
  return next;
};

export const updateFollowUp = (id, patch) => {
  const visits = readVisits();
  const next = visits.map((v) =>
    v.id === id
      ? { ...v, ...patch, updatedAt: new Date().toISOString(), updatedBy: "Tiffany Hall" }
      : v
  );
  writeVisits(next);
  return next;
};

export const getFollowUpDecision = (patientId) => {
  const decisions = readDecisions();
  return decisions[patientId] || null;
};

export const setFollowUpDecision = (patientId, decision) => {
  const decisions = readDecisions();
  decisions[patientId] = decision;
  writeDecisions(decisions);
};

export const getProviderByPatientId = (patientId) => PROVIDER_BY_PATIENT[patientId] || "";

export { SPECIALTIES };
