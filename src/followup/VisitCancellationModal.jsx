import { useState } from "react";
import { Button, Dialog, Radio, RadioGroup } from "@hc1com/design-system";
import { MBH_CANCELLATION_REASONS } from "./visitCancellationStore";

const formatDate = value => {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return value || "—";
  return `${String(d.getMonth() + 1).padStart(2, "0")}/${String(d.getDate()).padStart(2, "0")}/${d.getFullYear()}`;
};

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-4">
      <span className="text-12 font-medium text-[color:var(--hc-color-text-supporting)]">{label}</span>
      <span className="text-14 font-medium tabular-nums text-[color:var(--hc-color-text-primary)]">{children}</span>
    </div>
  );
}

/** Cancel a patient's visit from the worklist, with a required reason. */
export function VisitCancellationModal({ patient, onClose, onConfirm }) {
  const [reason, setReason] = useState("");
  return (
    <Dialog open onOpenChange={o => { if (!o) onClose(); }}>
      <Dialog.Content size="md">
        <Dialog.Header>
          <Dialog.Title>Cancel visit</Dialog.Title>
          <Dialog.Description>Choose a reason to remove this visit from the active worklist.</Dialog.Description>
        </Dialog.Header>
        <Dialog.Body className="flex flex-col gap-24 [&>*]:shrink-0">
          <div className="grid grid-cols-3 gap-16 rounded-[var(--hc-radius-8)] bg-[color:var(--hc-color-bg-subtle)] p-16">
            <Field label="Patient">{patient.name}</Field>
            <Field label="MRN">{patient.id}</Field>
            <Field label="Visit date">{formatDate(patient.admitDate)}</Field>
          </div>
          <RadioGroup
            label={<>Cancellation reason <span className="text-[color:var(--hc-color-status-error-fg)]" aria-hidden>*</span></>}
            aria-required="true"
            value={reason} onValueChange={setReason} name="visit-cancellation-reason">
            {MBH_CANCELLATION_REASONS.map(r => <Radio key={r} value={r}>{r}</Radio>)}
          </RadioGroup>
        </Dialog.Body>
        <Dialog.Footer>
          <Dialog.Actions>
            <Button variant="outline" size="sm" onClick={onClose}>Keep visit</Button>
            <Button variant="destructive" size="sm" onClick={() => onConfirm(reason)} disabled={!reason}>Cancel visit</Button>
          </Dialog.Actions>
        </Dialog.Footer>
      </Dialog.Content>
    </Dialog>
  );
}
