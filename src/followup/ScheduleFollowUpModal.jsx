import { useState } from "react";
import { Alert, Button, Combobox, Dialog } from "@hc1com/design-system";
import { addFollowUp, getFollowUps, setFollowUpDecision } from "./followUpStore";
import { FollowUpFields } from "./FollowUpFields";
import { formatDateTime } from "./FollowUpWorklist";

/**
 * Schedule a follow-up visit. With `patient` (or `directPatient`) the patient is fixed;
 * otherwise the user picks one from `patients` first.
 */
export function ScheduleFollowUpModal({ patient, patients = [], onClose, directMode = false, directPatient = null }) {
  const isGlobal = !patient && !directMode;
  const [selectedId, setSelectedId] = useState(undefined);
  const [specialties, setSpecialties] = useState([]);
  const [followUpAt, setFollowUpAt] = useState(null);

  const selectedPatient = patients.find(p => p.id === selectedId) || null;
  const effectivePatient = directMode ? directPatient : isGlobal ? selectedPatient : patient;

  const scheduledFor = id => getFollowUps()
    .filter(v => v.patientId === id && v.status === "Scheduled")
    .sort((a, b) => new Date(a.followUpAt) - new Date(b.followUpAt));
  const duplicates = effectivePatient ? scheduledFor(effectivePatient.id) : [];

  const patientOptions = patients.map(p => {
    const next = scheduledFor(p.id)[0];
    return {
      value: p.id,
      label: p.name,
      description: [`MRN ${p.id}`, p.caseType, next && `Next follow-up ${formatDateTime(next.followUpAt)}`].filter(Boolean).join(" · "),
    };
  });

  const canConfirm = !!effectivePatient && specialties.length >= 1 && followUpAt !== null;
  const confirm = () => {
    if (!canConfirm) return;
    addFollowUp({
      patientId: effectivePatient.id,
      patientName: effectivePatient.name,
      dob: effectivePatient.dob,
      specialties,
      followUpAt,
      status: "Scheduled",
      referringProvider: effectivePatient.provider || "",
      createdBy: "Tiffany Hall",
      createdAt: new Date().toISOString(),
      source: directMode || isGlobal ? "Follow-Up Worklist" : "Patient Optimization Notification",
    });
    setFollowUpDecision(effectivePatient.id, "scheduled");
    onClose?.();
  };

  return (
    <Dialog open onOpenChange={o => { if (!o) onClose?.(); }}>
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>Schedule follow-up</Dialog.Title>
          <Dialog.Description>
            {effectivePatient ? `${effectivePatient.name} · MRN ${effectivePatient.id}` : "Choose the patient, referral specialty and visit time"}
          </Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-24 [&>*]:shrink-0">
          {isGlobal && (
            <Combobox
              label="Patient"
              required
              placeholder="Search patient name or MRN"
              searchPlaceholder="Search patient name or MRN"
              emptyMessage="No patients match"
              options={patientOptions}
              value={selectedId}
              onChange={setSelectedId}
              fullWidth
            />
          )}
          {effectivePatient && duplicates.length > 0 && (
            <Alert variant="warning">
              <Alert.Title>
                {effectivePatient.name} already has {duplicates.length} scheduled follow-up{duplicates.length === 1 ? "" : "s"}
              </Alert.Title>
              <Alert.Description>
                {duplicates.map(v => `${formatDateTime(v.followUpAt)} — ${(v.specialties || []).join(", ")}`).join("; ")}. You can still schedule another.
              </Alert.Description>
            </Alert>
          )}
          <FollowUpFields
            specialties={specialties}
            onSpecialtiesChange={setSpecialties}
            followUpAt={followUpAt}
            onFollowUpAtChange={setFollowUpAt}
          />
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Actions>
            <Button variant="outline" size="sm" onClick={onClose}>Cancel</Button>
            <Button variant="default" size="sm" onClick={confirm} disabled={!canConfirm}>Schedule follow-up</Button>
          </Dialog.Actions>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
