const CANCELLATIONS_KEY = "clinicaliq-visit-cancellations-v1";

export const MBH_CANCELLATION_REASONS = [
  "Cancelled/Postponed surgery",
  "Does not meet criteria for treatment",
  "Does not meet the HGB level for treatment",
  "Insurance delayed treatment",
  "Insurance denied treatment",
  "No contact from patient",
  "Patient Admitted to Hospital",
  "Patient declines treatment",
  "Patient has not received pre-admission testing",
  "Physician declines treatment of anemic patient",
  "Scheduling delayed for infusion",
  "Timing too close to surgery date",
];

const readCancellations = () => {
  try {
    const stored = window.localStorage.getItem(CANCELLATIONS_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch {
    return {};
  }
};

const writeCancellations = (cancellations) => {
  try {
    window.localStorage.setItem(CANCELLATIONS_KEY, JSON.stringify(cancellations));
    window.dispatchEvent(new Event("visit-cancellations-updated"));
  } catch {
    // Keep the current screen usable if browser storage is unavailable.
  }
};

export const getVisitCancellations = () => readCancellations();

export const getVisitCancellation = (patientId) => readCancellations()[patientId] || null;

export const cancelPatientVisit = ({ patientId, patientName, visitDate, reason, by = "Tiffany Hall" }) => {
  const cancellation = {
    patientId,
    patientName,
    visitDate,
    reason,
    cancelledAt: new Date().toISOString(),
    cancelledBy: by,
  };
  const cancellations = readCancellations();
  cancellations[patientId] = cancellation;
  writeCancellations(cancellations);
  return cancellation;
};
